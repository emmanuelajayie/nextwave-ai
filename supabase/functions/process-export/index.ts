import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get pending exports
    const { data: exports, error: fetchError } = await supabase
      .from('exports')
      .select('*')
      .eq('status', 'pending')
      .limit(10)

    if (fetchError) throw fetchError

    for (const exportItem of exports || []) {
      // Process export based on format
      const downloadUrl = `https://example.com/exports/${exportItem.id}` // Replace with actual export logic
      
      // Update export status
      const { error: updateError } = await supabase
        .from('exports')
        .update({ 
          status: 'completed',
          download_url: downloadUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', exportItem.id)

      if (updateError) throw updateError
    }

    return new Response(
      JSON.stringify({ message: 'Exports processed successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error processing exports:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})