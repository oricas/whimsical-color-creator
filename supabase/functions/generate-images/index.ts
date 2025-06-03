
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, count = 4 } = await req.json();
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Generating images for prompt:', prompt);

    // Generate multiple variations by calling the API multiple times
    const images = [];
    for (let i = 0; i < Math.min(count, 4); i++) {
      try {
        const response = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: `Create a detailed, child-friendly coloring page design: ${prompt}. Make it suitable for coloring with clear, bold outlines and interesting details. Style variation ${i + 1}.`,
            model: 'dall-e-3',
            n: 1,
            size: '1024x1024',
            quality: 'standard',
            style: 'natural'
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          console.error(`OpenAI API error for variation ${i + 1}:`, error);
          continue;
        }

        const data = await response.json();
        images.push({
          id: (i + 1).toString(),
          url: data.data[0].url,
          alt: `Generated image ${i + 1}: ${prompt}`
        });

        console.log(`Generated variation ${i + 1} successfully`);
      } catch (error) {
        console.warn(`Failed to generate variation ${i + 1}:`, error);
      }
    }

    if (images.length === 0) {
      throw new Error('Failed to generate any images');
    }

    return new Response(
      JSON.stringify({ images }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error in generate-images function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
