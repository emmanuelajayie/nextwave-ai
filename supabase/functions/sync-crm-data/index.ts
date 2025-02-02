import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CRMIntegration {
  id: string;
  crm_type: string;
  api_key: string;
  sync_destination: string;
  sheets_config: any;
  excel_config: any;
  batch_size: number;
  last_processed_record_id: string;
}

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

    // Get active CRM integrations with proper error handling
    const { data: integrations, error: fetchError } = await supabase
      .from('crm_integrations')
      .select('*, teams!inner(*)')
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
    for (const integration of integrations) {
      console.log(`Processing integration: ${integration.name}`);

      try {
        // Create sync log entry with proper error handling
        const { data: syncLog, error: logError } = await supabase
          .from('sync_logs')
          .insert({
            crm_integration_id: integration.id,
            destination: integration.sync_destination,
          })
          .select()
          .single();

        if (logError) throw logError;

        // Fetch and process CRM data
        const data = await fetchCRMData(integration);
        
        // Store data based on destination preference
        if (integration.sync_destination === 'sheets') {
          await syncToGoogleSheets(data, integration);
        } else {
          await syncToExcel(data, integration);
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

        results.push({
          integration: integration.name,
          status: 'success',
          records_processed: data.length,
        });

      } catch (error) {
        console.error(`Error processing integration ${integration.id}:`, error);
        results.push({
          integration: integration.name,
          status: 'error',
          error: error.message,
        });
      }
    }

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

async function fetchCRMData(integration: CRMIntegration) {
  console.log(`Fetching data from ${integration.crm_type} CRM...`);
  
  switch (integration.crm_type) {
    case 'hubspot':
      // Implement HubSpot API calls
      return [];
    case 'salesforce':
      // Implement Salesforce API calls
      return [];
    case 'zoho':
      // Implement Zoho API calls
      return [];
    default:
      throw new Error(`Unsupported CRM type: ${integration.crm_type}`);
  }
}

async function syncToGoogleSheets(data: any[], integration: CRMIntegration) {
  console.log('Syncing data to Google Sheets...');
  // Implement Google Sheets API integration
}

async function syncToExcel(data: any[], integration: CRMIntegration) {
  console.log('Syncing data to Excel...');
  // Implement Excel Online API integration
}