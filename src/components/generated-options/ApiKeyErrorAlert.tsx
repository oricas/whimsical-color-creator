
import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import Button from "../ui-custom/Button";

interface ApiKeyErrorAlertProps {
  error: string;
  onDismiss: () => void;
}

const ApiKeyErrorAlert: React.FC<ApiKeyErrorAlertProps> = ({ error, onDismiss }) => {
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-5 w-5" />
      <AlertTitle>API Key Error</AlertTitle>
      <AlertDescription className="space-y-2">
        <p>{error}</p>
        <div className="flex justify-end mt-2">
          <Button 
            variant="outline" 
            onClick={onDismiss}
          >
            Dismiss
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default ApiKeyErrorAlert;
