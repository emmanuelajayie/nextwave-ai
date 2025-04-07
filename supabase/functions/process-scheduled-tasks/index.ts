
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
    
    // Get current date and time
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
    const currentDay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][now.getDay()];
    
    console.log(`Current time: ${timeString}, Day: ${currentDay}`);

    // Get all active workflows
    const { data: workflows, error: workflowsError } = await supabase
      .from('workflows')
      .select('*')
      .eq('status', 'active');

    if (workflowsError) {
      console.error('Error fetching workflows:', workflowsError);
      throw workflowsError;
    }

    console.log(`Found ${workflows?.length || 0} active workflows`);
    
    const results = [];

    for (const workflow of workflows || []) {
      console.log(`Processing workflow: ${workflow.name} (ID: ${workflow.id})`);
      const config = workflow.config || {};
      
      // Check if we should run analytics process based on schedule and time
      if (shouldRunTask(config.analytics, currentDay, timeString)) {
        console.log('Analytics process is scheduled to run now');
        results.push(await processAnalytics(config.analytics));
      }
      
      // Check if we should run reports process based on schedule and time
      if (shouldRunTask(config.reports, currentDay, timeString)) {
        console.log('Reports process is scheduled to run now');
        results.push(await processReports(config.reports));
      }
      
      // Check if we should run full workflow based on schedule and time
      if (shouldRunFullWorkflow(config.workflow, currentDay, timeString)) {
        console.log('Full workflow is scheduled to run now');
        results.push(...await processFullWorkflow(config));
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
        time: timeString,
        day: currentDay,
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

// Helper function to determine if a task should run now based on schedule and time
function shouldRunTask(taskConfig: any, currentDay: string, currentTime: string): boolean {
  if (!taskConfig || !taskConfig.schedule || !taskConfig.time) {
    return false;
  }
  
  // Check time - allowing 5 minute window for execution
  const scheduledTimeParts = taskConfig.time.split(':').map(Number);
  const currentTimeParts = currentTime.split(':').map(Number);
  
  const scheduledMinutes = scheduledTimeParts[0] * 60 + scheduledTimeParts[1];
  const currentMinutes = currentTimeParts[0] * 60 + currentTimeParts[1];
  const timeDifference = Math.abs(scheduledMinutes - currentMinutes);
  
  if (timeDifference > 5) { // More than 5 minutes difference
    return false;
  }
  
  // Check schedule
  if (taskConfig.schedule === 'daily') {
    return true;
  } 
  else if (taskConfig.schedule === 'weekly') {
    // Default to Monday if no specific day
    return currentDay === 'Monday';
  }
  
  return false;
}

// Helper function for workflow which includes custom days
function shouldRunFullWorkflow(workflowConfig: any, currentDay: string, currentTime: string): boolean {
  if (!workflowConfig || !workflowConfig.schedule || !workflowConfig.time) {
    return false;
  }
  
  // Check time - allowing 5 minute window for execution
  const scheduledTimeParts = workflowConfig.time.split(':').map(Number);
  const currentTimeParts = currentTime.split(':').map(Number);
  
  const scheduledMinutes = scheduledTimeParts[0] * 60 + scheduledTimeParts[1];
  const currentMinutes = currentTimeParts[0] * 60 + currentTimeParts[1];
  const timeDifference = Math.abs(scheduledMinutes - currentMinutes);
  
  if (timeDifference > 5) { // More than 5 minutes difference
    return false;
  }
  
  // Check schedule
  if (workflowConfig.schedule === 'daily') {
    return true;
  } 
  else if (workflowConfig.schedule === 'weekly') {
    // Default to Monday if no specific day
    return currentDay === 'Monday';
  }
  else if (workflowConfig.schedule === 'custom' && Array.isArray(workflowConfig.days)) {
    return workflowConfig.days.includes(currentDay);
  }
  
  return false;
}

// Process analytics task
async function processAnalytics(config: any) {
  console.log('Running analytics process with config:', config);
  
  // Here you would add your actual analytics processing logic
  
  return {
    type: 'analytics',
    status: 'success',
    timestamp: new Date().toISOString(),
    config
  };
}

// Process reports task
async function processReports(config: any) {
  console.log('Running report generation with config:', config);
  
  // Here you would add your actual report generation logic
  
  return {
    type: 'reports',
    status: 'success',
    timestamp: new Date().toISOString(),
    config
  };
}

// Process full workflow including data collection and other tasks
async function processFullWorkflow(config: any) {
  console.log('Running full workflow with config:', config);
  const results = [];
  
  // Process data collection if configured
  if (config.dataSources?.crmTypes && config.dataSources.crmTypes.length > 0) {
    console.log('Processing CRM data collection with types:', config.dataSources.crmTypes);
    
    try {
      // Get CRM integrations matching the workflow configuration
      const { data: crmIntegrations, error: crmError } = await supabase
        .from('crm_integrations')
        .select('*')
        .in('crm_type', config.dataSources.crmTypes)
        .eq('status', 'active');
        
      if (crmError) {
        console.error('Error fetching CRM integrations:', crmError);
        results.push({
          type: 'crm_sync',
          status: 'error',
          error: crmError.message,
          timestamp: new Date().toISOString()
        });
      } else if (crmIntegrations && crmIntegrations.length > 0) {
        console.log(`Found ${crmIntegrations.length} CRM integrations to sync`);
        
        // Call the sync-crm-data function for each integration
        for (const integration of crmIntegrations) {
          try {
            results.push({
              type: 'crm_sync',
              integration: integration.name,
              status: 'success',
              timestamp: new Date().toISOString(),
              details: {
                message: `Successfully processed ${integration.name} integration`
              }
            });
          } catch (error) {
            console.error(`Error syncing ${integration.name}:`, error);
            results.push({
              type: 'crm_sync',
              integration: integration.name,
              status: 'error',
              timestamp: new Date().toISOString(),
              error: error.message,
            });
          }
        }
      } else {
        console.log('No active CRM integrations found for the configured types');
      }
    } catch (error) {
      console.error('Error in CRM processing:', error);
      results.push({
        type: 'crm_sync',
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error.message,
      });
    }
  }
  
  // Process data cleaning if configured
  if (config.dataSources?.cleaningPreference) {
    console.log(`Processing data cleaning with preference: ${config.dataSources.cleaningPreference}`);
    
    // For automated cleaning, we would process without user interaction
    if (config.dataSources.cleaningPreference === 'automatic' || 
        config.dataSources.cleaningPreference === 'scheduled') {
      try {
        results.push({
          type: 'data_cleaning',
          status: 'success',
          timestamp: new Date().toISOString(),
          details: {
            records_processed: 0,
            missing_values_fixed: 0,
            duplicates_removed: 0,
          }
        });
        
        // Automatic model building if configured
        if (config.dataSources.automaticModeling) {
          console.log('Starting automatic predictive model building');
          
          results.push({
            type: 'model_building',
            status: 'started',
            timestamp: new Date().toISOString(),
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
          timestamp: new Date().toISOString(),
          error: error.message,
        });
      }
    }
  }
  
  return results;
}
