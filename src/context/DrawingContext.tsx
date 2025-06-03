
import React, { createContext, useContext, useState, useEffect } from "react";
import { OpenAIService } from "@/services/openaiService";

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
  apiKey: string;
  setApiKey: (key: string) => void;
  isApiKeySet: boolean;
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
  const [apiKey, setApiKey] = useState("");
  const [isApiKeySet, setIsApiKeySet] = useState(false);

  // Check for stored API key on mount
  useEffect(() => {
    const storedKey = localStorage.getItem('openai_api_key');
    if (storedKey) {
      setApiKey(storedKey);
      setIsApiKeySet(true);
    }
  }, []);

  // Update API key state
  const handleSetApiKey = (key: string) => {
    setApiKey(key);
    setIsApiKeySet(!!key);
  };

  // Generate drawing options using OpenAI
  const generateDrawingOptions = async (description: string) => {
    if (!apiKey) {
      throw new Error("OpenAI API key is required");
    }

    setIsGenerating(true);
    
    try {
      const openaiService = new OpenAIService(apiKey);
      const images = await openaiService.generateImages(description, 4);
      setDrawingOptions(images);
    } catch (error) {
      console.error("Error generating drawings:", error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate outline options using OpenAI
  const generateOutlineOptions = async (drawingId: string) => {
    if (!apiKey) {
      throw new Error("OpenAI API key is required");
    }

    const selectedImage = drawingOptions.find(img => img.id === drawingId);
    if (!selectedImage) {
      throw new Error("Selected drawing not found");
    }

    setIsGenerating(true);
    
    try {
      const openaiService = new OpenAIService(apiKey);
      const outlines = await openaiService.convertToOutline(selectedImage.url, 'simple');
      setOutlineOptions(outlines);
    } catch (error) {
      console.error("Error generating outlines:", error);
      // Fallback to mock data if outline conversion fails
      const mockOutlines = [
        {
          id: "1",
          url: selectedImage.url,
          alt: "Simple outline"
        },
        {
          id: "2", 
          url: selectedImage.url,
          alt: "Detailed outline"
        },
        {
          id: "3",
          url: selectedImage.url,
          alt: "Artistic outline"
        }
      ];
      setOutlineOptions(mockOutlines);
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
        apiKey,
        setApiKey: handleSetApiKey,
        isApiKeySet,
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
