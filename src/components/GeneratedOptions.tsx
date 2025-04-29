
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDrawing } from "@/context/DrawingContext";
import { AnimatedTransition } from "./AnimatedTransition";
import Button from "./ui-custom/Button";
import { ChevronLeft, ArrowRight, AlertCircle, RefreshCw } from "lucide-react";
import ReplicateApiKeyInput from "./ReplicateApiKeyInput";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

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
    setIsGenerating
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
  const isNetworkError = apiError && (apiError.includes("Network error") || apiError.includes("Failed to fetch"));
  const isApiKeyError = apiError && apiError.includes("API key");

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

        {showApiKeyInput && (
          <>
            <div className="bg-amber-100 border border-amber-300 rounded-lg p-3 mb-2 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
              <p className="text-amber-800 text-sm">
                Replicate AI is not enabled. Please set your API key below to generate real coloring pages.
              </p>
            </div>
            <ReplicateApiKeyInput />
          </>
        )}

        {isApiKeyError && !isGenerating && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>API Key Error</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>{apiError}</p>
              <div className="flex justify-end mt-2">
                <Button 
                  variant="outline" 
                  onClick={() => setApiError(null)}
                >
                  Dismiss
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {isNetworkError && !isGenerating && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>Connection Error</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>{apiError}</p>
              <div className="space-y-2 mt-2 text-sm text-red-800">
                <p>Possible solutions:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Check your internet connection</li>
                  <li>Disable any ad blockers or browser extensions</li>
                  <li>Try a different browser (Chrome often works best)</li>
                  <li>If using a VPN, try disabling it temporarily</li>
                </ul>
              </div>
              <div className="flex justify-end mt-2">
                <Button 
                  variant="outline" 
                  onClick={handleRetry} 
                  icon={<RefreshCw size={16} />}
                >
                  Retry Connection
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {apiError && !isNetworkError && !isApiKeyError && !isGenerating && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>{apiError}</p>
              <div className="flex justify-end mt-2">
                <Button 
                  variant="outline" 
                  onClick={handleRetry} 
                  icon={<RefreshCw size={16} />}
                >
                  Retry
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {drawingOptions.map((drawing) => (
            <div
              key={drawing.id}
              className={`border rounded-xl overflow-hidden cursor-pointer transition-all ${
                selectedDrawing?.id === drawing.id
                  ? "ring-2 ring-king-500 border-king-300"
                  : "hover:border-king-300 hover:shadow-md"
              }`}
              onClick={() => setSelectedDrawing(drawing)}
            >
              <div className="aspect-square bg-gray-50">
                <img
                  src={drawing.url}
                  alt={drawing.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-4 flex justify-between items-center">
                <p className="text-sm text-muted-foreground truncate">
                  {description ? `"${description}"` : "Generated drawing"}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(drawing);
                  }}
                  icon={<ArrowRight size={16} />}
                >
                  Select
                </Button>
              </div>
            </div>
          ))}
        </div>

        {drawingOptions.length === 0 && !showApiKeyInput && !isGenerating && !apiError && (
          <div className="p-8 text-center border border-dashed rounded-lg bg-gray-50">
            <div className="flex flex-col items-center gap-3">
              <AlertCircle className="h-8 w-8 text-amber-500" />
              <p className="text-muted-foreground">No drawings could be generated.</p>
              <Button 
                variant="outline" 
                onClick={handleRetry} 
                icon={<RefreshCw size={16} />}
              >
                Retry
              </Button>
            </div>
          </div>
        )}

        {isGenerating && (
          <div className="p-8 text-center border border-dashed rounded-lg bg-gray-50">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-muted-foreground">Generating drawings... This may take a moment.</p>
            </div>
          </div>
        )}

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
      </div>
    </AnimatedTransition>
  );
};

export default GeneratedOptions;
