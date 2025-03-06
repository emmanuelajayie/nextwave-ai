
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.47.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: { user } } = await supabase.auth.getUser(
      req.headers.get("Authorization")?.replace("Bearer ", "") || ""
    );

    if (!user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    const body = await req.json();
    const { industry } = body;

    console.log(`Seeding ${industry} data for user ${user.id}`);
    
    // Generate dates for the past 30 days
    const dates = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toISOString();
    });

    if (industry === "finance" || industry === "all") {
      // Generate finance data
      const financeData = dates.map((date, i) => {
        // Create some trends over time
        const baseRevenue = 100000;
        const baseExpenses = 70000;
        const trendFactor = 1 + (i * 0.01); // 1% growth per day
        const randomFactor = 0.9 + (Math.random() * 0.2); // Random variation +/- 10%
        
        const revenue = Math.round(baseRevenue * trendFactor * randomFactor);
        const expenses = Math.round(baseExpenses * trendFactor * (0.95 + (Math.random() * 0.1)));
        const profit = revenue - expenses;
        
        return {
          user_id: user.id,
          date,
          return_on_investment: 5 + (i * 0.1) + (Math.random() * 2), // Increasing trend with noise
          operating_margin: 15 + (i * 0.2) * randomFactor,
          cash_flow_ratio: 1 + (Math.random() * 0.5),
          debt_to_equity: 0.8 - (i * 0.01) * randomFactor, // Decreasing trend with noise
          asset_turnover: 1.8 + (Math.random() * 0.6),
          revenue,
          expenses,
          profit,
          risks: [
            { level: Math.random() > 0.7 ? "high" : Math.random() > 0.4 ? "medium" : "low", description: "Market volatility" },
            { level: Math.random() > 0.8 ? "high" : Math.random() > 0.5 ? "medium" : "low", description: "Currency exposure" },
            { level: Math.random() > 0.9 ? "high" : Math.random() > 0.6 ? "medium" : "low", description: "Liquidity risk" }
          ]
        };
      });
      
      // Insert finance data
      const { error: financeError } = await supabase
        .from("finance_data")
        .upsert(financeData);
      
      if (financeError) throw financeError;
      console.log(`Inserted ${financeData.length} finance records`);
    }
    
    if (industry === "ecommerce" || industry === "all") {
      // Generate ecommerce data
      const ecommerceData = dates.map((date, i) => {
        // Create some trends over time
        const trendFactor = 1 + (i * 0.005); // 0.5% growth per day
        const randomFactor = 0.9 + (Math.random() * 0.2); // Random variation +/- 10%
        
        return {
          user_id: user.id,
          date,
          cart_abandonment_rate: 75 - (i * 0.2) * randomFactor, // Decreasing trend with noise
          conversion_rate: 2 + (i * 0.05) * randomFactor, // Increasing trend with noise
          average_order_value: 50 + (i * 0.5) + (Math.random() * 10),
          mobile_usage_percentage: 40 + (i * 0.3) * randomFactor,
          peak_hours: [
            { hour: 10, percentage: 8 + (Math.random() * 5) },
            { hour: 14, percentage: 12 + (Math.random() * 6) }, 
            { hour: 19, percentage: 18 + (Math.random() * 7) },
            { hour: 21, percentage: 15 + (Math.random() * 6) }
          ],
          customer_acquisition_cost: 30 - (i * 0.1) * randomFactor,
          return_rate: 15 - (i * 0.1) * (Math.random() * 0.2 + 0.9)
        };
      });
      
      // Insert ecommerce data
      const { error: ecommerceError } = await supabase
        .from("ecommerce_data")
        .upsert(ecommerceData);
      
      if (ecommerceError) throw ecommerceError;
      console.log(`Inserted ${ecommerceData.length} ecommerce records`);
    }
    
    if (industry === "logistics" || industry === "all") {
      // Generate logistics data
      const logisticsData = dates.map((date, i) => {
        // Create some trends over time
        const trendFactor = 1 + (i * 0.003); // 0.3% growth per day
        const randomFactor = 0.95 + (Math.random() * 0.1); // Random variation +/- 5%
        
        return {
          user_id: user.id,
          date,
          on_time_delivery_rate: 90 + (i * 0.1) * randomFactor, // Increasing trend with noise
          average_transit_time: 3 - (i * 0.02) * randomFactor, // Decreasing trend with noise
          fuel_efficiency: 8 + (i * 0.03) * randomFactor,
          warehouse_utilization: 65 + (i * 0.2) + (Math.random() * 5),
          weather_affected_routes: [
            { route: "North", severity: Math.random() > 0.7 ? "high" : "low" },
            { route: "South", severity: Math.random() > 0.8 ? "high" : "low" },
            { route: "East", severity: Math.random() > 0.6 ? "high" : "low" },
            { route: "West", severity: Math.random() > 0.9 ? "high" : "low" }
          ],
          route_data: {
            urban: { count: 120 + i, efficiency: 85 + (i * 0.1) },
            suburban: { count: 85 + i, efficiency: 75 + (i * 0.15) },
            rural: { count: 45 + i, efficiency: 65 + (i * 0.2) }
          },
          return_processing_time: 2 - (i * 0.01) * randomFactor
        };
      });
      
      // Insert logistics data
      const { error: logisticsError } = await supabase
        .from("logistics_data")
        .upsert(logisticsData);
      
      if (logisticsError) throw logisticsError;
      console.log(`Inserted ${logisticsData.length} logistics records`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully seeded ${industry} data` 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in seed function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
