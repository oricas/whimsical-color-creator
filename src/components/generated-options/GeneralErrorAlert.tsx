
import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import Button from "../ui-custom/Button";

interface GeneralErrorAlertProps {
  error: string;
  onRetry: () => void;
}

const GeneralErrorAlert: React.FC<GeneralErrorAlertProps> = ({ error, onRetry }) => {
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-5 w-5" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription className="space-y-2">
        <p>{error}</p>
        <div className="flex justify-end mt-2">
          <Button 
            variant="outline" 
            onClick={onRetry} 
            icon={<RefreshCw size={16} />}
          >
            Retry
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default GeneralErrorAlert;
