
import { DrawingOption } from "../types/drawing";
import { generateColoring, ReplicateImageParams } from "./replicateService";
import { MOCK_DRAWINGS, MOCK_OUTLINES } from "../data/mockDrawings";
import { toast } from "sonner";

export const generateDrawings = async (
  description: string, 
  useReplicate: boolean, 
  replicateApiKey: string
): Promise<DrawingOption[]> => {
  if (useReplicate && replicateApiKey) {
    console.log("Using Replicate API to generate images");
    const params: ReplicateImageParams = {
      prompt: description,
      num_outputs: 4,
      guidance_scale: 7
    };
    
    try {
      const imageUrls = await generateColoring(params, replicateApiKey);
      
      // If we get here, the API call was successful
      const options: DrawingOption[] = imageUrls.map((url, index) => ({
        id: (index + 1).toString(),
        url,
        alt: `AI generated drawing of ${description}`
      }));
      
      if (options.length === 0) {
        throw new Error("No images were generated. Please try again with a different description.");
      }
      
      toast.success("Drawings generated successfully!");
      return options;
    } catch (error: any) {
      console.error("Error from Replicate API:", error);
      
      // Handle CORS issues specially
      if (error.message && error.message.includes("Direct API calls from the browser")) {
        // Use mock data in case of CORS issues but with a warning
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.warning("Using demo images due to browser API restrictions");
        return MOCK_DRAWINGS;
      } else {
        // Don't fall back to mock data for other errors, propagate the error
        throw error;
      }
    }
  } else {
    console.log("Not using Replicate API - API key not set or feature disabled");
    
    // Don't use mock data automatically if Replicate should be enabled but isn't properly configured
    if (useReplicate) {
      throw new Error("Replicate API is not properly configured. Please set your API key.");
    }
    
    // Only use mock data in development or if Replicate is explicitly disabled
    if (process.env.NODE_ENV === "development" && !useReplicate) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.info("Using mock data for development");
      return MOCK_DRAWINGS;
    } else {
      throw new Error("Replicate API is not enabled. Please enable it in settings.");
    }
  }
};

export const generateOutlines = async (drawingId: string): Promise<DrawingOption[]> => {
  // For now we're using mock outlines, but this can be updated to use the real API
  await new Promise(resolve => setTimeout(resolve, 1000));
  toast.success("Outline options loaded");
  return MOCK_OUTLINES;
};
