
import React from "react";
import { useNavigate } from "react-router-dom";
import { useDrawing } from "@/context/DrawingContext";
import Button from "@/components/ui-custom/Button";
import Card, { CardContent } from "@/components/ui-custom/Card";
import { AnimatedTransition, FadeInStagger } from "./AnimatedTransition";
import { ArrowLeft, Check, PencilLine, MousePointer } from "lucide-react";
import { toast } from "sonner";

const GeneratedOptions: React.FC = () => {
  const navigate = useNavigate();
  const { 
    description, 
    drawingOptions, 
    selectedDrawing, 
    setSelectedDrawing, 
    generateOutlineOptions 
  } = useDrawing();

  const handleSelect = async (drawing: typeof drawingOptions[0]) => {
    setSelectedDrawing(drawing);
    toast.success("Drawing selected!");
    
    try {
      await generateOutlineOptions(drawing.id);
      navigate("/create/outlines");
    } catch (error) {
      toast.error("Failed to generate outlines. Please try again.");
    }
  };

  const handleBack = () => {
    navigate("/create");
  };

  if (drawingOptions.length === 0) {
    navigate("/create");
    return null;
  }

  return (
    <AnimatedTransition className="max-w-5xl mx-auto">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <div className="inline-block bg-king-100 text-king-800 rounded-full px-3 py-1 text-sm font-medium mb-2">
            Step 2
          </div>
          <h1 className="text-3xl font-display font-bold">Choose Your Drawing</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Select one of the generated drawings that best matches your description: 
            <span className="text-foreground italic"> "{description}"</span>
          </p>
        </div>

        <FadeInStagger className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {drawingOptions.map((drawing) => (
            <Card 
              key={drawing.id} 
              interactive
              className={`overflow-hidden border-2 ${
                selectedDrawing?.id === drawing.id
                  ? "border-king-500 ring-2 ring-king-300"
                  : "border-transparent"
              }`}
              onClick={() => setSelectedDrawing(drawing)}
            >
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={drawing.url}
                  alt={drawing.alt}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                
                {selectedDrawing?.id === drawing.id && (
                  <div className="absolute top-2 right-2 bg-king-500 text-white p-1 rounded-full">
                    <Check size={16} />
                  </div>
                )}
              </div>
              
              <CardContent className="py-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Option {drawing.id}</span>
                  {selectedDrawing?.id === drawing.id ? (
                    <Button 
                      size="sm" 
                      variant="premium"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(drawing);
                      }}
                    >
                      Select
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(drawing);
                      }}
                    >
                      Use This
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </FadeInStagger>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
          <Button variant="ghost" onClick={handleBack} icon={<ArrowLeft size={16} />}>
            Back to Description
          </Button>
          
          <div className="glass rounded-md py-1 px-3 text-sm text-muted-foreground flex items-center gap-2">
            <MousePointer size={14} />
            <span>Click on an image to select it</span>
          </div>
        </div>
      </div>
    </AnimatedTransition>
  );
};

export default GeneratedOptions;
