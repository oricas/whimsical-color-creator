
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDrawing } from "@/context/DrawingContext";
import Button from "@/components/ui-custom/Button";
import { AnimatedTransition } from "./AnimatedTransition";
import { ArrowLeft } from "lucide-react";
import PrintPreview from "./print-settings/PrintPreview";
import PrintSettingsForm from "./print-settings/PrintSettingsForm";
import PrintActionButtons from "./print-settings/PrintActionButtons";

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

  const handlePreview = () => {
    navigate("/preview");
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
          <PrintPreview 
            imageUrl={selectedOutline.url} 
            imageAlt={selectedOutline.alt} 
          />
          
          <div className="lg:col-span-3 space-y-6">
            <PrintSettingsForm 
              settings={printSettings}
              onUpdateSettings={setPrintSettings}
            />
            
            <PrintActionButtons 
              onPreview={handlePreview}
              isSubmitting={isSubmitting}
            />
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
