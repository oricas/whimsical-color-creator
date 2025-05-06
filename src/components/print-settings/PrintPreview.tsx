
import React, { useState } from "react";
import { ImageOff } from "lucide-react";

interface PrintPreviewProps {
  imageUrl: string;
  imageAlt: string;
}

const PrintPreview: React.FC<PrintPreviewProps> = ({ imageUrl, imageAlt }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(!!imageUrl);

  const handleImageLoad = () => {
    setIsLoading(false);
    setImageError(false);
  };
  
  const handleImageError = () => {
    setIsLoading(false);
    setImageError(true);
    console.error("Failed to load image:", imageUrl);
  };

  return (
    <div className="lg:col-span-2 bg-card rounded-xl border border-border/60 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-border/60">
        <h3 className="font-medium">Preview</h3>
      </div>
      <div className="aspect-square bg-gray-50 flex items-center justify-center relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="w-8 h-8 border-2 border-king-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {imageUrl && !imageError ? (
          <img 
            src={imageUrl} 
            alt={imageAlt}
            className="w-full h-full object-contain"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        ) : imageError ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground text-sm gap-3">
            <ImageOff className="h-10 w-10 text-muted-foreground/60" />
            <div>
              <p className="font-medium text-base">Image failed to load</p>
              <p className="text-muted-foreground/80 mt-1">The image could not be displayed</p>
            </div>
          </div>
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
