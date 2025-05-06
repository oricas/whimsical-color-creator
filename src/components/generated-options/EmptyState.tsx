
import React, { useEffect } from "react";
import { AlertCircle, RefreshCw, ImagePlus } from "lucide-react";
import Button from "../ui-custom/Button";
import { toast } from "sonner";
import { useDrawing } from "@/context/DrawingContext";

interface EmptyStateProps {
  onRetry: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onRetry }) => {
  const { description } = useDrawing();
  
  // Auto-generate drawings on initial load if we have a description
  useEffect(() => {
    if (description) {
      console.log("Auto-generating drawings for:", description);
      handleGenerateClick();
    }
  }, []);

  const handleGenerateClick = () => {
    // Show toast to confirm action is happening
    toast.info("Generating drawings...");
    
    // Call the retry function
    onRetry();
  };

  return (
    <div className="p-8 text-center border border-dashed rounded-lg bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <ImagePlus className="h-8 w-8 text-amber-500" />
        <div>
          <p className="text-muted-foreground">
            {description 
              ? `Generating drawings for "${description}"...` 
              : "No drawings have been generated yet."}
          </p>
          <p className="text-sm text-muted-foreground/80 mt-1">
            Click the button below to generate drawings based on your description.
          </p>
        </div>
        <Button 
          variant="premium" 
          onClick={handleGenerateClick} 
          icon={<RefreshCw size={16} />}
          className="mt-2"
        >
          Generate Drawings
        </Button>
      </div>
    </div>
  );
};

export default EmptyState;
