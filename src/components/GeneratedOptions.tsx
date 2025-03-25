
import React from "react";
import { useNavigate } from "react-router-dom";
import { useDrawing } from "@/context/DrawingContext";
import { AnimatedTransition } from "./AnimatedTransition";
import Button from "./ui-custom/Button";
import { ChevronLeft, ArrowRight } from "lucide-react";
import ReplicateApiKeyInput from "./ReplicateApiKeyInput";

const GeneratedOptions = () => {
  const navigate = useNavigate();
  const { 
    drawingOptions, 
    selectedDrawing, 
    setSelectedDrawing, 
    generateOutlineOptions,
    description,
    replicateApiKey,
    useReplicate
  } = useDrawing();

  const handleSelect = async (drawing) => {
    setSelectedDrawing(drawing);
    await generateOutlineOptions(drawing.id);
    navigate("/create/outlines");
  };

  const handleBack = () => {
    navigate("/create");
  };

  // Check if we need to show the API key input
  const showApiKeyInput = !replicateApiKey && !useReplicate;

  return (
    <AnimatedTransition className="max-w-6xl mx-auto">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Button 
            variant="ghost" 
            onClick={handleBack}
            className="flex items-center gap-1"
          >
            <ChevronLeft size={16} />
            <span>Back</span>
          </Button>
          
          <div className="inline-block bg-king-100 text-king-800 rounded-full px-3 py-1 text-sm font-medium">
            Step 2
          </div>
        </div>

        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-display font-bold">Choose Your Drawing</h1>
          <p className="text-muted-foreground">
            Select the drawing you'd like to use for your coloring page.
          </p>
        </div>

        {showApiKeyInput && <ReplicateApiKeyInput />}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {drawingOptions.map((drawing) => (
            <div
              key={drawing.id}
              className={`border rounded-xl overflow-hidden cursor-pointer transition-all ${
                selectedDrawing?.id === drawing.id
                  ? "ring-2 ring-king-500 border-king-300"
                  : "hover:border-king-300 hover:shadow-md"
              }`}
              onClick={() => setSelectedDrawing(drawing)}
            >
              <div className="aspect-square bg-gray-50">
                <img
                  src={drawing.url}
                  alt={drawing.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-4 flex justify-between items-center">
                <p className="text-sm text-muted-foreground truncate">
                  {description ? `"${description}"` : "Generated drawing"}
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(drawing);
                  }}
                  icon={<ArrowRight size={16} />}
                >
                  Select
                </Button>
              </div>
            </div>
          ))}
        </div>

        {selectedDrawing && (
          <div className="flex justify-center mt-8">
            <Button
              variant="premium"
              size="lg"
              onClick={() => handleSelect(selectedDrawing)}
              icon={<ArrowRight size={18} />}
            >
              Continue with Selected Drawing
            </Button>
          </div>
        )}
      </div>
    </AnimatedTransition>
  );
};

export default GeneratedOptions;
