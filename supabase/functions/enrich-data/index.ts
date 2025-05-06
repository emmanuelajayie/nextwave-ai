
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    let requestData;
    try {
      requestData = await req.json();
    } catch (parseError) {
      console.error("Error parsing request:", parseError);
      return new Response(JSON.stringify({ 
        error: "Invalid request format. Expected JSON body." 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const { data, enrichmentType } = requestData;
    
    if (!data || !Array.isArray(data)) {
      return new Response(JSON.stringify({ 
        error: "Data must be provided as an array" 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    if (!enrichmentType) {
      return new Response(JSON.stringify({ 
        error: "Enrichment type must be specified" 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')

    if (!openAIApiKey) {
      console.error("OpenAI API key not configured");
      return new Response(JSON.stringify({ 
        error: "OpenAI API key not configured on the server" 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log("Enriching data:", { enrichmentType, dataLength: data.length })

    const prompt = `Given this customer data: ${JSON.stringify(data)}, 
    please enrich it with realistic ${enrichmentType} information. 
    Return only the enriched data in valid JSON format.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a data enrichment assistant. Return only valid JSON data.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
      }),
    })

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("OpenAI API error:", response.status, errorBody);
      return new Response(JSON.stringify({ 
        error: `OpenAI API error: ${response.status}` 
      }), {
        status: 502, // Bad gateway
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const result = await response.json()
    
    if (!result.choices || !result.choices[0] || !result.choices[0].message) {
      console.error("Unexpected response format from OpenAI:", result);
      return new Response(JSON.stringify({ 
        error: "Invalid response format from AI service" 
      }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let enrichedData;
    try {
      enrichedData = JSON.parse(result.choices[0].message.content);
    } catch (parseError) {
      console.error("Error parsing AI response as JSON:", parseError);
      return new Response(JSON.stringify({ 
        error: "AI returned invalid JSON format" 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ enrichedData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error in enrich-data function:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
