
import React from "react";
import Button from "@/components/ui-custom/Button";
import { Printer, Eye, FileDown } from "lucide-react";
import { toast } from "sonner";
import { useDrawing } from "@/context/DrawingContext";

interface PrintActionButtonsProps {
  onPreview: () => void;
  isSubmitting: boolean;
}

const PrintActionButtons: React.FC<PrintActionButtonsProps> = ({
  onPreview,
  isSubmitting
}) => {
  const { selectedOutline } = useDrawing();

  const handleDownload = async () => {
    try {
      if (!selectedOutline?.url) {
        toast.error("No image available to download");
        return;
      }

      // Create a temporary link to download the image
      const link = document.createElement("a");
      link.href = selectedOutline.url;
      link.download = `coloring-page-${new Date().getTime()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Coloring page downloaded successfully!");
    } catch (error) {
      console.error("Download error:", error);
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
