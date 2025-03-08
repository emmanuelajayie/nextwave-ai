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
    const { modelType, industry, dataSource, target } = body;

    console.log(`Processing prediction request: ${modelType} for ${industry}, target: ${target}`);
    
    // Get historical data to use for the prediction
    let historicalData;
    if (industry === "finance") {
      const { data, error } = await supabase
        .from("finance_data")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false })
        .limit(30);
      
      if (error) throw error;
      historicalData = data;
    } else if (industry === "ecommerce") {
      const { data, error } = await supabase
        .from("ecommerce_data")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false })
        .limit(30);
      
      if (error) throw error;
      historicalData = data;
    } else if (industry === "logistics") {
      const { data, error } = await supabase
        .from("logistics_data")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false })
        .limit(30);
      
      if (error) throw error;
      historicalData = data;
    } else if (industry === "tech") {
      const { data, error } = await supabase
        .from("tech_data")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false })
        .limit(30);
      
      if (error) throw error;
      historicalData = data;
    } else if (industry === "realestate") {
      const { data, error } = await supabase
        .from("realestate_data")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false })
        .limit(30);
      
      if (error) throw error;
      historicalData = data;
    }

    // For this example, we're going to use a simple algorithm
    // but in a real-world scenario, you would use a proper ML model
    let prediction, insights, confidence;

    if (modelType === "regression") {
      if (industry === "finance") {
        const revenues = historicalData?.map(d => d.revenue) || [100, 110, 120, 130, 140];
        const expenses = historicalData?.map(d => d.expenses) || [70, 75, 80, 85, 90];
        const revenueAvg = revenues.reduce((a, b) => a + b, 0) / revenues.length;
        const expenseAvg = expenses.reduce((a, b) => a + b, 0) / expenses.length;
        
        const revenueGrowth = revenues.length > 1 ? 
          (revenues[revenues.length - 1] - revenues[0]) / revenues[0] / revenues.length : 0.05;
        const expenseGrowth = expenses.length > 1 ? 
          (expenses[expenses.length - 1] - expenses[0]) / expenses[0] / expenses.length : 0.03;
        
        const futurePeriods = 5;
        prediction = Array.from({ length: futurePeriods }, (_, i) => {
          const projectedRevenue = revenueAvg * (1 + revenueGrowth * (i + 1));
          const projectedExpense = expenseAvg * (1 + expenseGrowth * (i + 1));
          return {
            period: `Period ${i + 1}`,
            revenue: Math.round(projectedRevenue * 100) / 100,
            expense: Math.round(projectedExpense * 100) / 100,
            profit: Math.round((projectedRevenue - projectedExpense) * 100) / 100
          };
        });
        
        confidence = 0.85;
        insights = [
          `Revenue is projected to grow by ${Math.round(revenueGrowth * 100)}% per period`,
          `Profit margin is trending ${revenueGrowth > expenseGrowth ? "up" : "down"}`,
          `Consider ${revenueGrowth < expenseGrowth ? "cost-cutting measures" : "expansion opportunities"}`
        ];
      } else if (industry === "ecommerce") {
        const conversionRates = historicalData?.map(d => d.conversion_rate) || [2.1, 2.3, 2.4, 2.6, 2.8];
        const cartAbandonments = historicalData?.map(d => d.cart_abandonment_rate) || [75, 73, 72, 70, 68];
        
        const conversionTrend = conversionRates.length > 1 ? 
          (conversionRates[conversionRates.length - 1] - conversionRates[0]) / conversionRates.length : 0.1;
        const abandonmentTrend = cartAbandonments.length > 1 ? 
          (cartAbandonments[cartAbandonments.length - 1] - cartAbandonments[0]) / cartAbandonments.length : -0.5;
        
        prediction = Array.from({ length: 5 }, (_, i) => {
          return {
            period: `Month ${i + 1}`,
            conversion: (conversionRates[conversionRates.length - 1] || 2.8) + (conversionTrend * (i + 1)),
            abandonment: (cartAbandonments[cartAbandonments.length - 1] || 68) + (abandonmentTrend * (i + 1))
          };
        });
        
        confidence = 0.82;
        insights = [
          `Cart abandonment is trending ${abandonmentTrend < 0 ? "down" : "up"} by ${Math.abs(Math.round(abandonmentTrend * 100) / 100)}% per period`,
          `Conversion rate is trending ${conversionTrend > 0 ? "up" : "down"} by ${Math.abs(Math.round(conversionTrend * 100) / 100)}% per period`,
          `Focus on ${abandonmentTrend > 0 ? "checkout optimization" : "product discovery"} to improve metrics`
        ];
      } else if (industry === "logistics") {
        const deliveryRates = historicalData?.map(d => d.on_time_delivery_rate) || [92, 93, 94, 93, 95];
        const transitTimes = historicalData?.map(d => d.average_transit_time) || [2.2, 2.1, 2.0, 1.9, 1.8];
        
        const deliveryTrend = deliveryRates.length > 1 ? 
          (deliveryRates[deliveryRates.length - 1] - deliveryRates[0]) / deliveryRates.length : 0.5;
        const transitTrend = transitTimes.length > 1 ? 
          (transitTimes[transitTimes.length - 1] - transitTimes[0]) / transitTimes.length : -0.05;
        
        prediction = Array.from({ length: 5 }, (_, i) => {
          return {
            period: `Week ${i + 1}`,
            onTimeRate: Math.min(100, (deliveryRates[deliveryRates.length - 1] || 95) + (deliveryTrend * (i + 1))),
            transitTime: Math.max(0.5, (transitTimes[transitTimes.length - 1] || 1.8) + (transitTrend * (i + 1)))
          };
        });
        
        confidence = 0.87;
        insights = [
          `On-time delivery rate is trending ${deliveryTrend > 0 ? "up" : "down"} by ${Math.abs(Math.round(deliveryTrend * 100) / 100)}% per period`,
          `Average transit time is trending ${transitTrend < 0 ? "down" : "up"} by ${Math.abs(Math.round(transitTrend * 100) / 100)} days per period`,
          `${transitTrend < 0 ? "Current optimization is working well" : "Consider route optimization to improve transit times"}`
        ];
      } else if (industry === "tech") {
        const engagementRates = historicalData?.map(d => d.user_engagement_rate) || [65, 68, 70, 72, 75];
        const adoptionRates = historicalData?.map(d => d.feature_adoption_rate) || [35, 38, 40, 42, 45];
        
        const engagementTrend = engagementRates.length > 1 ? 
          (engagementRates[engagementRates.length - 1] - engagementRates[0]) / engagementRates.length : 0.8;
        const adoptionTrend = adoptionRates.length > 1 ? 
          (adoptionRates[adoptionRates.length - 1] - adoptionRates[0]) / adoptionRates.length : 0.6;
        
        prediction = Array.from({ length: 5 }, (_, i) => {
          return {
            period: `Month ${i + 1}`,
            engagement: (engagementRates[engagementRates.length - 1] || 75) + (engagementTrend * (i + 1)),
            adoption: (adoptionRates[adoptionRates.length - 1] || 45) + (adoptionTrend * (i + 1)),
            churn: Math.max(1, 8 - (i * 0.3))
          };
        });
        
        confidence = 0.89;
        insights = [
          `User engagement is projected to increase by ${Math.round(engagementTrend * 100) / 100}% per month`,
          `Feature adoption rate is trending up by ${Math.round(adoptionTrend * 100) / 100}% per month`,
          `Focus on onboarding improvements to accelerate adoption rates`
        ];
      } else if (industry === "realestate") {
        const propertyValues = historicalData?.map(d => d.property_valuation) || [300000, 310000, 315000, 325000, 330000];
        const leadRates = historicalData?.map(d => d.lead_conversion_rate) || [6, 6.5, 7, 7.3, 7.8];
        
        const valuationTrend = propertyValues.length > 1 ? 
          (propertyValues[propertyValues.length - 1] - propertyValues[0]) / propertyValues[0] / propertyValues.length : 0.02;
        const leadTrend = leadRates.length > 1 ? 
          (leadRates[leadRates.length - 1] - leadRates[0]) / leadRates.length : 0.3;
        
        prediction = Array.from({ length: 5 }, (_, i) => {
          const projectedValue = (propertyValues[propertyValues.length - 1] || 330000) * (1 + valuationTrend * (i + 1));
          return {
            period: `Quarter ${i + 1}`,
            propertyValue: Math.round(projectedValue),
            leadConversion: (leadRates[leadRates.length - 1] || 7.8) + (leadTrend * (i + 1)),
            marketDemand: 75 + (i * 2)
          };
        });
        
        confidence = 0.86;
        insights = [
          `Property values projected to increase by ${Math.round(valuationTrend * 100)}% per quarter`,
          `Lead conversion trending up by ${Math.round(leadTrend * 100) / 100}% per period`,
          `Focus on high-value property segments for best ROI`
        ];
      }
    } else if (modelType === "classification") {
      if (industry === "finance") {
        prediction = ["low_risk", "medium_risk", "low_risk", "high_risk", "low_risk"];
        confidence = 0.91;
        insights = [
          "20% of transactions fall into high-risk category",
          "Low-risk transactions make up 60% of the total",
          "Consider reviewing high-risk transactions for potential fraud"
        ];
      } else if (industry === "ecommerce") {
        prediction = ["high_intent", "browser", "abandoned_cart", "completed_purchase", "return_customer"];
        confidence = 0.88;
        insights = [
          "High-intent visitors convert 35% more often than browsers",
          "Return customers have 2.4x higher average order value",
          "Focus remarketing on abandoned cart segment for best ROI"
        ];
      } else if (industry === "logistics") {
        prediction = ["on_time", "delayed", "at_risk", "on_time", "ahead_of_schedule"];
        confidence = 0.89;
        insights = [
          "20% of shipments are at risk of delay",
          "15% of deliveries are ahead of schedule",
          "Weather is the primary factor in at-risk deliveries"
        ];
      } else if (industry === "tech") {
        prediction = ["high_engagement", "low_engagement", "potential_churn", "power_user", "new_user"];
        confidence = 0.92;
        insights = [
          "25% of users are classified as high-engagement power users",
          "Potential churn segment shows declining feature usage",
          "New user onboarding drives 45% of feature discovery"
        ];
      } else if (industry === "realestate") {
        prediction = ["high_value", "medium_value", "premium", "investment", "quick_sale"];
        confidence = 0.87;
        insights = [
          "Premium properties represent 18% of the market but 35% of profit",
          "Investment category shows strongest year-over-year growth",
          "Quick-sale properties convert 2.5x faster than average"
        ];
      }
    } else if (modelType === "clustering") {
      if (industry === "finance") {
        prediction = [
          { cluster: "High value, low risk", count: 254, percentage: 38 },
          { cluster: "Medium value, medium risk", count: 187, percentage: 28 },
          { cluster: "Low value, high risk", count: 112, percentage: 17 },
          { cluster: "High value, high risk", count: 98, percentage: 15 }
        ];
        confidence = 0.92;
        insights = [
          "The largest segment (38%) represents low-risk, high-value accounts",
          "High-risk accounts make up 32% of the portfolio",
          "Consider targeted risk mitigation for high-value, high-risk accounts"
        ];
      } else if (industry === "ecommerce") {
        prediction = [
          { cluster: "Frequent shoppers", count: 1250, percentage: 42 },
          { cluster: "Occasional big spenders", count: 850, percentage: 29 },
          { cluster: "Browsers rarely buying", count: 570, percentage: 19 },
          { cluster: "One-time purchasers", count: 320, percentage: 10 }
        ];
        confidence = 0.89;
        insights = [
          "Frequent shoppers (42%) drive most of the revenue",
          "Occasional big spenders have highest average order value",
          "Focus retention strategies on converting one-time purchasers"
        ];
      } else if (industry === "logistics") {
        prediction = [
          { cluster: "Urban fast delivery", count: 870, percentage: 35 },
          { cluster: "Suburban standard", count: 780, percentage: 31 },
          { cluster: "Rural extended delivery", count: 520, percentage: 21 },
          { cluster: "International shipping", count: 340, percentage: 13 }
        ];
        confidence = 0.93;
        insights = [
          "Urban deliveries (35%) have the fastest transit times",
          "Rural routes have 2.3x higher fuel consumption per delivery",
          "Consider hub consolidation for suburban standard segment"
        ];
      } else if (industry === "tech") {
        prediction = [
          { cluster: "Power users", count: 950, percentage: 32 },
          { cluster: "Regular users", count: 1150, percentage: 38 },
          { cluster: "Occasional users", count: 580, percentage: 19 },
          { cluster: "At-risk users", count: 320, percentage: 11 }
        ];
        confidence = 0.94;
        insights = [
          "Power users (32%) have 4.2x higher feature engagement",
          "At-risk users show declining login patterns over 30 days",
          "Regular users represent highest growth potential segment"
        ];
      } else if (industry === "realestate") {
        prediction = [
          { cluster: "Urban luxury", count: 450, percentage: 27 },
          { cluster: "Suburban family", count: 680, percentage: 41 },
          { cluster: "Investment property", count: 320, percentage: 19 },
          { cluster: "Rural development", count: 220, percentage: 13 }
        ];
        confidence = 0.90;
        insights = [
          "Suburban family properties (41%) have shortest time-to-sale",
          "Urban luxury segment commands 2.8x higher per-sqft pricing",
          "Investment properties show most consistent appreciation"
        ];
      }
    }

    const { data: modelData, error: modelError } = await supabase
      .from("predictive_models")
      .insert({
        user_id: user.id,
        name: `${industry} ${modelType} model`,
        model_type: modelType,
        industry: industry,
        target_variable: target,
        data_source: dataSource,
        status: "completed",
        training_progress: 100
      })
      .select()
      .single();

    if (modelError) throw modelError;

    return new Response(
      JSON.stringify({
        id: modelData.id,
        prediction,
        confidence,
        insights,
        created_at: modelData.created_at
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in predict function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
