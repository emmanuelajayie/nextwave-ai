
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Define CRM configurations
const CRM_CONFIGS = {
  hubspot: {
    name: "HubSpot",
    authUrl: "https://app.hubspot.com/oauth/authorize",
    scopes: ["contacts", "crm.objects.contacts.read", "crm.objects.contacts.write"],
  },
  zoho: {
    name: "Zoho",
    authUrl: "https://accounts.zoho.com/oauth/v2/auth",
    scopes: ["ZohoCRM.modules.ALL", "ZohoCRM.settings.ALL"],
  },
  salesforce: {
    name: "Salesforce",
    authUrl: "https://login.salesforce.com/services/oauth2/authorize",
    scopes: ["api", "refresh_token"],
  },
};

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request
    const { crmType } = await req.json();
    
    if (!crmType || !CRM_CONFIGS[crmType as keyof typeof CRM_CONFIGS]) {
      throw new Error(`Unsupported CRM type: ${crmType}`);
    }
    
    const config = CRM_CONFIGS[crmType as keyof typeof CRM_CONFIGS];
    
    // Get client ID from secret
    let clientId = null;
    
    switch (crmType) {
      case "hubspot":
        clientId = Deno.env.get("VITE_HUBSPOT_CLIENT_ID");
        break;
      case "zoho":
        clientId = Deno.env.get("VITE_ZOHO_CLIENT_ID");
        break;
      case "salesforce":
        clientId = Deno.env.get("SALESFORCE_CLIENT_ID");
        break;
    }
    
    if (!clientId) {
      throw new Error(`${config.name} client ID not configured`);
    }
    
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );
    
    // Generate state parameter for security
    const state = crypto.randomUUID();
    
    // Create a record in crm_integrations table with pending status
    const { error: dbError } = await supabaseClient
      .from("crm_integrations")
      .insert({
        crm_type: crmType,
        name: `${config.name} Integration`,
        status: "pending",
        oauth_data: {
          state,
          created_at: new Date().toISOString(),
          status: "pending"
        }
      });

    if (dbError) {
      console.error("Error creating integration record:", dbError);
      throw new Error("Failed to initialize OAuth flow");
    }
    
    // Construct redirect URI - update for Zoho specifically
    let redirectUri;
    
    if (crmType === "zoho") {
      // For Zoho we need to use exactly what's configured in their developer portal
      redirectUri = `https://zpxciicizzdyxqqnixra.supabase.co/functions/v1/crm-oauth-callback?crm_type=${crmType}`;
    } else {
      redirectUri = `https://zpxciicizzdyxqqnixra.supabase.co/functions/v1/crm-oauth-callback?crm_type=${crmType}`;
    }
    
    // Construct authorization URL with all required parameters
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      state,
      scope: config.scopes.join(" "),
    });

    const authUrl = `${config.authUrl}?${params.toString()}`;
    
    console.log(`Generated auth URL for ${config.name}:`, authUrl);
    
    return new Response(
      JSON.stringify({ 
        authUrl,
        state,
        crmType,
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
    
  } catch (error) {
    console.error("Error in CRM OAuth initialize:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
