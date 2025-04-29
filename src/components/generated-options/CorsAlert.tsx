
import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const CorsAlert: React.FC = () => {
  return (
    <Alert className="bg-amber-50 border-amber-200 mb-4">
      <AlertCircle className="h-5 w-5 text-amber-600" />
      <AlertTitle>Browser Security Notice</AlertTitle>
      <AlertDescription className="space-y-2">
        <p>Due to browser security restrictions (CORS), we're displaying demo images instead of connecting to the Replicate API directly.</p>
        <p className="mt-1 text-sm">In a production app, these API requests would be made through a server-side proxy.</p>
      </AlertDescription>
    </Alert>
  );
};

export default CorsAlert;
