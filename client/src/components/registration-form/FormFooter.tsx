import React from "react";
import { motion } from "framer-motion";
import type { FormFooterProps } from "./types";
import { borderPrimary, helpMuted } from "../form-registration";

const FormFooter: React.FC<FormFooterProps> = ({ userType, loading, isFormMinimallyValid }) => {
  return (
    <div className="mt-10 pt-6 border-t flex items-center justify-between" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
      <div className="text-xs" style={helpMuted}>
        Fields with * are required
      </div>
      {userType === "ownerHome" && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading || !isFormMinimallyValid}
          className="px-6 py-3 rounded-xl border font-bold shadow-sm transition-all duration-200"
          style={{
            background: loading || !isFormMinimallyValid ? "#ccc" : "var(--color-secondary)",
            color: loading || !isFormMinimallyValid ? "#666" : "var(--color-primary)",
            ...borderPrimary,
            opacity: loading || !isFormMinimallyValid ? 0.6 : 1,
            cursor: loading || !isFormMinimallyValid ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Creating…" : "Create Account"}
        </motion.button>
      )}
    </div>
  );
};

export default FormFooter;