import React, { createContext, useContext, useState } from "react";
import { SupabaseImageService } from "@/services/supabaseImageService";

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

  // Generate drawing options using Supabase Edge Functions - now generates regular images
  const generateDrawingOptions = async (description: string) => {
    setIsGenerating(true);
    
    try {
      const imageService = new SupabaseImageService();
      const images = await imageService.generateImages(description, 2); // Only 2 options
      setDrawingOptions(images);
    } catch (error) {
      console.error("Error generating drawings:", error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate outline options using Supabase Edge Functions
  const generateOutlineOptions = async (drawingId: string) => {
    const selectedImage = drawingOptions.find(img => img.id === drawingId);
    if (!selectedImage) {
      throw new Error("Selected drawing not found");
    }

    setIsGenerating(true);
    
    try {
      const imageService = new SupabaseImageService();
      const outlines = await imageService.convertToOutline(selectedImage.url, 'simple');
      setOutlineOptions(outlines);
    } catch (error) {
      console.error("Error generating outlines:", error);
      throw error;
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
        apiKey: "", // No longer needed
        setApiKey: () => {}, // No longer needed
        isApiKeySet: true, // Always true since we use Supabase
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
