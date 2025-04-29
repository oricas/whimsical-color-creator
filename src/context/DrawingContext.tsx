
import React, { createContext, useState, useEffect } from "react";
import { DrawingContextType, DrawingOption, PrintSettings } from "../types/drawing";
import { generateDrawings, generateOutlines } from "../services/drawingService";
import { initialPrintSettings } from "../data/mockDrawings";
import { toast } from "sonner";

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
      const options = await generateDrawings(description, useReplicate, replicateApiKey);
      setDrawingOptions(options);
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
      const options = await generateOutlines(drawingId);
      setOutlineOptions(options);
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

export { DrawingContext };
