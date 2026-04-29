import React from "react";
import { motion } from "framer-motion";
import type { FormFooterProps } from "./types";
type ExtendedFormFooterProps = FormFooterProps & { onGoBack: () => void; children?: React.ReactNode };
import { ArrowLeft } from "lucide-react";
import { borderPrimary, helpMuted } from "../form-registration";

const FormFooter: React.FC<ExtendedFormFooterProps> = ({ userType, loading, isFormMinimallyValid, onGoBack, children }) => {
  return (
    <div className="mt-10 pt-6 border-t" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
      <div className="flex items-center justify-between"> 
        <div className="text-xs" style={helpMuted}>
          Fields with * are required
        </div>
        <div className="flex gap-3">
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
          <motion.button
            type="button"
            onClick={onGoBack}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 px-4 py-3 rounded-xl border font-medium transition-all duration-200 flex items-center justify-center gap-2"
            style={{ 
              borderColor: "var(--color-secondary)",
              color: "var(--color-secondary)"
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </motion.button>
        </div>
      </div>
      {children}
    </div>
  );
};

export default FormFooter;