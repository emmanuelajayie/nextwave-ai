import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const error = url.searchParams.get("error");
    const crmType = url.searchParams.get("crm_type");

    if (error) {
      throw new Error(`OAuth error: ${error}`);
    }

    if (!code || !state || !crmType) {
      throw new Error("Missing required OAuth parameters");
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Exchange code for access token (implementation varies by CRM)
    const tokenResponse = await exchangeCodeForToken(code, crmType);

    // Store the tokens in the database
    const { error: dbError } = await supabaseClient
      .from("crm_integrations")
      .insert({
        crm_type: crmType,
        name: `${crmType.charAt(0).toUpperCase() + crmType.slice(1)} Integration`,
        oauth_data: tokenResponse,
        status: "active",
      });

    if (dbError) throw dbError;

    // Redirect back to the application
    return Response.redirect(`${url.origin}/data?success=true`);
  } catch (error) {
    console.error("OAuth callback error:", error);
    return Response.redirect(`${new URL(req.url).origin}/data?error=${encodeURIComponent(error.message)}`);
  }
});

async function exchangeCodeForToken(code: string, crmType: string) {
  // Implementation varies by CRM provider
  // This is a placeholder that should be implemented based on each CRM's OAuth specifications
  return {
    access_token: "placeholder",
    refresh_token: "placeholder",
    expires_in: 3600,
  };
}