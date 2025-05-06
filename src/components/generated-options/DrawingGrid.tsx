
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ImageOff } from "lucide-react";
import { useDrawing } from "@/context/DrawingContext";
import Button from "../ui-custom/Button";

interface DrawingGridProps {
  setSelectedDrawing: (drawing: any) => void;
  description: string;
}

const DrawingGrid: React.FC<DrawingGridProps> = ({ setSelectedDrawing, description }) => {
  const navigate = useNavigate();
  const { drawingOptions, selectedDrawing, generateOutlineOptions } = useDrawing();
  const [imageLoadStates, setImageLoadStates] = useState<Record<string, {loaded: boolean, error: boolean}>>({});

  const handleSelect = async (drawing) => {
    setSelectedDrawing(drawing);
    await generateOutlineOptions(drawing.id);
    navigate("/create/outlines");
  };

  const handleImageLoad = (drawingId: string) => {
    setImageLoadStates(prev => ({
      ...prev,
      [drawingId]: { loaded: true, error: false }
    }));
  };

  const handleImageError = (drawingId: string) => {
    setImageLoadStates(prev => ({
      ...prev,
      [drawingId]: { loaded: true, error: true }
    }));
    console.error(`Failed to load image for drawing ${drawingId}`);
  };

  return (
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
          <div className="aspect-square bg-gray-50 relative">
            {!imageLoadStates[drawing.id]?.loaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                <div className="w-8 h-8 border-2 border-king-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            
            {imageLoadStates[drawing.id]?.error ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center text-muted-foreground text-sm gap-3">
                <ImageOff className="h-10 w-10 text-muted-foreground/60" />
                <p>Image failed to load</p>
              </div>
            ) : (
              <img
                src={drawing.url}
                alt={drawing.alt}
                className={`w-full h-full object-cover ${imageLoadStates[drawing.id]?.loaded ? "opacity-100" : "opacity-0"}`}
                loading="lazy"
                onLoad={() => handleImageLoad(drawing.id)}
                onError={() => handleImageError(drawing.id)}
              />
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
