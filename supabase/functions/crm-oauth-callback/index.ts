import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SUPPORTED_CRM_TYPES = ['hubspot', 'zoho', 'salesforce'];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
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
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Validate stored state
    const { data: existingIntegration, error: stateError } = await supabaseClient
      .from("crm_integrations")
      .select("oauth_data")
      .eq("crm_type", crmType)
      .eq("oauth_data->state", state)
      .single();

    if (stateError || !existingIntegration) {
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

    if (dbError) throw dbError;

    // Start the token exchange process in the background
    EdgeRuntime.waitUntil(exchangeCodeForToken(code, crmType, supabaseClient));

    // Redirect back to the application with success parameter
    return Response.redirect(
      `${url.origin}/data?oauth_success=true&crm_type=${crmType}`
    );
  } catch (error) {
    console.error("OAuth callback error:", error);
    return Response.redirect(
      `${new URL(req.url).origin}/data?oauth_error=${encodeURIComponent(
        error.message
      )}`
    );
  }
});

async function exchangeCodeForToken(code: string, crmType: string, supabaseClient: any) {
  try {
    console.log(`Starting token exchange for ${crmType}`);
    
    const tokenEndpoint = {
      hubspot: "https://api.hubapi.com/oauth/v1/token",
      zoho: "https://accounts.zoho.com/oauth/v2/token",
      salesforce: "https://login.salesforce.com/services/oauth2/token"
    }[crmType];

    const clientId = Deno.env.get(`${crmType.toUpperCase()}_CLIENT_ID`);
    const clientSecret = Deno.env.get(`${crmType.toUpperCase()}_CLIENT_SECRET`);
    const redirectUri = `${Deno.env.get("PUBLIC_URL")}/api/crm/oauth/callback`;

    const response = await fetch(tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: clientId!,
        client_secret: clientSecret!,
        redirect_uri: redirectUri,
      }),
    });

    if (!response.ok) {
      throw new Error(`Token exchange failed: ${await response.text()}`);
    }

    const tokenData = await response.json();
    console.log(`Successfully exchanged code for token for ${crmType}`);

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
  } catch (error) {
    console.error(`Token exchange error for ${crmType}:`, error);
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
  }
}