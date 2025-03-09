
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Verify authentication
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      req.headers.get("Authorization")?.split(" ")[1] ?? ""
    );

    if (authError || !user) {
      console.error("Auth error:", authError);
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

    console.log(`Verifying payment for reference: ${reference}`);

    const flutterwaveSecretKey = Deno.env.get("FLUTTERWAVE_SECRET_KEY");
    if (!flutterwaveSecretKey) {
      console.error("Flutterwave secret key not configured");
      throw new Error("Payment provider configuration missing");
    }

    // Verify payment with Flutterwave
    const response = await fetch(`https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${reference}`, {
      headers: {
        "Authorization": `Bearer ${flutterwaveSecretKey}`,
      },
    });

    const flutterwaveData = await response.json();
    console.log("Flutterwave verification response:", flutterwaveData);

    if (!response.ok) {
      throw new Error(flutterwaveData.message || "Failed to verify payment");
    }

    // Get payment details from our database
    const { data: existingPayment, error: fetchError } = await supabaseClient
      .from("payments")
      .select("*")
      .eq("transaction_ref", reference)
      .single();

    if (fetchError) {
      console.error("Error fetching payment:", fetchError);
      throw new Error("Failed to fetch payment details");
    }

    const subscriptionStatus = existingPayment.payment_type === "subscription" 
      ? (flutterwaveData.data.status === "successful" ? "active" : "inactive")
      : existingPayment.subscription_status;

    // Update payment status
    const { data: payment, error: updateError } = await supabaseClient
      .from("payments")
      .update({
        status: flutterwaveData.data.status === "successful" ? "successful" : "failed",
        metadata: {
          ...existingPayment.metadata,
          flw_ref: flutterwaveData.data.flw_ref,
          processor_response: flutterwaveData.data.processor_response,
          verification_completed: new Date().toISOString(),
        },
        updated_at: new Date().toISOString(),
        subscription_status: subscriptionStatus,
      })
      .eq("transaction_ref", reference)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating payment:", updateError);
      throw new Error("Failed to update payment status");
    }

    // If payment is successful, update user profile if needed
    if (flutterwaveData.data.status === "successful") {
      console.log(`Payment successful for reference: ${reference}.`);
      
      // For subscription payments, update trial status
      if (existingPayment.payment_type === "subscription" && existingPayment.plan_id) {
        console.log(`Activating subscription for user ${user.id} with plan ${existingPayment.plan_id}`);
      }
      
      // Update user profile or trigger any necessary workflows
      const { error: profileError } = await supabaseClient
        .from("profiles")
        .upsert({
          id: user.id,
          updated_at: new Date().toISOString(),
        })
        .select();

      if (profileError) {
        console.error("Error updating profile:", profileError);
      }
    }

    return new Response(
      JSON.stringify({ 
        data: payment,
        status: flutterwaveData.data.status,
        message: flutterwaveData.data.status === "successful" ? 
          "Payment verified successfully" : 
          "Payment verification failed"
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Payment verification error:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: "An error occurred during payment verification"
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
