import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
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
    const error_description = url.searchParams.get("error_description");

    console.log("Received OAuth callback with params:", {
      code: code ? "Present" : "Missing",
      state: state ? "Present" : "Missing",
      error,
      error_description,
    });

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

    // Store the OAuth data in the database
    const { error: dbError } = await supabaseClient
      .from("crm_integrations")
      .insert({
        crm_type: "oauth_pending",
        name: "OAuth Integration",
        oauth_data: {
          code,
          state,
          received_at: new Date().toISOString(),
        },
        status: "pending",
      });

    if (dbError) throw dbError;

    // Redirect back to the application with success parameter
    return Response.redirect(
      `${url.origin}/data?oauth_success=true&state=${state}`
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