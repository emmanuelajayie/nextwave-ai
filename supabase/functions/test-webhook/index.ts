
// Function to test a webhook URL by sending a POST request
// This avoids CORS issues when testing from the browser

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { webhookUrl, testPayload } = await req.json();

    if (!webhookUrl || !testPayload) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Missing webhook URL or test payload" 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    console.log(`Testing webhook URL: ${webhookUrl}`);
    
    // Send a test request to the webhook URL with a timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Source": "NextWave AI",
          "X-Test": "true"
        },
        body: JSON.stringify(testPayload),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      // Check if the response is successful (status code 2xx)
      const success = response.ok;
      const status = response.status;
      const responseBody = await response.text().catch(() => "");
      
      console.log(`Webhook test ${success ? "succeeded" : "failed"} with status: ${status}`);
      
      return new Response(
        JSON.stringify({ 
          success, 
          status,
          responseBody: responseBody.substring(0, 1000) // Limit response size
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error(`Error sending webhook request: ${fetchError.message}`);
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: fetchError.message
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200, // Still return 200 to client, but with error details
        }
      );
    }
  } catch (error) {
    console.error(`Error in test-webhook function: ${error.message}`);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
