
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

type ThicknessOption = "thin" | "medium" | "thick";

interface OutlineThicknessSelectorProps {
  value: ThicknessOption;
  onChange: (value: ThicknessOption) => void;
}

const OutlineThicknessSelector: React.FC<OutlineThicknessSelectorProps> = ({
  value,
  onChange
}) => {
  return (
    <div className="space-y-3">
      <Label className="text-base flex items-center gap-2">
        <Pencil size={16} className="text-muted-foreground" />
        Outline Thickness
      </Label>
      <RadioGroup 
        value={value}
        onValueChange={(value: ThicknessOption) => onChange(value)}
        className="flex gap-3"
      >
        {[
          { value: "thin", label: "Thin" },
          { value: "medium", label: "Medium" },
          { value: "thick", label: "Thick" }
        ].map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem 
              value={option.value} 
              id={`thickness-${option.value}`}
              className="peer sr-only" 
            />
            <Label
              htmlFor={`thickness-${option.value}`}
              className={cn(
                "flex items-center justify-center rounded-lg border-2 border-muted p-3 min-w-[80px]",
                "hover:border-king-200 cursor-pointer transition-all",
                "peer-data-[state=checked]:border-king-500 peer-data-[state=checked]:bg-king-50"
              )}
            >
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default OutlineThicknessSelector;
