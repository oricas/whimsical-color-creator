
import React, { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AnimatedTransitionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const AnimatedTransition: React.FC<AnimatedTransitionProps> = ({
  children,
  className = "",
  delay = 0,
}) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          transition: {
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
            delay: delay * 0.1,
          }
        }}
        exit={{ 
          opacity: 0, 
          y: -20,
          transition: {
            duration: 0.3,
            ease: [0.22, 1, 0.36, 1],
          }
        }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export const FadeInStagger: React.FC<{ 
  children: ReactNode; 
  className?: string;
  staggerDelay?: number;
}> = ({ 
  children, 
  className = "",
  staggerDelay = 0.1
}) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {React.Children.map(children, (child, i) => (
        <motion.div
          key={i}
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { 
              opacity: 1, 
              y: 0,
              transition: {
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }
            },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

export const PageTransition: React.FC<{
  children: ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: 1,
        transition: { 
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
        }
      }}
      exit={{ 
        opacity: 0,
        transition: { 
          duration: 0.3,
          ease: [0.22, 1, 0.36, 1],
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedTransition;
