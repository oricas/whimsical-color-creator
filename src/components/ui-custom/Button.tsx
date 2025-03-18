
import React from "react";
import { cn } from "@/lib/utils";
import { Button as ShadcnButton } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link" | "destructive" | "premium";
  size?: "default" | "sm" | "lg" | "icon" | "xl";
  children: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = "default",
  size = "default",
  children,
  isLoading = false,
  loadingText,
  icon,
  className,
  ...props
}) => {
  const buttonVariant = variant === "premium" ? "default" : variant;

  return (
    <ShadcnButton
      variant={buttonVariant}
      size={size}
      className={cn(
        "font-medium transition-all duration-300 relative overflow-hidden group",
        variant === "premium" && 
          "bg-gradient-to-r from-king-600 to-king-700 hover:from-king-700 hover:to-king-800 text-white shadow-lg hover:shadow-king-500/30",
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {variant === "premium" && (
        <span className="absolute inset-0 h-full w-full bg-gradient-to-r from-king-400/30 to-transparent 
          opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-300"></span>
      )}
      
      <span className="flex items-center justify-center gap-2">
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {!isLoading && icon && <span className="transition-transform group-hover:scale-110">{icon}</span>}
        <span>{isLoading && loadingText ? loadingText : children}</span>
      </span>
    </ShadcnButton>
  );
};

export default Button;
