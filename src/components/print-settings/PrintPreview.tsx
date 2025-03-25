
import React from "react";

interface PrintPreviewProps {
  imageUrl: string;
  imageAlt: string;
}

const PrintPreview: React.FC<PrintPreviewProps> = ({ imageUrl, imageAlt }) => {
  return (
    <div className="lg:col-span-2 bg-card rounded-xl border border-border/60 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-border/60">
        <h3 className="font-medium">Preview</h3>
      </div>
      <div className="aspect-square bg-gray-50 flex items-center justify-center">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={imageAlt}
            className="w-full h-full object-contain"
            onError={(e) => {
              // Handle image load errors by showing a fallback
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = "/placeholder.svg";
            }}
          />
        ) : (
          <div className="p-8 text-center text-muted-foreground text-sm">
            No image selected
          </div>
        )}
      </div>
    </div>
  );
};

export default PrintPreview;
