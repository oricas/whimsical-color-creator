
import React from "react";
import { Label } from "@/components/ui/label";
import { Copy, MinusCircle, PlusCircle } from "lucide-react";
import Button from "@/components/ui-custom/Button";
import { Input } from "@/components/ui-custom/Input";

interface CopiesCounterProps {
  value: number;
  onChange: (value: number) => void;
}

const CopiesCounter: React.FC<CopiesCounterProps> = ({
  value,
  onChange
}) => {
  const updateCopies = (amount: number) => {
    const newValue = Math.max(1, Math.min(10, value + amount));
    onChange(newValue);
  };

  return (
    <div className="space-y-3">
      <Label className="text-base flex items-center gap-2">
        <Copy size={16} className="text-muted-foreground" />
        Number of Copies
      </Label>
      <div className="flex items-center">
        <Button
          variant="outline"
          size="icon"
          onClick={() => updateCopies(-1)}
          disabled={value <= 1}
          className="rounded-r-none h-10 w-10"
        >
          <MinusCircle size={16} />
        </Button>
        <Input
          type="number"
          value={value}
          onChange={(e) => {
            const newValue = parseInt(e.target.value);
            if (!isNaN(newValue) && newValue >= 1 && newValue <= 10) {
              onChange(newValue);
            }
          }}
          min={1}
          max={10}
          className="w-16 rounded-none h-10 text-center"
        />
        <Button
          variant="outline"
          size="icon"
          onClick={() => updateCopies(1)}
          disabled={value >= 10}
          className="rounded-l-none h-10 w-10"
        >
          <PlusCircle size={16} />
        </Button>
      </div>
    </div>
  );
};

export default CopiesCounter;
