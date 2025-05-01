
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

    const { amount, currency, payment_type, customer, metadata, business_type, plan_id } = await req.json();
    console.log("Initializing payment:", { amount, currency, payment_type, business_type, plan_id });

    const flutterwaveSecretKey = Deno.env.get("FLUTTERWAVE_SECRET_KEY");
    if (!flutterwaveSecretKey) {
      throw new Error("Payment provider configuration missing");
    }

    // Generate a unique transaction reference
    const tx_ref = crypto.randomUUID();

    // Initialize payment with Flutterwave
    const response = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${flutterwaveSecretKey}`,
      },
      body: JSON.stringify({
        tx_ref,
        amount,
        currency,
        payment_options: payment_type === "subscription" ? "card" : "card,ussd,bank_transfer",
        customer: {
          email: customer.email,
          name: customer.name || user.email,
        },
        meta: {
          ...metadata,
          user_id: user.id,
          business_type,
          plan_id,
        },
        // Use the specified callback URL
        redirect_url: "https://app.nextwaveai.solutions/payment/callback",
        customizations: {
          title: business_type ? `${business_type} Business Setup` : "Payment",
          description: payment_type === "subscription" ? "Subscription Payment" : "One-time Payment",
        },
      }),
    });

    const data = await response.json();
    console.log("Flutterwave initialization response:", data);

    if (!response.ok) {
      throw new Error(data.message || "Failed to initialize payment");
    }

    // Create payment record in database
    const { error: dbError } = await supabaseClient
      .from("payments")
      .insert({
        user_id: user.id,
        transaction_ref: tx_ref,
        amount,
        currency,
        payment_type,
        metadata: {
          ...metadata,
          flutterwave_response: data,
        },
        business_type,
        plan_id,
        trial_end_date: payment_type === "subscription" ? 
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() : null,
        subscription_status: payment_type === "subscription" ? "trial" : "inactive"
      });

    if (dbError) {
      console.error("Error creating payment record:", dbError);
      throw new Error("Failed to create payment record");
    }

    return new Response(
      JSON.stringify({ 
        url: data.data.link, 
        reference: tx_ref,
        message: "Payment initialized successfully"
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Payment initialization error:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: "An error occurred during payment initialization"
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
