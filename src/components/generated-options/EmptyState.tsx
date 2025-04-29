
import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import Button from "../ui-custom/Button";

interface EmptyStateProps {
  onRetry: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onRetry }) => {
  return (
    <div className="p-8 text-center border border-dashed rounded-lg bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <AlertCircle className="h-8 w-8 text-amber-500" />
        <p className="text-muted-foreground">No drawings could be generated.</p>
        <Button 
          variant="outline" 
          onClick={onRetry} 
          icon={<RefreshCw size={16} />}
        >
          Retry
        </Button>
      </div>
    </div>
  );
};

export default EmptyState;
