
import React from "react";
import { useNavigate } from "react-router-dom";
import { useDrawing } from "@/context/DrawingContext";
import Button from "@/components/ui-custom/Button";
import Card, { CardContent } from "@/components/ui-custom/Card";
import { AnimatedTransition, FadeInStagger } from "./AnimatedTransition";
import { ArrowLeft, Check, ArrowRight, Settings } from "lucide-react";
import { toast } from "sonner";

const DrawingDetail: React.FC = () => {
  const navigate = useNavigate();
  const { 
    selectedDrawing, 
    outlineOptions, 
    selectedOutline, 
    setSelectedOutline 
  } = useDrawing();

  const handleBack = () => {
    navigate("/create/options");
  };

  const handleContinue = () => {
    if (!selectedOutline) {
      toast.error("Please select an outline first");
      return;
    }
    
    navigate("/print");
  };

  if (!selectedDrawing || outlineOptions.length === 0) {
    navigate("/create");
    return null;
  }

  return (
    <AnimatedTransition className="max-w-5xl mx-auto">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <div className="inline-block bg-king-100 text-king-800 rounded-full px-3 py-1 text-sm font-medium mb-2">
            Step 3
          </div>
          <h1 className="text-3xl font-display font-bold">Choose Your Outline Style</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Select the outline style you prefer for your coloring page
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-card rounded-xl border border-border/60 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border/60">
              <h3 className="font-medium">Selected Drawing</h3>
            </div>
            <div className="aspect-square">
              <img 
                src={selectedDrawing.url} 
                alt={selectedDrawing.alt}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="bg-card rounded-xl border border-border/60 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border/60">
              <h3 className="font-medium">Preview</h3>
            </div>
            <div className="aspect-square bg-gray-50 flex items-center justify-center">
              {selectedOutline ? (
                <img 
                  src={selectedOutline.url} 
                  alt={selectedOutline.alt}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-muted-foreground text-sm p-8 text-center">
                  Select an outline style to see the preview
                </div>
              )}
            </div>
          </div>
        </div>

        <h3 className="text-xl font-display font-medium mb-4">Outline Style Options</h3>
        
        <FadeInStagger className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {outlineOptions.map((outline) => (
            <Card 
              key={outline.id} 
              interactive
              className={`overflow-hidden border-2 ${
                selectedOutline?.id === outline.id
                  ? "border-king-500 ring-2 ring-king-300"
                  : "border-transparent"
              }`}
              onClick={() => setSelectedOutline(outline)}
            >
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={outline.url}
                  alt={outline.alt}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                
                {selectedOutline?.id === outline.id && (
                  <div className="absolute top-2 right-2 bg-king-500 text-white p-1 rounded-full">
                    <Check size={16} />
                  </div>
                )}
              </div>
              
              <CardContent className="py-3">
                <span className="text-sm font-medium">Style {outline.id}</span>
              </CardContent>
            </Card>
          ))}
        </FadeInStagger>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
          <Button variant="ghost" onClick={handleBack} icon={<ArrowLeft size={16} />}>
            Back to Options
          </Button>
          
          <Button
            variant="premium"
            onClick={handleContinue}
            disabled={!selectedOutline}
            icon={<Settings size={16} />}
          >
            Continue to Print Settings
          </Button>
        </div>
      </div>
    </AnimatedTransition>
  );
};

export default DrawingDetail;
