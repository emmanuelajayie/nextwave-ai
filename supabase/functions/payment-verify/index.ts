
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      req.headers.get("Authorization")?.split(" ")[1] ?? ""
    );

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const url = new URL(req.url);
    const reference = url.pathname.split("/").pop();

    if (!reference) {
      throw new Error("Transaction reference is required");
    }

    const flutterwaveSecretKey = Deno.env.get("FLUTTERWAVE_SECRET_KEY");
    if (!flutterwaveSecretKey) {
      throw new Error("Flutterwave secret key not configured");
    }

    // Verify payment with Flutterwave
    const response = await fetch(`https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${reference}`, {
      headers: {
        "Authorization": `Bearer ${flutterwaveSecretKey}`,
      },
    });

    const flutterwaveData = await response.json();

    if (!response.ok) {
      throw new Error(flutterwaveData.message || "Failed to verify payment");
    }

    // Update payment status in database
    const { data: payment, error: updateError } = await supabaseClient
      .from("payments")
      .update({
        status: flutterwaveData.data.status === "successful" ? "successful" : "failed",
        metadata: {
          ...flutterwaveData.data,
          flw_ref: flutterwaveData.data.flw_ref,
          processor_response: flutterwaveData.data.processor_response,
        },
      })
      .eq("transaction_ref", reference)
      .select()
      .single();

    if (updateError) {
      throw new Error("Failed to update payment status");
    }

    return new Response(
      JSON.stringify({ data: payment }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
