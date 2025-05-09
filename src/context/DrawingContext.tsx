
import React, { createContext, useContext, useState, useEffect } from "react";
import { generateColoring, ReplicateImageParams } from "../services/replicateService";
import { toast } from "sonner";

// Mock data for development purposes
const MOCK_DRAWINGS = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1581344947731-c678889a686e?q=80&w=1000",
    alt: "Football players running on field"
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1624526267942-ab0c0e53d1c1?q=80&w=1000",
    alt: "Football players with guitars"
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1614632537197-38a17061c2bd?q=80&w=1000",
    alt: "Children playing football"
  },
  {
    id: "4",
    url: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?q=80&w=1000",
    alt: "Football stadium"
  }
];

const MOCK_OUTLINES = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1581344947731-c678889a686e?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
    alt: "Outline 1"
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1624526267942-ab0c0e53d1c1?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
    alt: "Outline 2"
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1614632537197-38a17061c2bd?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
    alt: "Outline 3"
  }
];

interface DrawingOption {
  id: string;
  url: string;
  alt: string;
}

interface PrintSettings {
  pageSize: "A4" | "A3";
  outlineThickness: "thin" | "medium" | "thick";
  outlineColor: "black" | "gray" | "blue";
  copies: number;
}

interface DrawingContextType {
  description: string;
  setDescription: (desc: string) => void;
  isGenerating: boolean;
  setIsGenerating: (state: boolean) => void;
  drawingOptions: DrawingOption[];
  setDrawingOptions: (options: DrawingOption[]) => void;
  selectedDrawing: DrawingOption | null;
  setSelectedDrawing: (drawing: DrawingOption | null) => void;
  outlineOptions: DrawingOption[];
  setOutlineOptions: (options: DrawingOption[]) => void;
  selectedOutline: DrawingOption | null;
  setSelectedOutline: (outline: DrawingOption | null) => void;
  printSettings: PrintSettings;
  setPrintSettings: (settings: PrintSettings) => void;
  generateDrawingOptions: (description: string) => Promise<void>;
  generateOutlineOptions: (drawingId: string) => Promise<void>;
  resetState: () => void;
  replicateApiKey: string;
  setReplicateApiKey: (key: string) => void;
  useReplicate: boolean;
  setUseReplicate: (use: boolean) => void;
}

const initialPrintSettings: PrintSettings = {
  pageSize: "A4",
  outlineThickness: "medium",
  outlineColor: "black",
  copies: 1
};

const DrawingContext = createContext<DrawingContextType | undefined>(undefined);

export const DrawingProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [description, setDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [drawingOptions, setDrawingOptions] = useState<DrawingOption[]>([]);
  const [selectedDrawing, setSelectedDrawing] = useState<DrawingOption | null>(null);
  const [outlineOptions, setOutlineOptions] = useState<DrawingOption[]>([]);
  const [selectedOutline, setSelectedOutline] = useState<DrawingOption | null>(null);
  const [printSettings, setPrintSettings] = useState<PrintSettings>(initialPrintSettings);
  const [replicateApiKey, setReplicateApiKey] = useState<string>(
    localStorage.getItem("replicateApiKey") || ""
  );
  const [useReplicate, setUseReplicate] = useState<boolean>(
    localStorage.getItem("useReplicate") === "true"
  );

  // Save API key to localStorage whenever it changes
  useEffect(() => {
    if (replicateApiKey) {
      localStorage.setItem("replicateApiKey", replicateApiKey);
    } else {
      localStorage.removeItem("replicateApiKey");
    }
  }, [replicateApiKey]);

  // Save useReplicate state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("useReplicate", useReplicate.toString());
  }, [useReplicate]);

  const generateDrawingOptions = async (description: string) => {
    setIsGenerating(true);
    setDrawingOptions([]); // Clear previous results
    
    try {
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
          
          setDrawingOptions(options);
          toast.success("Drawings generated successfully!");
        } catch (error: any) {
          console.error("Error from Replicate API:", error);
          
          // Handle CORS issues specially
          if (error.message && error.message.includes("Direct API calls from the browser")) {
            // Use mock data in case of CORS issues but with a warning
            await new Promise(resolve => setTimeout(resolve, 1000));
            setDrawingOptions(MOCK_DRAWINGS);
            toast.warning("Using demo images due to browser API restrictions");
          } else if (error.message && error.message.includes("Failed to fetch")) {
            // Handle network errors
            await new Promise(resolve => setTimeout(resolve, 1000));
            setDrawingOptions(MOCK_DRAWINGS);
            toast.warning("Network error connecting to API. Using demo images instead.");
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
          setDrawingOptions(MOCK_DRAWINGS);
          toast.info("Using mock data for development");
        } else {
          throw new Error("Replicate API is not enabled. Please enable it in settings.");
        }
      }
    } catch (error: any) {
      console.error("Error generating drawings:", error);
      setDrawingOptions([]);
      
      // Propagate the error up to the component for display
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const generateOutlineOptions = async (drawingId: string) => {
    setIsGenerating(true);
    
    try {
      // For now we're using mock outlines, but this can be updated to use the real API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOutlineOptions(MOCK_OUTLINES);
      toast.success("Outline options loaded");
    } catch (error: any) {
      console.error("Error generating outlines:", error);
      setOutlineOptions([]);
      toast.error(error.message || "Failed to generate outlines");
    } finally {
      setIsGenerating(false);
    }
  };

  const resetState = () => {
    setDescription("");
    setDrawingOptions([]);
    setSelectedDrawing(null);
    setOutlineOptions([]);
    setSelectedOutline(null);
    setPrintSettings(initialPrintSettings);
  };

  return (
    <DrawingContext.Provider
      value={{
        description,
        setDescription,
        isGenerating,
        setIsGenerating,
        drawingOptions,
        setDrawingOptions,
        selectedDrawing,
        setSelectedDrawing,
        outlineOptions,
        setOutlineOptions,
        selectedOutline,
        setSelectedOutline,
        printSettings,
        setPrintSettings,
        generateDrawingOptions,
        generateOutlineOptions,
        resetState,
        replicateApiKey,
        setReplicateApiKey,
        useReplicate,
        setUseReplicate,
      }}
    >
      {children}
    </DrawingContext.Provider>
  );
};

export const useDrawing = () => {
  const context = useContext(DrawingContext);
  if (context === undefined) {
    throw new Error("useDrawing must be used within a DrawingProvider");
  }
  return context;
};
