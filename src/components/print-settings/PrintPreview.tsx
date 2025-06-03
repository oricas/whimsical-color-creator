
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
      <div className="aspect-square bg-gray-50">
        <img 
          src={imageUrl} 
          alt={imageAlt}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default PrintPreview;
