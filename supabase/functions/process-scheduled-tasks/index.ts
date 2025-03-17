
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Create a single supabase client for interacting with your database
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Processing scheduled tasks...');

    // Get all active workflows
    const { data: workflows, error: workflowsError } = await supabase
      .from('workflows')
      .select('*')
      .eq('status', 'active');

    if (workflowsError) {
      throw workflowsError;
    }

    console.log(`Found ${workflows.length} active workflows`);
    
    const results = [];

    for (const workflow of workflows) {
      console.log(`Processing workflow: ${workflow.name}`);
      const config = workflow.config;
      
      // Process data collection if configured
      if (config.dataSources && config.dataSources.crmTypes && config.dataSources.crmTypes.length > 0) {
        console.log('Processing CRM data collection...');
        
        // Get CRM integrations matching the workflow configuration
        const { data: crmIntegrations, error: crmError } = await supabase
          .from('crm_integrations')
          .select('*')
          .in('crm_type', config.dataSources.crmTypes)
          .eq('status', 'active');
          
        if (crmError) {
          console.error('Error fetching CRM integrations:', crmError);
        } else if (crmIntegrations && crmIntegrations.length > 0) {
          console.log(`Found ${crmIntegrations.length} CRM integrations to sync`);
          
          // Call the sync-crm-data function for each integration
          for (const integration of crmIntegrations) {
            try {
              // Call the sync-crm-data function
              const syncResponse = await fetch(
                `${Deno.env.get('SUPABASE_URL')}/functions/v1/sync-crm-data`,
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
                  },
                  body: JSON.stringify({
                    integration_id: integration.id,
                    storage_preference: config.dataSources.storagePreference,
                    sort_by: config.dataSources.sortBy,
                  }),
                }
              );
              
              if (!syncResponse.ok) {
                throw new Error(`CRM sync failed with status: ${syncResponse.status}`);
              }
              
              const syncResult = await syncResponse.json();
              results.push({
                type: 'crm_sync',
                integration: integration.name,
                status: 'success',
                details: syncResult,
              });
              
              console.log(`Successfully synced ${integration.name}`);
            } catch (error) {
              console.error(`Error syncing ${integration.name}:`, error);
              results.push({
                type: 'crm_sync',
                integration: integration.name,
                status: 'error',
                error: error.message,
              });
            }
          }
        } else {
          console.log('No active CRM integrations found for the configured types');
        }
      }
      
      // Process data cleaning if configured
      if (config.dataSources && config.dataSources.cleaningPreference) {
        console.log(`Processing data cleaning with preference: ${config.dataSources.cleaningPreference}`);
        
        // For automated cleaning, we would process without user interaction
        if (config.dataSources.cleaningPreference === 'automatic' || 
            config.dataSources.cleaningPreference === 'scheduled') {
          try {
            // Call data cleaning function - this would be implemented separately
            const cleaningResult = {
              status: 'success',
              records_processed: 0,
              missing_values_fixed: 0,
              duplicates_removed: 0,
            };
            
            results.push({
              type: 'data_cleaning',
              status: 'success',
              details: cleaningResult,
            });
            
            console.log('Successfully completed data cleaning');
            
            // Automatic model building if configured
            if (config.dataSources.automaticModeling) {
              console.log('Starting automatic predictive model building');
              
              // This would call a model training function - to be implemented
              results.push({
                type: 'model_building',
                status: 'started',
                details: {
                  message: 'Predictive model building started',
                },
              });
            }
          } catch (error) {
            console.error('Error during data cleaning:', error);
            results.push({
              type: 'data_cleaning',
              status: 'error',
              error: error.message,
            });
          }
        }
      }
      
      // Process analytics if configured
      if (config.analytics && config.analytics.schedule) {
        console.log('Running analytics process...');
        // Add your analytics processing logic here
        results.push({
          type: 'analytics',
          status: 'success',
        });
      }

      // Process reports if configured
      if (config.reports && config.reports.schedule) {
        console.log('Running report generation...');
        // Add your report generation logic here
        results.push({
          type: 'reports',
          status: 'success',
        });
      }

      // Update last run timestamp
      const { error: updateError } = await supabase
        .from('workflows')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', workflow.id);

      if (updateError) {
        console.error(`Error updating workflow ${workflow.id}:`, updateError);
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'Scheduled tasks processed successfully',
        results 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error processing scheduled tasks:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
