import React from "react";
import { motion } from "framer-motion";
import type { SuccessToastProps } from "./types";
import { borderPrimary } from "../form-registration";

const SuccessToast: React.FC<SuccessToastProps> = ({ submitted, errors, loading }) => {
  if (!submitted || Object.keys(errors).length > 0 || loading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 rounded-xl border px-4 py-3 text-sm font-semibold"
      style={{ 
        background: "rgba(0,0,0,0.02)", 
        ...borderPrimary, 
        color: "var(--color-secondary)" 
      }}
    >
      Registration successful — we will contact you soon.
    </motion.div>
  );
};

export default SuccessToast;