
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Input as ShadcnInput } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string;
  icon?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  description,
  error,
  icon,
  clearable = false,
  onClear,
  className,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label htmlFor={props.id} className="text-sm font-medium">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        
        <ShadcnInput
          {...props}
          className={cn(
            "transition-all duration-200",
            icon && "pl-10",
            clearable && props.value && "pr-10",
            isFocused && "ring-2 ring-king-100 border-king-300",
            error && "border-destructive focus-visible:ring-destructive/20"
          )}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus && props.onFocus(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur && props.onBlur(e);
          }}
        />
        
        {clearable && props.value && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted transition-colors"
            aria-label="Clear input"
          >
            <X size={14} />
          </button>
        )}
      </div>
      
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : description ? (
        <p className="text-xs text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
};

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  description?: string;
  error?: string;
  className?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  description,
  error,
  className,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label htmlFor={props.id} className="text-sm font-medium">
          {label}
        </label>
      )}
      
      <Textarea
        {...props}
        className={cn(
          "transition-all duration-200 resize-none",
          isFocused && "ring-2 ring-king-100 border-king-300",
          error && "border-destructive focus-visible:ring-destructive/20"
        )}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus && props.onFocus(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur && props.onBlur(e);
        }}
      />
      
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : description ? (
        <p className="text-xs text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
};

export default Input;
