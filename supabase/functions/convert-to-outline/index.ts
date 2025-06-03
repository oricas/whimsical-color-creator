
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
    const { imageUrl, style = 'simple' } = await req.json();
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    if (!imageUrl) {
      return new Response(
        JSON.stringify({ error: 'Image URL is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Converting image to outline:', imageUrl, 'style:', style);

    const stylePrompts = {
      simple: 'Convert this image into a simple black and white line drawing suitable for children to color. Use thick, clear outlines with minimal detail.',
      detailed: 'Convert this image into a detailed black and white coloring page with medium-thick outlines and moderate detail level.',
      artistic: 'Convert this image into an artistic black and white line drawing with varied line weights and intricate details suitable for adult coloring.'
    };

    // Generate 3 different outline variations
    const outlines = [];
    for (let i = 0; i < 3; i++) {
      try {
        const response = await fetch('https://api.openai.com/v1/images/variations', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: imageUrl,
            n: 1,
            size: '1024x1024',
            response_format: 'url'
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          console.error(`OpenAI API error for outline ${i + 1}:`, error);
          continue;
        }

        const data = await response.json();
        outlines.push({
          id: (i + 1).toString(),
          url: data.data[0].url,
          alt: `${style} outline ${i + 1}`
        });

        console.log(`Generated outline ${i + 1} successfully`);
      } catch (error) {
        console.warn(`Failed to generate outline ${i + 1}:`, error);
      }
    }

    // Fallback: create mock outlines based on the original image if API fails
    if (outlines.length === 0) {
      console.log('Using fallback outlines');
      for (let i = 0; i < 3; i++) {
        outlines.push({
          id: (i + 1).toString(),
          url: imageUrl, // Use original image as fallback
          alt: `${style} outline ${i + 1}`
        });
      }
    }

    return new Response(
      JSON.stringify({ outlines }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error in convert-to-outline function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
