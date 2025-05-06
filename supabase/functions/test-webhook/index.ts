
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Parse the request body
    let reqBody;
    try {
      reqBody = await req.json();
    } catch (parseError) {
      console.error("Error parsing request body:", parseError);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid request body. Expected JSON.",
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    const { webhookUrl, testPayload } = reqBody;
    console.log(`Testing webhook URL: ${webhookUrl}`);
    
    if (!webhookUrl) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Webhook URL is required",
          testedAt: new Date().toISOString()
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create a default test payload if none was provided
    const payload = testPayload || {
      event: "webhook_test",
      timestamp: new Date().toISOString(),
      status: "success",
      message: "This is a test webhook from Supabase Edge Functions",
    }

    // Send a test request to the webhook URL
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Supabase-Webhook-Tester',
      },
      body: JSON.stringify(payload),
    })

    const success = response.status >= 200 && response.status < 300
    let responseText = ''
    
    try {
      responseText = await response.text()
    } catch (e) {
      console.error('Error reading response body:', e)
      responseText = 'Could not read response body'
    }

    // Return the result
    return new Response(
      JSON.stringify({
        success,
        statusCode: response.status,
        statusText: response.statusText,
        responseBody: responseText.substring(0, 500), // Truncate if too long
        testedAt: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error testing webhook:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        testedAt: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
