import React from "react";
import { motion } from "framer-motion";

interface LoadingOverlayProps {
  isVisible: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-2xl"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="text-4xl mb-4"
      >
        🔄
      </motion.div>
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="text-lg font-bold mb-3 text-black"
      >
        Processing Registration...
      </motion.div>
      <motion.div
        className="w-48 h-1 rounded-full overflow-hidden"
        style={{ backgroundColor: "var(--color-primary)", opacity: 0.2 }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="h-full rounded-full"
          style={{ backgroundColor: "var(--color-secondary)" }}
        />
      </motion.div>
    </motion.div>
  );
};