
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDrawing } from "@/context/DrawingContext";
import { AnimatedTransition } from "./AnimatedTransition";
import Button from "./ui-custom/Button";
import { ChevronLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";

// Import sub-components
import ApiKeyPrompt from "./generated-options/ApiKeyPrompt";
import CorsAlert from "./generated-options/CorsAlert";
import ApiKeyErrorAlert from "./generated-options/ApiKeyErrorAlert";
import NetworkErrorAlert from "./generated-options/NetworkErrorAlert";
import GeneralErrorAlert from "./generated-options/GeneralErrorAlert";
import LoadingState from "./generated-options/LoadingState";
import EmptyState from "./generated-options/EmptyState";
import DrawingGrid from "./generated-options/DrawingGrid";
import FooterInfo from "./generated-options/FooterInfo";

const GeneratedOptions = () => {
  const navigate = useNavigate();
  const { 
    drawingOptions, 
    selectedDrawing, 
    setSelectedDrawing, 
    generateOutlineOptions,
    generateDrawingOptions,
    description,
    replicateApiKey,
    useReplicate,
    isGenerating,
  } = useDrawing();
  
  const [apiError, setApiError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Reset error state when component mounts or dependencies change
    setApiError(null);
  }, [replicateApiKey, useReplicate]);

  const handleSelect = async (drawing) => {
    setSelectedDrawing(drawing);
    await generateOutlineOptions(drawing.id);
    navigate("/create/outlines");
  };

  const handleBack = () => {
    navigate("/create");
  };

  const handleRetry = async () => {
    if (!description) {
      toast.error("No drawing description found. Please go back and enter a description.");
      return;
    }
    
    setApiError(null);
    setRetryCount(prev => prev + 1);
    
    try {
      await generateDrawingOptions(description);
    } catch (error: any) {
      setApiError(error.message || "Failed to connect to Replicate API");
    }
  };

  // Check if we need to show the API key input
  const showApiKeyInput = !replicateApiKey || !useReplicate;

  // Check for different error types
  const isNetworkError = apiError && (apiError.includes("Network error") || apiError.includes("Failed to fetch") || apiError.includes("CORS"));
  const isApiKeyError = apiError && apiError.includes("API key");
  const isCorsError = apiError && apiError.includes("Direct API calls from the browser");

  return (
    <AnimatedTransition className="max-w-6xl mx-auto">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Button 
            variant="ghost" 
            onClick={handleBack}
            className="flex items-center gap-1"
          >
            <ChevronLeft size={16} />
            <span>Back</span>
          </Button>
          
          <div className="inline-block bg-king-100 text-king-800 rounded-full px-3 py-1 text-sm font-medium">
            Step 2
          </div>
        </div>

        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-display font-bold">Choose Your Drawing</h1>
          <p className="text-muted-foreground">
            Select the drawing you'd like to use for your coloring page.
          </p>
        </div>

        {showApiKeyInput && <ApiKeyPrompt />}
        
        {isCorsError && !isGenerating && <CorsAlert />}

        {isApiKeyError && !isGenerating && (
          <ApiKeyErrorAlert 
            error={apiError} 
            onDismiss={() => setApiError(null)} 
          />
        )}

        {isNetworkError && !isCorsError && !isGenerating && (
          <NetworkErrorAlert 
            error={apiError} 
            onRetry={handleRetry} 
          />
        )}

        {apiError && !isNetworkError && !isApiKeyError && !isCorsError && !isGenerating && (
          <GeneralErrorAlert 
            error={apiError} 
            onRetry={handleRetry} 
          />
        )}

        {drawingOptions.length > 0 && (
          <DrawingGrid 
            setSelectedDrawing={setSelectedDrawing}
            description={description}
          />
        )}

        {drawingOptions.length === 0 && !showApiKeyInput && !isGenerating && !apiError && (
          <EmptyState onRetry={handleRetry} />
        )}

        {isGenerating && <LoadingState />}

        {selectedDrawing && (
          <div className="flex justify-center mt-8">
            <Button
              variant="premium"
              size="lg"
              onClick={() => handleSelect(selectedDrawing)}
              icon={<ArrowRight size={18} />}
            >
              Continue with Selected Drawing
            </Button>
          </div>
        )}
        
        <FooterInfo />
      </div>
    </AnimatedTransition>
  );
};

export default GeneratedOptions;
