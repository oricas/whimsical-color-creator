
import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import ReplicateApiKeyInput from "../ReplicateApiKeyInput";

const ApiKeyPrompt: React.FC = () => {
  return (
    <>
      <div className="bg-amber-100 border border-amber-300 rounded-lg p-3 mb-2 flex items-center gap-2">
        <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
        <p className="text-amber-800 text-sm">
          Replicate AI is not enabled. Please set your API key below to generate real coloring pages.
        </p>
      </div>
      <ReplicateApiKeyInput />
    </>
  );
};

export default ApiKeyPrompt;
