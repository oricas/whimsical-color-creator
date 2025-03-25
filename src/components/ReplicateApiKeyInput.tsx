
import React, { useState } from "react";
import { useDrawing } from "@/context/DrawingContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Key, Check } from "lucide-react";
import { toast } from "sonner";

const ReplicateApiKeyInput: React.FC = () => {
  const { replicateApiKey, setReplicateApiKey, setUseReplicate } = useDrawing();
  const [apiKey, setApiKey] = useState(replicateApiKey);

  const handleSave = () => {
    if (apiKey.trim()) {
      setReplicateApiKey(apiKey.trim());
      setUseReplicate(true);
      toast.success("API key saved. Replicate AI is now enabled.");
    } else {
      toast.error("Please enter a valid API key");
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
            className="flex-1"
          />
          <Button 
            onClick={handleSave}
            className="bg-amber-600 hover:bg-amber-700 text-white"
            size="sm"
          >
            <Check className="mr-2 h-4 w-4" />
            Save Key
          </Button>
        </div>
        
        <p className="text-xs text-amber-700">
          Get your API key from <a href="https://replicate.com/account/api-tokens" target="_blank" rel="noreferrer" className="underline">Replicate Account</a>
        </p>
      </div>
    </div>
  );
};

export default ReplicateApiKeyInput;
