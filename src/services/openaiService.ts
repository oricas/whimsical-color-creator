
interface OpenAIImageResponse {
  data: Array<{
    url: string;
    revised_prompt?: string;
  }>;
}

export class OpenAIService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateImages(prompt: string, count: number = 4): Promise<Array<{ id: string; url: string; alt: string }>> {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: `Create a detailed, child-friendly coloring page design: ${prompt}. Make it suitable for coloring with clear, bold outlines and interesting details.`,
        model: 'dall-e-3',
        n: 1,
        size: '1024x1024',
        quality: 'standard',
        style: 'natural'
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data: OpenAIImageResponse = await response.json();
    
    // Generate multiple variations by calling the API multiple times
    const images = [];
    for (let i = 0; i < Math.min(count, 4); i++) {
      if (i === 0) {
        // Use the first generated image
        images.push({
          id: (i + 1).toString(),
          url: data.data[0].url,
          alt: `Generated image ${i + 1}: ${prompt}`
        });
      } else {
        // Generate additional variations
        try {
          const variationResponse = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
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

          if (variationResponse.ok) {
            const variationData: OpenAIImageResponse = await variationResponse.json();
            images.push({
              id: (i + 1).toString(),
              url: variationData.data[0].url,
              alt: `Generated image ${i + 1}: ${prompt}`
            });
          }
        } catch (error) {
          console.warn(`Failed to generate variation ${i + 1}:`, error);
        }
      }
    }

    return images;
  }

  async convertToOutline(imageUrl: string, style: 'simple' | 'detailed' | 'artistic' = 'simple'): Promise<Array<{ id: string; url: string; alt: string }>> {
    const stylePrompts = {
      simple: 'Convert this image into a simple black and white line drawing suitable for children to color. Use thick, clear outlines with minimal detail.',
      detailed: 'Convert this image into a detailed black and white coloring page with medium-thick outlines and moderate detail level.',
      artistic: 'Convert this image into an artistic black and white line drawing with varied line weights and intricate details suitable for adult coloring.'
    };

    const response = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        image: imageUrl,
        prompt: stylePrompts[style],
        n: 3,
        size: '1024x1024'
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data: OpenAIImageResponse = await response.json();
    
    return data.data.map((image, index) => ({
      id: (index + 1).toString(),
      url: image.url,
      alt: `Outline style ${index + 1}`
    }));
  }
}
