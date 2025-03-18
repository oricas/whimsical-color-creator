
import React from "react";
import Button from "@/components/ui-custom/Button";
import { Printer, Eye, FileDown } from "lucide-react";
import { toast } from "sonner";

interface PrintActionButtonsProps {
  onPreview: () => void;
  isSubmitting: boolean;
}

const PrintActionButtons: React.FC<PrintActionButtonsProps> = ({
  onPreview,
  isSubmitting
}) => {
  const handleDownload = async () => {
    try {
      // In a real app, this would download the actual image
      toast.success("Coloring page downloaded successfully!");
    } catch (error) {
      toast.error("Download failed. Please try again.");
    }
  };

  const handlePrint = async () => {
    try {
      // Simulate printing process
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("Your coloring page has been sent to the printer!");
    } catch (error) {
      toast.error("Failed to print. Please try again.");
    }
  };

  return (
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
        onClick={onPreview}
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
  );
};

export default PrintActionButtons;
