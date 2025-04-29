
import React from "react";
import { ExternalLink } from "lucide-react";

const FooterInfo: React.FC = () => {
  return (
    <div className="text-center text-xs text-muted-foreground mt-8 border-t pt-4">
      <p>This demo app uses Replicate API for generating coloring pages.</p>
      <p className="mt-1">
        <a 
          href="https://replicate.com/jagilley/controlnet-scribble" 
          target="_blank" 
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-king-600 hover:underline"
        >
          Learn more about the model we use <ExternalLink size={12} />
        </a>
      </p>
    </div>
  );
};

export default FooterInfo;
