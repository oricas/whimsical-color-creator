
import React, { useState } from "react";
import { Input } from "@/components/ui-custom/Input";
import Button from "@/components/ui-custom/Button";
import { Key, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface ApiKeyInputProps {
  onApiKeySet: (apiKey: string) => void;
  isLoading?: boolean;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeySet, isLoading }) => {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      toast.error("Please enter your OpenAI API key");
      return;
    }

    if (!apiKey.startsWith('sk-')) {
      toast.error("OpenAI API key should start with 'sk-'");
      return;
    }

    // Store in localStorage for this session
    localStorage.setItem('openai_api_key', apiKey);
    onApiKeySet(apiKey);
    toast.success("API key connected successfully!");
  };

  // Check if we already have a stored API key
  React.useEffect(() => {
    const storedKey = localStorage.getItem('openai_api_key');
    if (storedKey) {
      setApiKey(storedKey);
      onApiKeySet(storedKey);
    }
  }, [onApiKeySet]);

  return (
    <div className="bg-card rounded-xl border border-border/60 shadow-sm p-6 space-y-4">
      <div className="flex items-center gap-2 text-lg font-medium">
        <Key size={20} className="text-king-600" />
        <span>Connect OpenAI API</span>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Enter your OpenAI API key to enable AI image generation and outline conversion. 
        Your key will be stored locally in your browser for this session only.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Input
            type={showKey ? "text" : "password"}
            placeholder="sk-..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              localStorage.removeItem('openai_api_key');
              setApiKey("");
              toast.success("API key cleared");
            }}
            disabled={!apiKey || isLoading}
          >
            Clear
          </Button>
          
          <Button
            type="submit"
            variant="premium"
            isLoading={isLoading}
            disabled={!apiKey || isLoading}
          >
            Connect API Key
          </Button>
        </div>
      </form>

      <div className="text-xs text-muted-foreground border-t pt-4">
        <p className="font-medium mb-1">How to get your OpenAI API key:</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Visit <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-king-600 hover:underline">platform.openai.com/api-keys</a></li>
          <li>Sign in to your OpenAI account</li>
          <li>Click "Create new secret key"</li>
          <li>Copy and paste the key here</li>
        </ol>
      </div>
    </div>
  );
};

export default ApiKeyInput;
