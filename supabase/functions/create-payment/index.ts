import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { plan, email, amount, setupFee } = await req.json();
    
    const PAYSTACK_SECRET_KEY = Deno.env.get('PAYSTACK_SECRET_KEY');
    if (!PAYSTACK_SECRET_KEY) {
      throw new Error('Paystack secret key not configured');
    }

    console.log(`Initializing payment for plan: ${plan}, email: ${email}, amount: ${amount}, setupFee: ${setupFee}`);

    // Initialize transaction with Paystack
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: amount + setupFee, // Total amount including setup fee
        callback_url: `${req.headers.get('origin')}/payment/callback`,
        metadata: {
          plan,
          setup_fee: setupFee,
          subscription_amount: amount,
        },
      }),
    });

    const data = await response.json();
    console.log('Paystack response:', data);

    if (!data.status) {
      throw new Error(data.message || 'Failed to initialize payment');
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Payment initialization error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});