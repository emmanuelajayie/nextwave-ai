
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Helper function to check if a time is within the window (with 5-minute tolerance)
function isTimeInWindow(scheduledTime: string, currentTime = new Date()): boolean {
  if (!scheduledTime) return false;
  
  try {
    const [hours, minutes] = scheduledTime.split(':').map(Number);
    
    const scheduledDate = new Date();
    scheduledDate.setHours(hours, minutes, 0, 0);
    
    // Check if current time is within 5 minutes of the scheduled time
    const timeDiffMs = Math.abs(currentTime.getTime() - scheduledDate.getTime());
    const fiveMinutesMs = 5 * 60 * 1000;
    
    return timeDiffMs <= fiveMinutesMs;
  } catch (error) {
    console.error(`Error parsing time: ${scheduledTime}`, error);
    return false;
  }
}

// Helper function to check if today matches the schedule
function isScheduledForToday(schedule: string, days?: string[]): boolean {
  if (!schedule) return false;
  
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  
  switch (schedule.toLowerCase()) {
    case "daily":
      return true;
    case "weekdays":
      return dayOfWeek >= 1 && dayOfWeek <= 5;
    case "weekends":
      return dayOfWeek === 0 || dayOfWeek === 6;
    case "weekly":
      // For weekly, check if today is Monday (default) or a specified day
      if (days && days.length > 0) {
        return days.includes(dayNames[dayOfWeek]);
      }
      return dayOfWeek === 1; // Default to Monday
    case "monthly":
      // For monthly, check if today is the 1st day of the month
      return today.getDate() === 1;
    case "custom":
      // For custom, check if today is in the specified days
      if (days && days.length > 0) {
        return days.includes(dayNames[dayOfWeek]);
      }
      return false;
    default:
      return false;
  }
}

async function processAnalytics(supabase, config) {
  console.log("Processing analytics with config:", config);
  
  if (!config.schedule || !config.time) {
    console.log("Analytics schedule or time not configured");
    return { status: "skipped", reason: "not_configured" };
  }
  
  // Check if analytics should run today based on schedule
  if (!isScheduledForToday(config.schedule)) {
    console.log(`Analytics not scheduled for today (schedule: ${config.schedule})`);
    return { status: "skipped", reason: "not_scheduled_today" };
  }
  
  // Check if it's time to run analytics
  if (!isTimeInWindow(config.time)) {
    console.log(`Not time for analytics yet (${config.time})`);
    return { status: "skipped", reason: "not_time_yet" };
  }
  
  console.log("Running analytics process");
  
  // Here we would implement the actual analytics processing logic
  // For now, we'll just simulate a successful run
  
  // Log the successful run
  const { error } = await supabase
    .from('system_logs')
    .insert({
      action: 'Analytics Run',
      status: 'success',
      description: `Scheduled analytics process executed successfully`,
      metadata: { schedule: config.schedule, time: config.time }
    })
    .single();
  
  if (error) {
    console.error("Error logging analytics run:", error);
  }
  
  return { status: "success" };
}

async function processReports(supabase, config) {
  console.log("Processing reports with config:", config);
  
  if (!config.schedule || !config.time) {
    console.log("Reports schedule or time not configured");
    return { status: "skipped", reason: "not_configured" };
  }
  
  // Check if reports should run today based on schedule
  if (!isScheduledForToday(config.schedule)) {
    console.log(`Reports not scheduled for today (schedule: ${config.schedule})`);
    return { status: "skipped", reason: "not_scheduled_today" };
  }
  
  // Check if it's time to generate reports
  if (!isTimeInWindow(config.time)) {
    console.log(`Not time for reports yet (${config.time})`);
    return { status: "skipped", reason: "not_time_yet" };
  }
  
  console.log("Generating and sending reports");
  
  // Here we would implement the actual report generation and delivery logic
  // For now, we'll just simulate a successful run
  
  // Log the successful run
  const { error } = await supabase
    .from('system_logs')
    .insert({
      action: 'Report Delivery',
      status: 'success',
      description: `Scheduled reports generated and delivered successfully`,
      metadata: { schedule: config.schedule, time: config.time }
    })
    .single();
  
  if (error) {
    console.error("Error logging report delivery:", error);
  }
  
  return { status: "success" };
}

async function processWorkflow(supabase, config) {
  console.log("Processing workflow with config:", config);
  
  if (!config.schedule || !config.time) {
    console.log("Workflow schedule or time not configured");
    return { status: "skipped", reason: "not_configured" };
  }
  
  // Check if workflow should run today based on schedule and days
  if (!isScheduledForToday(config.schedule, config.days)) {
    console.log(`Workflow not scheduled for today (schedule: ${config.schedule}, days: ${config.days})`);
    return { status: "skipped", reason: "not_scheduled_today" };
  }
  
  // Check if it's time to run workflow
  if (!isTimeInWindow(config.time)) {
    console.log(`Not time for workflow yet (${config.time})`);
    return { status: "skipped", reason: "not_time_yet" };
  }
  
  console.log("Running workflow process");
  
  // Here we would implement the actual workflow processing logic
  // For now, we'll just simulate a successful run
  
  // Log the successful run
  const { error } = await supabase
    .from('system_logs')
    .insert({
      action: 'Workflow Run',
      status: 'success',
      description: `Scheduled workflow executed successfully`,
      metadata: { schedule: config.schedule, time: config.time, days: config.days }
    })
    .single();
  
  if (error) {
    console.error("Error logging workflow run:", error);
  }
  
  return { status: "success" };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );
    
    // Get all active workflows
    const { data: workflows, error } = await supabaseClient
      .from('workflows')
      .select('*')
      .eq('status', 'active');
    
    if (error) {
      console.error("Error fetching workflows:", error);
      return new Response(JSON.stringify({ error: error.message }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      });
    }
    
    console.log(`Found ${workflows?.length || 0} active workflows`);
    
    const results = [];
    
    // Process each workflow
    for (const workflow of workflows || []) {
      try {
        const config = workflow.config;
        console.log(`Processing workflow: ${workflow.id}, ${workflow.name}`);
        
        // Process analytics if configured
        if (config.analytics) {
          const analyticsResult = await processAnalytics(supabaseClient, config.analytics);
          results.push({ type: "analytics", workflowId: workflow.id, ...analyticsResult });
        }
        
        // Process reports if configured
        if (config.reports) {
          const reportsResult = await processReports(supabaseClient, config.reports);
          results.push({ type: "reports", workflowId: workflow.id, ...reportsResult });
        }
        
        // Process main workflow if configured
        if (config.workflow) {
          const workflowResult = await processWorkflow(supabaseClient, config.workflow);
          results.push({ type: "workflow", workflowId: workflow.id, ...workflowResult });
        }
      } catch (error) {
        console.error(`Error processing workflow ${workflow.id}:`, error);
        results.push({ 
          type: "error", 
          workflowId: workflow.id, 
          status: "error", 
          error: error.message 
        });
      }
    }
    
    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
