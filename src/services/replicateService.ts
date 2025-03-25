
// This service handles interactions with the Replicate AI API
import { toast } from "sonner";

const REPLICATE_API_URL = "https://api.replicate.com/v1/predictions";

// For coloring pages, we're using a model that creates line art drawings
const COLORING_PAGE_MODEL = "jagilley/controlnet-scribble:435061a1b5a4c1e26740464bf786efdfa9cb3a3ac488595a2de23e143fdb0117";

export interface ReplicateImageParams {
  prompt: string;
  num_outputs?: number;
  guidance_scale?: number;
  negative_prompt?: string;
}

export interface ReplicateResponse {
  id: string;
  status: "starting" | "processing" | "succeeded" | "failed" | "canceled";
  output: string[] | null;
  error: string | null;
}

export const generateColoring = async (
  params: ReplicateImageParams, 
  apiKey: string
): Promise<string[]> => {
  try {
    // Initialize with the creation request
    const createResponse = await fetch(REPLICATE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${apiKey}`
      },
      body: JSON.stringify({
        version: COLORING_PAGE_MODEL,
        input: {
          prompt: `Line art drawing for coloring page of: ${params.prompt}`,
          negative_prompt: params.negative_prompt || "color, shading, realistic, detailed, complex",
          num_outputs: params.num_outputs || 4,
          guidance_scale: params.guidance_scale || 7,
        },
        wait: 60, // Wait up to 60 seconds for the model to complete
      })
    });

    if (!createResponse.ok) {
      const errorData = await createResponse.json();
      console.error("Replicate API error:", errorData);
      throw new Error(errorData.detail || "Failed to generate coloring page");
    }

    const predictionData = await createResponse.json();
    
    // If we got the result immediately (within wait time)
    if (predictionData.status === "succeeded" && predictionData.output) {
      return predictionData.output;
    }
    
    // If we need to poll for the result
    const predictionId = predictionData.id;
    return await pollForPredictionResult(predictionId, apiKey);
  } catch (error: any) {
    console.error("Error generating coloring page:", error);
    toast.error(error.message || "Failed to generate coloring page");
    throw error;
  }
};

// Helper function to poll for the prediction result
const pollForPredictionResult = async (
  predictionId: string, 
  apiKey: string
): Promise<string[]> => {
  let attempts = 0;
  const maxAttempts = 30; // Poll for up to 5 minutes (30 attempts * 10 seconds)
  
  while (attempts < maxAttempts) {
    try {
      const response = await fetch(`${REPLICATE_API_URL}/${predictionId}`, {
        headers: {
          "Authorization": `Token ${apiKey}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to check prediction status");
      }
      
      const predictionData: ReplicateResponse = await response.json();
      
      if (predictionData.status === "succeeded" && predictionData.output) {
        return predictionData.output;
      } else if (predictionData.status === "failed" || predictionData.status === "canceled") {
        throw new Error(predictionData.error || "Generation failed or was canceled");
      }
      
      // Wait 10 seconds before polling again
      await new Promise(resolve => setTimeout(resolve, 10000));
      attempts++;
    } catch (error) {
      console.error("Error polling for prediction:", error);
      throw error;
    }
  }
  
  throw new Error("Timeout waiting for coloring page generation");
};
