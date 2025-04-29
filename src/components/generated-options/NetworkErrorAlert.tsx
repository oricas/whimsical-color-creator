
import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import Button from "../ui-custom/Button";

interface NetworkErrorAlertProps {
  error: string;
  onRetry: () => void;
  isCorsError?: boolean;
}

const NetworkErrorAlert: React.FC<NetworkErrorAlertProps> = ({ 
  error, 
  onRetry, 
  isCorsError = false 
}) => {
  if (isCorsError) return null;
  
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-5 w-5" />
      <AlertTitle>Connection Error</AlertTitle>
      <AlertDescription className="space-y-2">
        <p>{error}</p>
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
            onClick={onRetry} 
            icon={<RefreshCw size={16} />}
          >
            Retry Connection
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default NetworkErrorAlert;
