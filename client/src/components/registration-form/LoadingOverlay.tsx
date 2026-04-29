import React from "react";
import { motion } from "framer-motion";
import type { LoadingOverlayProps } from "./types";

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ loading }) => {
  if (!loading) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-50 rounded-2xl bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center"
    >
      <div 
        className="w-8 h-8 rounded-full border-2 border-current border-t-transparent animate-spin" 
        style={{ color: "var(--color-secondary)" }} 
      />
      <div className="mt-3 text-sm font-semibold text-black">Processing…</div>
    </motion.div>
  );
};

export default LoadingOverlay;