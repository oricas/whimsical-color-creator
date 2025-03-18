
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDrawing } from "@/context/DrawingContext";
import Button from "@/components/ui-custom/Button";
import { AnimatedTransition } from "./AnimatedTransition";
import { ArrowLeft, Download, Share2 } from "lucide-react";
import { toast } from "sonner";

const MOCK_COLORED_IMAGE = "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?q=80&w=1000";

const ColoredPreview: React.FC = () => {
  const navigate = useNavigate();
  const { selectedOutline } = useDrawing();
  const [isLoading, setIsLoading] = useState(true);
  const [coloredImage, setColoredImage] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading colored preview
    const timer = setTimeout(() => {
      setColoredImage(MOCK_COLORED_IMAGE);
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleBack = () => {
    navigate("/print");
  };

  const handleDownload = () => {
    toast.success("Preview image downloaded successfully!");
  };

  const handleShare = () => {
    toast.success("Sharing link copied to clipboard!");
  };

  if (!selectedOutline) {
    navigate("/create");
    return null;
  }

  return (
    <AnimatedTransition className="max-w-5xl mx-auto">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <div className="inline-block bg-king-100 text-king-800 rounded-full px-3 py-1 text-sm font-medium mb-2">
            Preview
          </div>
          <h1 className="text-3xl font-display font-bold">Colored Result</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            This is how your coloring page could look when colored in
          </p>
        </div>
        
        <div className="bg-card rounded-xl border border-border/60 shadow-lg overflow-hidden">
          <div className="aspect-square md:aspect-[16/9] w-full relative">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/10">
                <div className="w-16 h-16 rounded-full border-4 border-king-200 border-t-king-600 animate-spin"></div>
              </div>
            ) : (
              <img
                src={coloredImage || ""}
                alt="Colored preview"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          
          <div className="p-6 flex flex-col sm:flex-row justify-between gap-4 items-center">
            <p className="text-muted-foreground text-sm">
              This is an AI-generated colored version of your outline
            </p>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleShare}
                icon={<Share2 size={16} />}
              >
                Share
              </Button>
              <Button
                variant="premium"
                onClick={handleDownload}
                icon={<Download size={16} />}
              >
                Download
              </Button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass p-6 rounded-xl">
            <h3 className="text-lg font-medium mb-3">About This Preview</h3>
            <p className="text-sm text-muted-foreground">
              This colored preview gives you an idea of how your coloring page might look
              when completed. The actual result will depend on the colors and techniques used.
              Enjoy bringing your own creativity to your printed page!
            </p>
          </div>
          
          <div className="glass p-6 rounded-xl">
            <h3 className="text-lg font-medium mb-3">Coloring Tips</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Use colored pencils for more control and blending</li>
              <li>• Try markers for bold, vibrant colors</li>
              <li>• Use light colors first, then add darker colors for shading</li>
              <li>• Don't be afraid to mix different coloring tools</li>
            </ul>
          </div>
        </div>
        
        <div className="pt-4">
          <Button variant="ghost" onClick={handleBack} icon={<ArrowLeft size={16} />}>
            Back to Print Settings
          </Button>
        </div>
      </div>
    </AnimatedTransition>
  );
};

export default ColoredPreview;
