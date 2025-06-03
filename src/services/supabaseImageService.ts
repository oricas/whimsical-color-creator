
import { supabase } from "@/integrations/supabase/client";

interface GeneratedImage {
  id: string;
  url: string;
  alt: string;
}

export class SupabaseImageService {
  async generateImages(prompt: string, count: number = 4): Promise<GeneratedImage[]> {
    console.log('Calling generate-images function with prompt:', prompt);
    
    const { data, error } = await supabase.functions.invoke('generate-images', {
      body: { prompt, count }
    });

    if (error) {
      console.error('Error calling generate-images function:', error);
      throw new Error(`Failed to generate images: ${error.message}`);
    }

    if (!data || !data.images) {
      throw new Error('No images returned from generation service');
    }

    return data.images;
  }

  async convertToOutline(imageUrl: string, style: 'simple' | 'detailed' | 'artistic' = 'simple'): Promise<GeneratedImage[]> {
    console.log('Calling convert-to-outline function with imageUrl:', imageUrl, 'style:', style);
    
    const { data, error } = await supabase.functions.invoke('convert-to-outline', {
      body: { imageUrl, style }
    });

    if (error) {
      console.error('Error calling convert-to-outline function:', error);
      throw new Error(`Failed to convert to outline: ${error.message}`);
    }

    if (!data || !data.outlines) {
      throw new Error('No outlines returned from conversion service');
    }

    return data.outlines;
  }
}
