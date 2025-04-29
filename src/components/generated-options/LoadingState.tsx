
import React from "react";

const LoadingState: React.FC = () => {
  return (
    <div className="p-8 text-center border border-dashed rounded-lg bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-muted-foreground">Generating drawings... This may take a moment.</p>
      </div>
    </div>
  );
};

export default LoadingState;
