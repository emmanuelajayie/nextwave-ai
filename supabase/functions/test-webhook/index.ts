
// Follow this setup guide to integrate the Deno SDK: https://deno.land/manual/examples/http_server
import { serve } from "https://deno.land/std@0.131.0/http/server.ts";

// Define CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Parse the request body
    const { webhookUrl, testPayload } = await req.json();
    
    console.log(`Testing webhook URL: ${webhookUrl}`);
    
    if (!webhookUrl) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing webhook URL' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Test payload with defaults if not provided
    const payload = testPayload || {
      event: "test",
      timestamp: new Date().toISOString(),
      message: "This is a webhook test"
    };
    
    // Try to send a request to the webhook URL
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    // Get status code and response text
    const statusCode = response.status;
    const responseBody = await response.text();
    
    console.log(`Webhook response: ${statusCode}, ${responseBody}`);
    
    // Consider webhook test successful if status code is in 2xx range
    const success = statusCode >= 200 && statusCode < 300;
    
    // Return the test result
    return new Response(
      JSON.stringify({
        success,
        statusCode,
        responseBody: responseBody.substring(0, 1000), // Limit response size
        message: success ? 'Webhook test successful' : 'Webhook test failed'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error(`Error testing webhook: ${error.message}`);
    
    // Return error response
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        message: 'Failed to test webhook'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
