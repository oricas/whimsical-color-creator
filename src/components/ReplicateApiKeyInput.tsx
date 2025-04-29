
import React, { useState } from "react";
import { useDrawing } from "@/context/DrawingContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Key, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const ReplicateApiKeyInput: React.FC = () => {
  const { replicateApiKey, setReplicateApiKey, setUseReplicate } = useDrawing();
  const [apiKey, setApiKey] = useState(replicateApiKey || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTroubleshooting, setShowTroubleshooting] = useState(false);

  const handleSave = async () => {
    if (!apiKey.trim()) {
      toast.error("Please enter a valid API key");
      return;
    }

    setIsSubmitting(true);
    try {
      // Save the API key
      setReplicateApiKey(apiKey.trim());
      
      // Enable Replicate integration
      setUseReplicate(true);
      
      // Show success message
      toast.success("API key saved. Replicate AI is now enabled.");
      
      // Trigger a page reload to ensure the context is properly updated
      window.location.reload();
    } catch (error) {
      console.error("Error saving API key:", error);
      toast.error("Failed to save API key. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 my-4">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center gap-2">
          <Key className="h-4 w-4 text-amber-600" />
          <h3 className="text-sm font-medium text-amber-800">Set Replicate API Key</h3>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            type="password"
            placeholder="Enter your Replicate API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
            disabled={isSubmitting}
          />
          <Button 
            onClick={handleSave}
            className="bg-amber-600 hover:bg-amber-700 text-white"
            size="sm"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>Saving...</>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Save Key
              </>
            )}
          </Button>
        </div>
        
        <p className="text-xs text-amber-700">
          Get your API key from <a href="https://replicate.com/account/api-tokens" target="_blank" rel="noreferrer" className="underline">Replicate Account</a>
        </p>

        <button 
          type="button" 
          onClick={() => setShowTroubleshooting(!showTroubleshooting)}
          className="text-xs text-amber-700 underline"
        >
          {showTroubleshooting ? "Hide troubleshooting tips" : "Having connection issues?"}
        </button>
        
        {showTroubleshooting && (
          <Alert className="bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertTitle>Connection Troubleshooting</AlertTitle>
            <AlertDescription className="text-xs space-y-2">
              <p>If you're experiencing "Failed to fetch" errors:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Ensure you're using the correct API key from your Replicate account</li>
                <li>Check if any ad blockers or privacy tools might be blocking API requests</li>
                <li>Try using a different browser or network connection</li>
                <li>The API has rate limits that might be affecting your requests</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default ReplicateApiKeyInput;
