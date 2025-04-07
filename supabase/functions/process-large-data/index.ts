
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { type, data, chunkSize = 1000 } = await req.json();

    if (!type || !data || !Array.isArray(data)) {
      throw new Error("Invalid request format. Requires 'type' and 'data' array.");
    }

    console.log(`Processing ${data.length} records of type ${type}`);

    // Process data in chunks to avoid timeouts
    const chunks = Math.ceil(data.length / chunkSize);
    const results = [];

    for (let i = 0; i < chunks; i++) {
      const startIdx = i * chunkSize;
      const endIdx = Math.min((i + 1) * chunkSize, data.length);
      const chunk = data.slice(startIdx, endIdx);

      console.log(`Processing chunk ${i + 1}/${chunks}, records ${startIdx}-${endIdx}`);

      let result;
      switch (type) {
        case 'banking':
          result = await processBankingData(supabase, chunk);
          break;
        case 'ecommerce':
          result = await processEcommerceData(supabase, chunk);
          break;
        case 'healthcare':
          result = await processHealthcareData(supabase, chunk);
          break;
        default:
          throw new Error(`Unsupported data type: ${type}`);
      }

      results.push(result);
      
      // Log system action
      await logSystemAction(supabase, `Processed ${chunk.length} ${type} records`);
    }

    return new Response(JSON.stringify({
      success: true,
      processedRecords: data.length,
      results
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Error processing data:", error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    });
  }
});

// Process banking data
async function processBankingData(supabase: any, data: any[]) {
  // Here we would apply banking-specific transformations and validations
  
  // For demo purposes, we just validate and return statistics
  const records = data.length;
  const validRecords = data.filter(record => 
    record.id && 
    record.accountId && 
    typeof record.amount === 'number'
  ).length;
  
  return {
    totalRecords: records,
    validRecords,
    invalidRecords: records - validRecords
  };
}

// Process e-commerce data
async function processEcommerceData(supabase: any, data: any[]) {
  // Here we would apply e-commerce-specific transformations and validations
  
  // Calculate basic product stats
  const lowStock = data.filter(item => item.inventory > 0 && item.inventory < 10).length;
  const outOfStock = data.filter(item => item.inventory === 0).length;
  const totalValue = data.reduce((sum, item) => sum + (item.price * item.inventory), 0);
  
  return {
    totalProducts: data.length,
    lowStockCount: lowStock,
    outOfStockCount: outOfStock,
    inventoryValue: totalValue
  };
}

// Process healthcare data
async function processHealthcareData(supabase: any, data: any[]) {
  // Here we would apply healthcare-specific transformations, validations
  // and compliance measures
  
  // Count records and analyze diagnosis frequency
  const diagnosisCounts: Record<string, number> = {};
  let totalDiagnoses = 0;
  
  for (const record of data) {
    if (record.diagnosis && Array.isArray(record.diagnosis)) {
      for (const diagnosis of record.diagnosis) {
        diagnosisCounts[diagnosis] = (diagnosisCounts[diagnosis] || 0) + 1;
        totalDiagnoses++;
      }
    }
  }
  
  return {
    recordCount: data.length,
    totalDiagnoses,
    topDiagnoses: Object.entries(diagnosisCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }))
  };
}

// Log system action
async function logSystemAction(supabase: any, message: string) {
  try {
    const { error } = await supabase
      .from('system_logs')
      .insert({
        action: 'DATA_PROCESSING',
        status: 'success',
        description: message,
        metadata: { timestamp: new Date().toISOString() }
      });
    
    if (error) {
      console.error("Error logging system action:", error);
    }
  } catch (err) {
    console.error("Failed to log system action:", err);
  }
}
