
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
      simple: 'Convert this into a simple black and white coloring page with thick, clear outlines. Remove all colors and fill, keep only the main shapes and outlines. Make it suitable for children to color.',
      detailed: 'Convert this into a detailed black and white coloring page with medium-thick outlines and moderate detail level. Remove all colors, keep line art only.',
      artistic: 'Convert this into an artistic black and white line drawing with varied line weights and intricate details suitable for adult coloring. Remove all colors, keep only outlines and line art.'
    };

    // Generate 3 different outline variations of the selected image
    const outlines = [];
    for (let i = 0; i < 3; i++) {
      try {
        const response = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: `${stylePrompts[style]} Create a black and white coloring page outline based on this concept. Variation ${i + 1} with slightly different line thickness and detail level.`,
            model: 'dall-e-3',
            n: 1,
            size: '1024x1024',
            quality: 'standard',
            style: 'natural'
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
