
import React, { useState } from "react";
import { Settings, Key, Check, AlertCircle } from "lucide-react";
import { AnimatedTransition } from "./AnimatedTransition";
import Button from "./ui-custom/Button";
import { useDrawing } from "@/context/DrawingContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const ReplicateSettings: React.FC = () => {
  const { replicateApiKey, setReplicateApiKey, useReplicate, setUseReplicate } = useDrawing();
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState(replicateApiKey);

  const handleSave = () => {
    if (apiKey) {
      setReplicateApiKey(apiKey);
      setUseReplicate(true);
      toast.success("API key saved and Replicate AI enabled");
    } else if (useReplicate) {
      setUseReplicate(false);
      toast.info("Replicate AI disabled, using mock data");
    }
    setIsOpen(false);
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2"
        icon={<Settings className="h-4 w-4" />}
      >
        AI Settings
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Replicate AI Settings</DialogTitle>
            <DialogDescription>
              Configure your Replicate API key to generate coloring pages using AI.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="api-key" className="text-right">
                API Key
              </Label>
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="api-key"
                  type="password"
                  placeholder="Enter your Replicate API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
              <p className="text-xs text-muted-foreground pl-6">
                Get your API key from <a href="https://replicate.com/account/api-tokens" target="_blank" rel="noreferrer" className="text-king-600 hover:underline">Replicate Account</a>
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="use-replicate">Use Replicate AI</Label>
                <p className="text-xs text-muted-foreground">
                  {apiKey ? "Generate real coloring pages with AI" : "Enter API key to enable"}
                </p>
              </div>
              <Switch 
                id="use-replicate" 
                checked={useReplicate && !!apiKey} 
                onCheckedChange={setUseReplicate}
                disabled={!apiKey}
              />
            </div>

            {!apiKey && (
              <div className="bg-amber-50 text-amber-800 p-3 rounded-md flex items-start gap-2 text-sm">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">No API key provided</p>
                  <p>The app will use mock data instead of generating real coloring pages.</p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="premium" onClick={handleSave} icon={<Check className="h-4 w-4" />}>
              Save Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReplicateSettings;
