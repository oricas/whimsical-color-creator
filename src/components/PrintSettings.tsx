import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDrawing } from "@/context/DrawingContext";
import Button from "@/components/ui-custom/Button";
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui-custom/Card";
import { AnimatedTransition } from "./AnimatedTransition";
import { 
  ArrowLeft, 
  FileDown, 
  Printer, 
  Eye,
  FileText, 
  Pencil, 
  Palette, 
  Copy, 
  MinusCircle, 
  PlusCircle,
  CheckCircle
} from "lucide-react";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui-custom/Input";

type ColorOption = "black" | "gray" | "blue";
type ThicknessOption = "thin" | "medium" | "thick";
type SizeOption = "A4" | "A3";

const PrintSettings: React.FC = () => {
  const navigate = useNavigate();
  const { 
    selectedOutline, 
    printSettings, 
    setPrintSettings 
  } = useDrawing();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBack = () => {
    navigate("/create/outlines");
  };

  const handlePrint = async () => {
    setIsSubmitting(true);
    
    try {
      // Simulate printing process
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("Your coloring page has been sent to the printer!");
    } catch (error) {
      toast.error("Failed to print. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreview = () => {
    navigate("/preview");
  };

  const handleDownload = async () => {
    try {
      // In a real app, this would download the actual image
      toast.success("Coloring page downloaded successfully!");
    } catch (error) {
      toast.error("Download failed. Please try again.");
    }
  };

  const updateCopies = (amount: number) => {
    const newValue = Math.max(1, Math.min(10, printSettings.copies + amount));
    setPrintSettings({ ...printSettings, copies: newValue });
  };

  if (!selectedOutline) {
    navigate("/create");
    return null;
  }

  return (
    <AnimatedTransition className="max-w-4xl mx-auto">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <div className="inline-block bg-king-100 text-king-800 rounded-full px-3 py-1 text-sm font-medium mb-2">
            Step 4
          </div>
          <h1 className="text-3xl font-display font-bold">Print Settings</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Customize how your coloring page will be printed
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 bg-card rounded-xl border border-border/60 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border/60">
              <h3 className="font-medium">Preview</h3>
            </div>
            <div className="aspect-square bg-gray-50">
              <img 
                src={selectedOutline.url} 
                alt={selectedOutline.alt}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="lg:col-span-3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Page Settings</CardTitle>
                <CardDescription>
                  Customize the appearance of your coloring page
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Page Size */}
                <div className="space-y-3">
                  <Label className="text-base flex items-center gap-2">
                    <FileText size={16} className="text-muted-foreground" />
                    Page Size
                  </Label>
                  <RadioGroup 
                    value={printSettings.pageSize}
                    onValueChange={(value: SizeOption) => 
                      setPrintSettings({...printSettings, pageSize: value})
                    }
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
                
                {/* Outline Thickness */}
                <div className="space-y-3">
                  <Label className="text-base flex items-center gap-2">
                    <Pencil size={16} className="text-muted-foreground" />
                    Outline Thickness
                  </Label>
                  <RadioGroup 
                    value={printSettings.outlineThickness}
                    onValueChange={(value: ThicknessOption) => 
                      setPrintSettings({...printSettings, outlineThickness: value})
                    }
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
                
                {/* Outline Color */}
                <div className="space-y-3">
                  <Label className="text-base flex items-center gap-2">
                    <Palette size={16} className="text-muted-foreground" />
                    Outline Color
                  </Label>
                  <RadioGroup 
                    value={printSettings.outlineColor}
                    onValueChange={(value: ColorOption) => 
                      setPrintSettings({...printSettings, outlineColor: value})
                    }
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
                
                {/* Number of Copies */}
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
                      disabled={printSettings.copies <= 1}
                      className="rounded-r-none h-10 w-10"
                    >
                      <MinusCircle size={16} />
                    </Button>
                    <Input
                      type="number"
                      value={printSettings.copies}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value) && value >= 1 && value <= 10) {
                          setPrintSettings({...printSettings, copies: value});
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
                      disabled={printSettings.copies >= 10}
                      className="rounded-l-none h-10 w-10"
                    >
                      <PlusCircle size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <Button
                variant="outline"
                onClick={handleDownload}
                icon={<FileDown size={16} />}
              >
                Download
              </Button>
              
              <Button
                variant="outline"
                onClick={handlePreview}
                icon={<Eye size={16} />}
              >
                See Result
              </Button>
              
              <Button
                variant="premium"
                onClick={handlePrint}
                isLoading={isSubmitting}
                loadingText="Printing..."
                icon={<Printer size={16} />}
              >
                Print Now
              </Button>
            </div>
          </div>
        </div>
        
        <div className="pt-4">
          <Button variant="ghost" onClick={handleBack} icon={<ArrowLeft size={16} />}>
            Back to Outline Selection
          </Button>
        </div>
      </div>
    </AnimatedTransition>
  );
};

export default PrintSettings;
