
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  glassEffect?: boolean;
  hoverEffect?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  interactive = false,
  glassEffect = false,
  hoverEffect = true,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className={cn(
        "rounded-xl overflow-hidden",
        glassEffect ? "glass" : "bg-card border border-border/60",
        interactive && "cursor-pointer",
        hoverEffect && "transition-all duration-300 hover:shadow-lg",
        isHovered && interactive && "shadow-xl shadow-king-100 scale-[1.02] border-king-200",
        className
      )}
      onClick={interactive ? onClick : undefined}
      onMouseEnter={() => interactive && setIsHovered(true)}
      onMouseLeave={() => interactive && setIsHovered(false)}
      whileHover={interactive ? { scale: 1.02 } : {}}
      whileTap={interactive ? { scale: 0.98 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.div>
  );
};

export const CardHeader: React.FC<{ 
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div className={cn("p-6 pb-2", className)}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<{ 
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <h3 className={cn("text-xl font-display font-semibold", className)}>
      {children}
    </h3>
  );
};

export const CardDescription: React.FC<{ 
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <p className={cn("text-muted-foreground text-sm", className)}>
      {children}
    </p>
  );
};

export const CardContent: React.FC<{ 
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div className={cn("p-6 pt-2", className)}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<{ 
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div className={cn("p-6 pt-0 flex items-center", className)}>
      {children}
    </div>
  );
};

export default Card;
