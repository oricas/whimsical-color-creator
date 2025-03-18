
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";

type SizeOption = "A4" | "A3";

interface PageSizeSelectorProps {
  value: SizeOption;
  onChange: (value: SizeOption) => void;
}

const PageSizeSelector: React.FC<PageSizeSelectorProps> = ({
  value,
  onChange
}) => {
  return (
    <div className="space-y-3">
      <Label className="text-base flex items-center gap-2">
        <FileText size={16} className="text-muted-foreground" />
        Page Size
      </Label>
      <RadioGroup 
        value={value}
        onValueChange={(value: SizeOption) => onChange(value)}
        className="flex gap-3"
      >
        {[
          { value: "A4", label: "A4" },
          { value: "A3", label: "A3" }
        ].map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem 
              value={option.value} 
              id={`size-${option.value}`}
              className="peer sr-only" 
            />
            <Label
              htmlFor={`size-${option.value}`}
              className={cn(
                "flex items-center justify-center rounded-lg border-2 border-muted p-3 min-w-[60px]",
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

export default PageSizeSelector;
