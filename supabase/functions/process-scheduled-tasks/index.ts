import { createClient } from '@supabase/supabase-js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Create a single supabase client for interacting with your database
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Processing scheduled tasks...')

    // Get all active workflows
    const { data: workflows, error: workflowsError } = await supabase
      .from('workflows')
      .select('*')
      .eq('status', 'active')

    if (workflowsError) {
      throw workflowsError
    }

    console.log(`Found ${workflows.length} active workflows`)

    for (const workflow of workflows) {
      console.log(`Processing workflow: ${workflow.name}`)
      
      // Process analytics if configured
      if (workflow.config.analytics) {
        console.log('Running analytics process...')
        // Add your analytics processing logic here
      }

      // Process reports if configured
      if (workflow.config.reports) {
        console.log('Running report generation...')
        // Add your report generation logic here
      }

      // Update last run timestamp
      const { error: updateError } = await supabase
        .from('workflows')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', workflow.id)

      if (updateError) {
        console.error(`Error updating workflow ${workflow.id}:`, updateError)
      }
    }

    return new Response(
      JSON.stringify({ message: 'Scheduled tasks processed successfully' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error processing scheduled tasks:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})