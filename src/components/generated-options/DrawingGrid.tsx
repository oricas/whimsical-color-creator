
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ImageOff, Download } from "lucide-react";
import { useDrawing } from "@/context/DrawingContext";
import Button from "../ui-custom/Button";
import { toast } from "sonner";

interface DrawingGridProps {
  setSelectedDrawing: (drawing: any) => void;
  description: string;
}

const DrawingGrid: React.FC<DrawingGridProps> = ({ setSelectedDrawing, description }) => {
  const navigate = useNavigate();
  const { drawingOptions, selectedDrawing, generateOutlineOptions } = useDrawing();
  const [imageLoadStates, setImageLoadStates] = useState<Record<string, {loaded: boolean, error: boolean}>>({});

  // Track initial load attempts to prevent endless retry loops
  const [loadAttempts, setLoadAttempts] = useState<Record<string, number>>({});

  // Use these more reliable image URLs for demo mode when needed
  const fallbackImages = [
    "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=600&auto=format",
    "https://images.unsplash.com/photo-1624526267942-ab0c0e53d1c1?w=600&auto=format",
    "https://images.unsplash.com/photo-1581344947731-c678889a686e?w=600&auto=format",
    "https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=600&auto=format"
  ];

  // Pre-load images when component mounts or drawingOptions change
  useEffect(() => {
    // Reset load states when drawing options change
    const newLoadStates = {};
    const newAttempts = {};
    
    drawingOptions.forEach((drawing, index) => {
      // Initialize load state for this drawing
      newLoadStates[drawing.id] = { loaded: false, error: false };
      newAttempts[drawing.id] = 0;
      
      // Start loading the image
      const img = new Image();
      img.src = drawing.url;
      
      // Set up event handlers
      img.onload = () => handleImageLoad(drawing.id);
      img.onerror = () => {
        // Try with fallback image if this is the first attempt
        if (newAttempts[drawing.id] === 0) {
          const fallbackImg = new Image();
          fallbackImg.src = fallbackImages[index % fallbackImages.length];
          fallbackImg.onload = () => {
            // Update the drawing URL to use the fallback image that loaded successfully
            drawing.url = fallbackImages[index % fallbackImages.length];
            handleImageLoad(drawing.id);
          };
          fallbackImg.onerror = () => handleImageError(drawing.id);
        } else {
          handleImageError(drawing.id);
        }
        
        // Increment attempt counter
        newAttempts[drawing.id] = (newAttempts[drawing.id] || 0) + 1;
      };
    });
    
    setImageLoadStates(newLoadStates);
    setLoadAttempts(newAttempts);
  }, [drawingOptions]);

  const handleSelect = async (drawing) => {
    toast.info("Preparing outlines...");
    setSelectedDrawing(drawing);
    await generateOutlineOptions(drawing.id);
    navigate("/create/outlines");
  };

  const handleImageLoad = (drawingId: string) => {
    console.log("Image loaded successfully for drawing", drawingId);
    setImageLoadStates(prev => ({
      ...prev,
      [drawingId]: { loaded: true, error: false }
    }));
  };

  const handleImageError = (drawingId: string) => {
    console.error(`Failed to load image for drawing ${drawingId}`);
    setImageLoadStates(prev => ({
      ...prev,
      [drawingId]: { loaded: true, error: true }
    }));
  };

  const handleDownloadImage = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    const link = document.createElement("a");
    link.href = url;
    link.download = `drawing-${new Date().getTime()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Image downloaded successfully!");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {drawingOptions.map((drawing, index) => (
        <div
          key={drawing.id}
          className={`border rounded-xl overflow-hidden cursor-pointer transition-all ${
            selectedDrawing?.id === drawing.id
              ? "ring-2 ring-king-500 border-king-300"
              : "hover:border-king-300 hover:shadow-md"
          }`}
          onClick={() => setSelectedDrawing(drawing)}
        >
          <div className="aspect-square bg-gray-50 relative">
            {(!imageLoadStates[drawing.id] || !imageLoadStates[drawing.id]?.loaded) && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                <div className="w-8 h-8 border-2 border-king-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            
            {imageLoadStates[drawing.id]?.error ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center text-muted-foreground text-sm gap-3">
                <ImageOff className="h-10 w-10 text-muted-foreground/60" />
                <div>
                  <p className="font-medium text-base">Image failed to load</p>
                  <p className="text-muted-foreground/80 mt-1">Using fallback image</p>
                </div>
                <img 
                  src={fallbackImages[index % fallbackImages.length]}
                  alt={`Fallback for ${drawing.alt}`}
                  className="w-full h-full object-cover mt-4"
                  onLoad={() => handleImageLoad(drawing.id)}
                />
              </div>
            ) : (
              <img
                src={drawing.url}
                alt={drawing.alt}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  imageLoadStates[drawing.id]?.loaded ? "opacity-100" : "opacity-0"
                }`}
                loading="lazy"
                onLoad={() => handleImageLoad(drawing.id)}
                onError={() => handleImageError(drawing.id)}
              />
            )}
            
            {imageLoadStates[drawing.id]?.loaded && (
              <Button 
                variant="outline" 
                size="sm"
                className="absolute top-2 right-2 bg-white/70 hover:bg-white"
                onClick={(e) => handleDownloadImage(e, imageLoadStates[drawing.id]?.error ? 
                  fallbackImages[index % fallbackImages.length] : drawing.url)}
                icon={<Download size={16} />}
              >
                Save
              </Button>
            )}
          </div>
          <div className="p-4 flex justify-between items-center">
            <p className="text-sm text-muted-foreground truncate">
              {description ? `"${description}"` : "Generated drawing"}
            </p>
            <Button
              variant="outline"
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
  );
};

export default DrawingGrid;
