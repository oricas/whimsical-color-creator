import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDrawing } from "@/context/DrawingContext";
import { TextArea } from "@/components/ui-custom/Input";
import Button from "@/components/ui-custom/Button";
import { Image, Sparkles, MessageSquare, Paintbrush } from "lucide-react";
import { AnimatedTransition } from "./AnimatedTransition";
import { toast } from "sonner";

const PROMPT_EXAMPLES = [
  "Create a drawing of football players with guitars",
  "A cat wearing a crown and royal cape",
  "Dinosaurs playing in a playground",
  "A magical forest with fairies and unicorns",
  "Astronauts playing sports on the moon"
];

const DrawingForm: React.FC = () => {
  const navigate = useNavigate();
  const { 
    description, 
    setDescription, 
    isGenerating, 
    generateDrawingOptions
  } = useDrawing();
  const [promptError, setPromptError] = useState("");
  const [showExamples, setShowExamples] = useState(false);

  const handleGenerate = async () => {
    if (!description.trim()) {
      setPromptError("Please enter a description");
      return;
    }
    
    setPromptError("");
    
    try {
      await generateDrawingOptions(description);
      toast.success("Images generated successfully!");
      navigate("/create/options");
    } catch (error) {
      console.error("Generation error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate images. Please try again.");
    }
  };

  const handleExampleClick = (example: string) => {
    setDescription(example);
    setShowExamples(false);
  };

  return (
    <AnimatedTransition className="max-w-2xl mx-auto">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <div className="inline-block bg-king-100 text-king-800 rounded-full px-3 py-1 text-sm font-medium mb-2">
            Step 1
          </div>
          <h1 className="text-3xl font-display font-bold">Describe Your Coloring Page</h1>
          <p className="text-muted-foreground">
            Describe what you'd like to create and our AI will generate several options for you.
          </p>
        </div>

        <div className="bg-card rounded-xl border border-border/60 shadow-sm p-6 space-y-4">
          <TextArea
            label="Description"
            placeholder="Enter a detailed description of what you'd like to see in your coloring page..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            error={promptError}
            className="w-full"
            id="description"
          />
          
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => setShowExamples(!showExamples)}
              className="text-sm text-king-600 hover:text-king-700 flex items-center gap-1"
            >
              <Sparkles size={16} />
              <span>{showExamples ? "Hide examples" : "Show examples"}</span>
            </button>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setDescription("")}
                disabled={!description || isGenerating}
              >
                Clear
              </Button>
              
              <Button
                variant="premium"
                icon={<Image size={18} />}
                onClick={handleGenerate}
                isLoading={isGenerating}
                loadingText="Generating..."
                disabled={isGenerating || !description.trim()}
              >
                Generate Images
              </Button>
            </div>
          </div>
          
          {showExamples && (
            <AnimatedTransition className="pt-2">
              <div className="bg-king-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-king-700">
                  <Sparkles size={16} />
                  <span>Prompt Examples</span>
                </div>
                <div className="grid gap-2">
                  {PROMPT_EXAMPLES.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => handleExampleClick(example)}
                      className="text-left text-sm p-2 rounded-md hover:bg-king-100 transition-colors text-muted-foreground hover:text-foreground flex items-start gap-2"
                    >
                      <MessageSquare size={14} className="mt-0.5 flex-shrink-0 text-king-400" />
                      <span>{example}</span>
                    </button>
                  ))}
                </div>
              </div>
            </AnimatedTransition>
          )}
        </div>
        
        <div className="glass rounded-xl p-6 text-center space-y-4">
          <div className="flex items-center justify-center">
            <div className="h-12 w-12 bg-king-100 rounded-full flex items-center justify-center">
              <Paintbrush className="h-6 w-6 text-king-600" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-1">How it works</h3>
            <p className="text-sm text-muted-foreground">
              Connect your OpenAI API key, describe what you want, and our AI will generate 
              several image options. Choose your favorite, then convert it to different 
              coloring page outline styles. Customize the print settings and you're ready to print!
            </p>
          </div>
        </div>
      </div>
    </AnimatedTransition>
  );
};

export default DrawingForm;
