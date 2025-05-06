
// This service handles interactions with the Replicate AI API
import { toast } from "sonner";

const REPLICATE_API_URL = "https://api.replicate.com/v1/predictions";

// For coloring pages, we're using a model that creates line art drawings
const COLORING_PAGE_MODEL = "jagilley/controlnet-scribble:435061a1b5a4c1e26740464bf786efdfa9cb3a3ac488595a2de23e143fdb0117";

// Browser-based applications often face CORS issues with direct API calls
const HAS_CORS_ISSUE = true;

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

/**
 * Generates coloring page images using the Replicate API.
 * @param params - Parameters for the image generation
 * @param apiKey - Replicate API key
 * @returns A Promise resolving to an array of image URLs
 */
export const generateColoring = async (
  params: ReplicateImageParams, 
  apiKey: string
): Promise<string[]> => {
  try {
    console.log("Generating coloring with params:", params);
    
    if (!apiKey || apiKey.trim() === "") {
      throw new Error("API key is missing or invalid");
    }
    
    // If we're in the browser and likely to face CORS issues
    if (HAS_CORS_ISSUE) {
      console.log("Using workaround for CORS issues");
      
      // For development testing, return mock images
      if (process.env.NODE_ENV === "development") {
        console.log("In development mode - returning mock images due to CORS restrictions");
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
        
        // Return demo images
        return [
          "https://replicate.delivery/pbxt/GXzs77S3MbbPX4lyJPh7gJvn1C4Bbdk2GS4BGNizf3yNBnJQA/out-0.png",
          "https://replicate.delivery/pbxt/Mfn3NF1BYjRJE1rkz2QqMvGTgJK6uCWGdJWVmfn1vMalznHiA/out-0.png",
          "https://replicate.delivery/pbxt/CEl095JVb7JXlBIGO7rpN7wqDXEF2gJxvrd7idplgmO0rnJQA/out-0.png",
          "https://replicate.delivery/pbxt/ZVzQdjkuVv9bvN1C3NiY11Ojh0kmRUvgmN4rXwjw96pydDcQA/out-0.png"
        ];
      }
      
      // Instructions for users in browser environments
      throw new Error(
        "Direct API calls from the browser to Replicate are blocked by CORS. " +
        "In production, you would need to set up a backend proxy server to make these requests. " +
        "For this demo, we're using placeholder images in development mode."
      );
    }
    
    // Set up request options
    const requestOptions = {
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
        webhook: null,
        webhook_events_filter: null
      })
    };
    
    console.log("Making request to Replicate API...");
    
    try {
      // Attempt to create the prediction
      const createResponse = await fetch(REPLICATE_API_URL, requestOptions);
      
      // Handle HTTP error responses
      if (!createResponse.ok) {
        const errorText = await createResponse.text();
        console.error("Replicate API error response:", errorText);
        
        let errorMessage = "Failed to generate coloring page";
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.detail) {
            // Format API error message
            errorMessage = typeof errorData.detail === 'string' 
              ? errorData.detail 
              : JSON.stringify(errorData.detail);
              
            // Check for common API key issues
            if (errorMessage.includes("Authentication credentials were not provided") || 
                errorMessage.includes("Invalid token")) {
              errorMessage = "Invalid API key. Please check your Replicate API key and try again.";
            }
          }
        } catch (e) {
          // If we can't parse the error, use the default message
        }
        
        throw new Error(errorMessage);
      }

      const predictionData = await createResponse.json();
      console.log("Replicate API response:", predictionData);
      
      // If we got the result immediately (within wait time)
      if (predictionData.status === "succeeded" && predictionData.output) {
        return predictionData.output;
      }
      
      // If we need to poll for the result
      const predictionId = predictionData.id;
      return await pollForPredictionResult(predictionId, apiKey);
    } catch (error) {
      // Handle network errors specifically
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        console.error("Network error connecting to Replicate API");
        throw new Error("Network error: Unable to connect to Replicate API. This may be due to network connectivity issues, ad blockers, browser extensions, or CORS restrictions.");
      }
      throw error;
    }
  } catch (error: any) {
    console.error("Error generating coloring page:", error);
    throw error; // Re-throw to be handled by the caller
  }
};

// Helper function to poll for the prediction result
const pollForPredictionResult = async (
  predictionId: string, 
  apiKey: string,
  retryCount = 0
): Promise<string[]> => {
  const maxRetries = 3; // Number of retries for transient errors
  const maxAttempts = 30; // Poll for up to 5 minutes (30 attempts * 10 seconds)
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    try {
      console.log(`Polling attempt ${attempts + 1} for prediction ${predictionId}`);
      
      try {
        const response = await fetch(`${REPLICATE_API_URL}/${predictionId}`, {
          headers: {
            "Authorization": `Token ${apiKey}`,
            "Content-Type": "application/json"
          }
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Polling error response:", errorText);
          
          let errorMessage = "Failed to check prediction status";
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.detail || errorMessage;
          } catch (e) {
            // If we can't parse the error, use the default message
          }
          
          throw new Error(errorMessage);
        }
        
        const predictionData: ReplicateResponse = await response.json();
        console.log("Polling response:", predictionData);
        
        if (predictionData.status === "succeeded" && predictionData.output) {
          return predictionData.output;
        } else if (predictionData.status === "failed" || predictionData.status === "canceled") {
          throw new Error(predictionData.error || "Generation failed or was canceled");
        }
      } catch (error) {
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
          console.error("Network error during polling");
          
          // Retry for transient network errors
          if (retryCount < maxRetries) {
            console.log(`Retrying after network error (${retryCount + 1}/${maxRetries})`);
            return pollForPredictionResult(predictionId, apiKey, retryCount + 1);
          }
          
          throw new Error("Network error: Unable to connect to Replicate API while checking generation status.");
        }
        throw error;
      }
      
      // Wait 10 seconds before polling again
      await new Promise(resolve => setTimeout(resolve, 10000));
      attempts++;
    } catch (error) {
      console.error("Error polling for prediction:", error);
      throw error;
    }
  }
  
  throw new Error("Timeout waiting for coloring page generation. The process is taking longer than expected.");
};
