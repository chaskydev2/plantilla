import React from "react";
import { motion } from "framer-motion";
import type { FormHeaderProps } from "./types";
import { borderPrimary, helpMuted } from "../form-registration";
import UserTypeSelector from "./UserTypeSelector";

const FormHeader: React.FC<FormHeaderProps> = ({ userType, setUserType }) => {
  return (
    <div className="max-w-6xl mx-auto px-6 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl border px-6 py-10 md:px-10 shadow-sm"
        style={{ background: "white", color: "var(--color-secondary)", ...borderPrimary }}
      >
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-black">
              Create your account
            </h1>
            <p className="mt-2 text-sm md:text-base" style={helpMuted}>
              Homeowners & Contractors — simple registration with smart validation.
            </p>
          </div>
          <UserTypeSelector userType={userType} setUserType={setUserType} />
        </div>
      </motion.div>
    </div>
  );
};

export default FormHeader;