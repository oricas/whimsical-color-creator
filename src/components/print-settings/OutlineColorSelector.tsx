
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Palette } from "lucide-react";
import { cn } from "@/lib/utils";

type ColorOption = "black" | "gray" | "blue";

interface OutlineColorSelectorProps {
  value: ColorOption;
  onChange: (value: ColorOption) => void;
}

const OutlineColorSelector: React.FC<OutlineColorSelectorProps> = ({
  value,
  onChange
}) => {
  return (
    <div className="space-y-3">
      <Label className="text-base flex items-center gap-2">
        <Palette size={16} className="text-muted-foreground" />
        Outline Color
      </Label>
      <RadioGroup 
        value={value}
        onValueChange={(value: ColorOption) => onChange(value)}
        className="flex gap-3"
      >
        {[
          { value: "black", label: "Black", color: "bg-black" },
          { value: "gray", label: "Gray", color: "bg-gray-500" },
          { value: "blue", label: "Blue", color: "bg-blue-600" }
        ].map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem 
              value={option.value} 
              id={`color-${option.value}`}
              className="peer sr-only" 
            />
            <Label
              htmlFor={`color-${option.value}`}
              className={cn(
                "flex items-center justify-center gap-2 rounded-lg border-2 border-muted p-3 min-w-[80px]",
                "hover:border-king-200 cursor-pointer transition-all",
                "peer-data-[state=checked]:border-king-500 peer-data-[state=checked]:bg-king-50"
              )}
            >
              <div className={`w-4 h-4 rounded-full ${option.color}`} />
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default OutlineColorSelector;
