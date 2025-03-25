
import React, { createContext, useContext, useState, useEffect } from "react";
import { generateColoring, ReplicateImageParams } from "../services/replicateService";

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
  const [useReplicate, setUseReplicate] = useState<boolean>(false);

  // Save API key to localStorage when it changes
  useEffect(() => {
    if (replicateApiKey) {
      localStorage.setItem("replicateApiKey", replicateApiKey);
    }
  }, [replicateApiKey]);

  // Generate drawing options using Replicate or mock data
  const generateDrawingOptions = async (description: string) => {
    setIsGenerating(true);
    
    try {
      if (useReplicate && replicateApiKey) {
        // Use Replicate API to generate images
        const params: ReplicateImageParams = {
          prompt: description,
          num_outputs: 4,
          guidance_scale: 7
        };
        
        const imageUrls = await generateColoring(params, replicateApiKey);
        
        // Convert the results to the format expected by the app
        const options: DrawingOption[] = imageUrls.map((url, index) => ({
          id: (index + 1).toString(),
          url,
          alt: `AI generated drawing of ${description}`
        }));
        
        setDrawingOptions(options);
      } else {
        // Use mock data for development or when API key is not set
        await new Promise(resolve => setTimeout(resolve, 2000));
        setDrawingOptions(MOCK_DRAWINGS);
      }
    } catch (error) {
      console.error("Error generating drawings:", error);
      setDrawingOptions([]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate outline options
  const generateOutlineOptions = async (drawingId: string) => {
    setIsGenerating(true);
    
    try {
      // For now, we'll use mock data for outlines
      // In a future implementation, we could use a different model or parameters
      // for generating different outline styles
      await new Promise(resolve => setTimeout(resolve, 2000));
      setOutlineOptions(MOCK_OUTLINES);
    } catch (error) {
      console.error("Error generating outlines:", error);
      setOutlineOptions([]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Reset the state
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
