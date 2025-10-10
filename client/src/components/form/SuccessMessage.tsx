import React from "react";
import { motion } from "framer-motion";

interface SuccessMessageProps {
  isVisible: boolean;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", duration: 0.6 }}
      className="relative z-10 mt-6 text-base font-bold rounded-2xl p-6 shadow-xl border-2 relative overflow-hidden backdrop-blur-sm"
      style={{
        color: "var(--color-secondary)",
        backgroundColor: "var(--color-primary)",
        opacity: 0.95,
        borderColor: "var(--color-primary)",
      }}
    >
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{ backgroundColor: "var(--color-secondary)", opacity: 0.1 }}
      />
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: "spring" }}
        className="absolute -top-3 -right-3 w-12 h-12 rounded-full flex items-center justify-center text-xl"
        style={{ backgroundColor: "var(--color-secondary)" }}
      >
        🎉
      </motion.div>
      <div className="relative flex items-center gap-3">
        <motion.span 
          className="text-3xl animate-bounce"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ✅
        </motion.span>
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-black"
          >
            Registration Successful!
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xs opacity-80 mt-1"
          >
            🚀 Your application has been submitted for review. We'll contact you soon!
          </motion.div>
        </div>
      </div>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ delay: 0.6, duration: 2 }}
        className="absolute bottom-0 left-0 h-1 rounded-full"
        style={{ backgroundColor: "var(--color-secondary)" }}
      />
    </motion.div>
  );
};