import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPPORTED_CRM_TYPES = ['hubspot', 'zoho', 'salesforce'];
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // ms

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const error = url.searchParams.get("error");
    const error_description = url.searchParams.get("error_description");
    const crmType = url.searchParams.get("crm_type");

    console.log("Received OAuth callback with params:", {
      code: code ? "Present" : "Missing",
      state: state ? "Present" : "Missing",
      error,
      error_description,
      crmType,
    });

    // Validate CRM type
    if (!crmType || !SUPPORTED_CRM_TYPES.includes(crmType)) {
      throw new Error(`Unsupported CRM type: ${crmType}`);
    }

    if (error) {
      throw new Error(`OAuth error: ${error} - ${error_description}`);
    }

    if (!code || !state) {
      throw new Error("Missing required OAuth parameters");
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Validate stored state
    const { data: existingIntegration, error: stateError } = await supabaseClient
      .from("crm_integrations")
      .select("oauth_data")
      .eq("crm_type", crmType)
      .eq("oauth_data->state", state)
      .single();

    if (stateError || !existingIntegration) {
      console.error("State validation error:", stateError);
      throw new Error("Invalid OAuth state parameter");
    }

    // Store the OAuth data in the database
    const { error: dbError } = await supabaseClient
      .from("crm_integrations")
      .update({
        oauth_data: {
          code,
          state,
          received_at: new Date().toISOString(),
          status: "authorized"
        },
        status: "active",
        updated_at: new Date().toISOString()
      })
      .eq("crm_type", crmType)
      .eq("oauth_data->state", state);

    if (dbError) {
      console.error("Database update error:", dbError);
      throw dbError;
    }

    // Start the token exchange process in the background
    EdgeRuntime.waitUntil(exchangeCodeForToken(code, crmType, supabaseClient));

    // Redirect back to the application with success parameter
    // Use app-specific callback routes for better UX
    const frontendBaseUrl = "https://app.nextwaveai.solutions";
    
    if (crmType === "hubspot") {
      return Response.redirect(`${frontendBaseUrl}/hubspot/callback`);
    } else if (crmType === "zoho") {
      return Response.redirect(`${frontendBaseUrl}/zoho/callback`);
    } else {
      // Fallback to the data page with parameters
      return Response.redirect(`${frontendBaseUrl}/data?oauth_success=true&crm_type=${crmType}`);
    }
  } catch (error) {
    console.error("OAuth callback error:", error);
    return Response.redirect(
      `https://app.nextwaveai.solutions/data?oauth_error=${encodeURIComponent(
        error.message
      )}`
    );
  }
});

async function exchangeCodeForToken(code: string, crmType: string, supabaseClient: any) {
  let retries = 0;
  
  while (retries < MAX_RETRIES) {
    try {
      console.log(`Starting token exchange for ${crmType} (attempt ${retries + 1}/${MAX_RETRIES})`);
      
      const tokenEndpoint = {
        hubspot: "https://api.hubapi.com/oauth/v1/token",
        zoho: "https://accounts.zoho.com/oauth/v2/token",
        salesforce: "https://login.salesforce.com/services/oauth2/token"
      }[crmType];

      // Get client credentials from environment variables
      let clientId, clientSecret;
      
      switch (crmType) {
        case "hubspot":
          clientId = Deno.env.get("VITE_HUBSPOT_CLIENT_ID");
          clientSecret = Deno.env.get("HUBSPOT_CLIENT_SECRET");
          break;
        case "zoho":
          clientId = Deno.env.get("VITE_ZOHO_CLIENT_ID");
          clientSecret = Deno.env.get("ZOHO_CLIENT_SECRET");
          break;
        case "salesforce":
          clientId = Deno.env.get("SALESFORCE_CLIENT_ID");
          clientSecret = Deno.env.get("SALESFORCE_CLIENT_SECRET");
          break;
      }
      
      if (!clientId || !clientSecret) {
        throw new Error(`Missing client credentials for ${crmType}`);
      }
      
      // Use the same redirect URI that was used in the authorize request
      let redirectUri;
      if (crmType === "zoho") {
        redirectUri = `https://zpxciicizzdyxqqnixra.supabase.co/functions/v1/crm-oauth-callback?crm_type=${crmType}`;
      } else {
        redirectUri = `https://zpxciicizzdyxqqnixra.supabase.co/functions/v1/crm-oauth-callback?crm_type=${crmType}`;
      }
      
      console.log(`Using redirect URI: ${redirectUri}`);

      const response = await fetch(tokenEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
        }),
      });

      const responseText = await response.text();
      
      if (!response.ok) {
        console.error(`Token exchange failed with status ${response.status}:`, responseText);
        throw new Error(`Token exchange failed: ${responseText}`);
      }

      let tokenData;
      try {
        tokenData = JSON.parse(responseText);
      } catch (e) {
        console.error("Failed to parse token response:", e);
        throw new Error(`Invalid token response: ${responseText}`);
      }

      if (!tokenData.access_token) {
        throw new Error("No access_token in response");
      }

      console.log(`Successfully exchanged code for token for ${crmType}`);

      // Calculate token expiration if not provided
      if (tokenData.expires_in && !tokenData.expires_at) {
        const expiresAt = new Date();
        expiresAt.setSeconds(expiresAt.getSeconds() + tokenData.expires_in);
        tokenData.expires_at = expiresAt.toISOString();
      }

      // Store token data securely
      await supabaseClient
        .from("crm_integrations")
        .update({
          oauth_data: {
            ...tokenData,
            updated_at: new Date().toISOString()
          }
        })
        .eq("crm_type", crmType);

      console.log(`Token data stored successfully for ${crmType}`);
      
      // Try to fetch some initial data to validate the token works
      await validateToken(crmType, tokenData.access_token);
      
      return;
    } catch (error) {
      retries++;
      console.error(`Token exchange error for ${crmType} (attempt ${retries}/${MAX_RETRIES}):`, error);
      
      if (retries >= MAX_RETRIES) {
        await supabaseClient
          .from("crm_integrations")
          .update({
            status: "error",
            oauth_data: {
              error: error.message,
              updated_at: new Date().toISOString()
            }
          })
          .eq("crm_type", crmType);
        
        return;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * retries));
    }
  }
}

async function validateToken(crmType: string, accessToken: string) {
  try {
    console.log(`Validating token for ${crmType}...`);
    let validationEndpoint;
    let headers = { Authorization: `Bearer ${accessToken}` };
    
    switch (crmType) {
      case 'hubspot':
        validationEndpoint = 'https://api.hubapi.com/oauth/v1/access-tokens/' + accessToken;
        break;
      case 'zoho':
        validationEndpoint = 'https://accounts.zoho.com/oauth/user/info';
        break;
      case 'salesforce':
        validationEndpoint = 'https://login.salesforce.com/services/oauth2/userinfo';
        break;
      default:
        return; // Skip validation for unsupported types
    }
    
    const response = await fetch(validationEndpoint, { headers });
    if (!response.ok) {
      throw new Error(`Token validation failed with status ${response.status}`);
    }
    
    console.log(`Token validation successful for ${crmType}`);
  } catch (error) {
    console.warn(`Token validation warning for ${crmType}:`, error);
    // We don't throw here as this is just a validation step
  }
}
