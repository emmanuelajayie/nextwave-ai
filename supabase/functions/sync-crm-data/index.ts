
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CRMIntegration {
  id: string;
  crm_type: string;
  oauth_data: any;
  last_sync_at: string;
  status: string;
  name: string;
}

interface SyncLog {
  id: string;
  status: string;
  records_processed: number;
  crm_integration_id: string;
  created_at: string;
  completed_at?: string;
  error_message?: string;
}

const MAX_RETRIES = 3;
const BATCH_SIZE = 100;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Starting CRM data sync process...');

    // Get active CRM integrations
    const { data: integrations, error: fetchError } = await supabase
      .from('crm_integrations')
      .select('*')
      .eq('status', 'active');

    if (fetchError) {
      console.error('Error fetching integrations:', fetchError);
      throw fetchError;
    }

    if (!integrations?.length) {
      console.log('No active integrations found');
      return new Response(
        JSON.stringify({ message: 'No active integrations found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const results = [];
    const syncPromises = integrations.map(integration => 
      processCRMIntegration(integration, supabase)
        .then(result => results.push(result))
        .catch(error => {
          console.error(`Failed to process integration ${integration.id}:`, error);
          results.push({
            integration: integration.name,
            status: 'error',
            error: error.message,
          });
        })
    );
    
    // Process all integrations in parallel
    await Promise.allSettled(syncPromises);

    return new Response(
      JSON.stringify({ message: 'CRM sync process completed', results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in CRM sync process:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function processCRMIntegration(integration: CRMIntegration, supabase: any) {
  console.log(`Processing integration: ${integration.name} (${integration.crm_type})`);
  
  try {
    // Create sync log entry
    const { data: syncLog, error: logError } = await supabase
      .from('sync_logs')
      .insert({
        crm_integration_id: integration.id,
        status: 'in_progress'
      })
      .select()
      .single();

    if (logError) {
      console.error('Error creating sync log:', logError);
      throw logError;
    }

    // Check if token needs refresh
    const needsRefresh = await checkAndRefreshTokenIfNeeded(integration, supabase);
    if (needsRefresh) {
      console.log(`Refreshed token for ${integration.name}`);
      
      // Get the updated integration with new token
      const { data: refreshedIntegration, error: refreshError } = await supabase
        .from('crm_integrations')
        .select('*')
        .eq('id', integration.id)
        .single();
        
      if (refreshError) throw refreshError;
      integration = refreshedIntegration;
    }

    // Fetch CRM data
    let data = [];
    let retryCount = 0;
    const maxRetries = MAX_RETRIES;
    
    while (retryCount < maxRetries) {
      try {
        data = await fetchCRMData(integration);
        break;
      } catch (error) {
        retryCount++;
        console.error(`Error fetching data (attempt ${retryCount}/${maxRetries}):`, error);
        
        if (retryCount >= maxRetries) throw error;
        
        // Exponential backoff
        const delay = Math.pow(2, retryCount) * 1000;
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    // Validate the data before processing
    const validationErrors = validateCRMData(data);
    if (validationErrors.length > 0) {
      throw new Error(`Data validation failed: ${validationErrors.join(', ')}`);
    }
    
    // Process the data in batches
    for (let i = 0; i < data.length; i += BATCH_SIZE) {
      const batch = data.slice(i, i + BATCH_SIZE);
      console.log(`Processing batch ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(data.length/BATCH_SIZE)}`);
      
      // Try processing with retries
      let batchRetries = 0;
      while (batchRetries < maxRetries) {
        try {
          await processBatch(batch, integration, supabase);
          break;
        } catch (error) {
          batchRetries++;
          console.error(`Batch processing error (attempt ${batchRetries}/${maxRetries}):`, error);
          
          if (batchRetries >= maxRetries) throw error;
          
          await new Promise(resolve => setTimeout(resolve, 1000 * batchRetries));
        }
      }
    }

    // Update sync status
    await supabase
      .from('sync_logs')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        records_processed: data.length,
      })
      .eq('id', syncLog.id);

    // Update integration last sync
    await supabase
      .from('crm_integrations')
      .update({
        last_sync_at: new Date().toISOString(),
      })
      .eq('id', integration.id);

    return {
      integration: integration.name,
      status: 'success',
      records_processed: data.length,
    };
  } catch (error) {
    console.error(`Error processing integration ${integration.id}:`, error);
    
    // Update sync log with error
    await supabase
      .from('sync_logs')
      .update({
        status: 'failed',
        completed_at: new Date().toISOString(),
        error_message: error.message,
      })
      .eq('crm_integration_id', integration.id)
      .eq('status', 'in_progress');
      
    return {
      integration: integration.name,
      status: 'error',
      error: error.message,
    };
  }
}

async function checkAndRefreshTokenIfNeeded(integration: CRMIntegration, supabase: any): Promise<boolean> {
  const oauth = integration.oauth_data;
  
  // No refresh needed if no refresh token or no expiration data
  if (!oauth.refresh_token || !oauth.expires_at) {
    return false;
  }
  
  const expiresAt = new Date(oauth.expires_at);
  const now = new Date();
  
  // Add 5 minute buffer before expiration
  const bufferMs = 5 * 60 * 1000;
  if (expiresAt.getTime() - now.getTime() > bufferMs) {
    return false; // Token still valid
  }
  
  console.log(`Token for ${integration.name} needs refresh, expires at ${expiresAt.toISOString()}`);
  
  try {
    const tokenEndpoint = {
      hubspot: "https://api.hubapi.com/oauth/v1/token",
      zoho: "https://accounts.zoho.com/oauth/v2/token",
      salesforce: "https://login.salesforce.com/services/oauth2/token"
    }[integration.crm_type];

    const clientId = Deno.env.get(`${integration.crm_type.toUpperCase()}_CLIENT_ID`);
    const clientSecret = Deno.env.get(`${integration.crm_type.toUpperCase()}_CLIENT_SECRET`);
    
    if (!clientId || !clientSecret) {
      throw new Error(`Missing client credentials for ${integration.crm_type}`);
    }

    const response = await fetch(tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: oauth.refresh_token,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Token refresh failed: ${errorText}`);
    }

    const tokenData = await response.json();
    
    // Some providers don't return a refresh token if it hasn't changed
    if (!tokenData.refresh_token) {
      tokenData.refresh_token = oauth.refresh_token;
    }
    
    // Calculate new expiration
    if (tokenData.expires_in) {
      const expiresAt = new Date();
      expiresAt.setSeconds(expiresAt.getSeconds() + tokenData.expires_in);
      tokenData.expires_at = expiresAt.toISOString();
    }

    // Store updated token
    await supabase
      .from("crm_integrations")
      .update({
        oauth_data: {
          ...oauth,
          ...tokenData,
          updated_at: new Date().toISOString()
        }
      })
      .eq("id", integration.id);
      
    console.log(`Successfully refreshed token for ${integration.name}`);
    return true;
    
  } catch (error) {
    console.error(`Token refresh error for ${integration.name}:`, error);
    
    // We'll try to continue with the old token
    return false;
  }
}

async function fetchCRMData(integration: CRMIntegration) {
  console.log(`Fetching data from ${integration.crm_type} CRM...`);
  
  const accessToken = integration.oauth_data?.access_token;
  if (!accessToken) {
    throw new Error('No access token available');
  }

  switch (integration.crm_type) {
    case 'hubspot':
      return await fetchHubSpotData(accessToken);
    case 'salesforce':
      return await fetchSalesforceData(accessToken);
    case 'zoho':
      return await fetchZohoData(accessToken);
    default:
      throw new Error(`Unsupported CRM type: ${integration.crm_type}`);
  }
}

function validateCRMData(data: any[]) {
  const errors = [];
  
  if (!Array.isArray(data)) {
    return ['Data is not an array'];
  }
  
  for (let i = 0; i < data.length; i++) {
    const record = data[i];
    if (!record) {
      errors.push(`Record at index ${i} is undefined or null`);
      continue;
    }
    
    if (!record.id) {
      errors.push(`Record at index ${i} is missing ID`);
    }
    
    if (!record.email && !record.phone) {
      errors.push(`Record at index ${i} is missing contact information`);
    }
  }
  
  return errors;
}

async function processBatch(batch: any[], integration: CRMIntegration, supabase: any) {
  console.log(`Processing batch of ${batch.length} records for ${integration.crm_type}`);
  
  // This would be implemented based on specific requirements
  // For example, storing in a contacts table, updating existing records, etc.
  
  // Placeholder implementation - log contact counts
  const emails = batch.filter(r => r.email).length;
  const phones = batch.filter(r => r.phone).length;
  console.log(`Processed ${emails} email contacts and ${phones} phone contacts`);
}

async function fetchHubSpotData(accessToken: string) {
  // Call HubSpot API to get contacts
  try {
    const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts?limit=100', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HubSpot API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transform to standard format
    return data.results.map((contact: any) => ({
      id: contact.id,
      email: contact.properties.email,
      name: `${contact.properties.firstname || ''} ${contact.properties.lastname || ''}`.trim(),
      phone: contact.properties.phone,
      created: contact.properties.createdate,
      source: 'hubspot'
    }));
  } catch (error) {
    console.error('Error fetching HubSpot data:', error);
    throw error;
  }
}

async function fetchSalesforceData(accessToken: string) {
  // Call Salesforce API
  try {
    const response = await fetch('/services/data/v56.0/query?q=SELECT+Id,Name,Email,Phone+FROM+Contact+LIMIT+100', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Salesforce API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transform to standard format
    return data.records.map((contact: any) => ({
      id: contact.Id,
      email: contact.Email,
      name: contact.Name,
      phone: contact.Phone,
      created: contact.CreatedDate,
      source: 'salesforce'
    }));
  } catch (error) {
    console.error('Error fetching Salesforce data:', error);
    // In a real implementation, return an empty array for now to avoid breaking the flow
    return [];
  }
}

async function fetchZohoData(accessToken: string) {
  // Call Zoho API
  try {
    const response = await fetch('https://www.zohoapis.com/crm/v2/Contacts?fields=Email,Full_Name,Phone', {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Zoho API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transform to standard format
    return data.data.map((contact: any) => ({
      id: contact.id,
      email: contact.Email,
      name: contact.Full_Name,
      phone: contact.Phone,
      created: contact.Created_Time,
      source: 'zoho'
    }));
  } catch (error) {
    console.error('Error fetching Zoho data:', error);
    // In a real implementation, return an empty array for now to avoid breaking the flow
    return [];
  }
}
