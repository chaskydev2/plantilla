import React from "react";
import { motion } from "framer-motion";
import { FormInput } from "./FormInput";
import type { FormData } from "./types";

interface HomeownerFormProps {
  formData: FormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: Record<string, string>;
  submitted: boolean;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const HomeownerForm: React.FC<HomeownerFormProps> = ({
  formData,
  onInputChange,
  errors,
  submitted,
  loading,
  onSubmit
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9, duration: 0.6 }}
      className="relative z-10 grid md:grid-cols-2 gap-8"
    >
      <div className="md:col-span-2">
        <FormInput
          label="Full Name"
          name="fullName"
          value={formData.fullName}
          onChange={onInputChange}
          placeholder="Enter your full name"
          icon="👤"
          required
          error={errors.fullName}
          submitted={submitted}
          hasIcon
        />
      </div>

      <FormInput
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={onInputChange}
        placeholder="name@example.com"
        icon="📧"
        required
        error={errors.email}
        submitted={submitted}
        hasIcon
      />

      <FormInput
        label="Address"
        name="address"
        value={(formData as any).address}
        onChange={onInputChange}
        placeholder="Your home address"
        icon="🏠"
        required
        error={errors.address}
        submitted={submitted}
        hasIcon
      />

      <FormInput
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={onInputChange}
        placeholder="Minimum 6 characters"
        icon="🔒"
        required
        error={errors.password}
        submitted={submitted}
      />

      <FormInput
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        value={formData.confirmPassword}
        onChange={onInputChange}
        placeholder="Type password again"
        icon="🔐"
        required
        error={errors.confirmPassword}
        submitted={submitted}
      />

      {/* Submit Button for Homeowner */}
      <div className="md:col-span-2 mt-8 pt-4 border-t-2 flex items-center justify-between gap-4" style={{ borderColor: "var(--color-primary)", opacity: 0.3 }}>
        <div className="text-sm font-medium" style={{ color: "var(--color-secondary)", opacity: 0.8 }}>
          Fields marked with <span style={{ color: "var(--color-secondary)" }} className="font-bold">*</span> are required.
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={loading}
          onClick={onSubmit}
          className="font-black py-3 px-8 rounded-2xl shadow-xl transition-all duration-200 border-3 text-base tracking-wide transform hover:shadow-2xl"
          style={{
            backgroundColor: "var(--color-secondary)",
            color: "var(--color-primary)",
            borderColor: "var(--color-primary)",
          }}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="inline-block animate-spin">🔄</span> Creating Account...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              🚀 Create Account
            </span>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};