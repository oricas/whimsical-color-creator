
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useDrawing } from "@/context/DrawingContext";
import Button from "../ui-custom/Button";

interface DrawingGridProps {
  setSelectedDrawing: (drawing: any) => void;
  description: string;
}

const DrawingGrid: React.FC<DrawingGridProps> = ({ setSelectedDrawing, description }) => {
  const navigate = useNavigate();
  const { drawingOptions, selectedDrawing, generateOutlineOptions } = useDrawing();

  const handleSelect = async (drawing) => {
    setSelectedDrawing(drawing);
    await generateOutlineOptions(drawing.id);
    navigate("/create/outlines");
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
