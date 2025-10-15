import React from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, Lock, KeyRound, Building, FileText, Wrench, Calendar, Star } from "lucide-react";
import { FormInput } from "./FormInput";
import { MultiSelectField } from "./MultiSelectField";
import type { FormData } from "./types";
import { rolesData } from "./types";

interface ContractorFormProps {
  formData: FormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMultiSelectChange: (name: string, value: number[]) => void;
  errors: Record<string, string>;
  submitted: boolean;
  step: number;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

const fieldCls = "w-full border-2 rounded-xl px-5 py-4 text-gray-900 shadow-lg outline-none bg-white/90 backdrop-blur-sm transition-all duration-300 hover:shadow-xl focus:shadow-2xl focus:scale-[1.01] hover:bg-white/95";
const labelCls = "block text-sm font-bold mb-3 tracking-wide";

export const ContractorForm: React.FC<ContractorFormProps> = ({
  formData,
  onInputChange,
  onMultiSelectChange,
  errors,
  submitted,
  step,
  onNext,
  onPrev,
  onSubmit,
  loading
}) => {
  return (
    <div className="relative z-10">
      {step === 0 && (
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-2 gap-8"
        >
          <div className="md:col-span-2">
            <FormInput
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={onInputChange}
              placeholder="Enter your full name"
              icon={<User size={20} />}
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
            icon={<Mail size={20} />}
            required
            error={errors.email}
            submitted={submitted}
            hasIcon
          />

          <FormInput
            label="Phone"
            name="phone"
            type="tel"
            value={(formData as any).phone}
            onChange={onInputChange}
            placeholder="+591 7xx xxx xx"
            icon={<Phone size={20} />}
            required
            error={errors.phone}
            submitted={submitted}
            inputMode="tel"
            hasIcon
          />

          <FormInput
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={onInputChange}
            placeholder="Minimum 6 characters"
            icon={<Lock size={20} />}
            required
            error={errors.password}
            submitted={submitted}
            hasIcon
          />

          <FormInput
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={onInputChange}
            placeholder="Type password again"
            icon={<KeyRound size={20} />}
            required
            error={errors.confirmPassword}
            submitted={submitted}
            hasIcon
          />

          <div className="md:col-span-2 group">
            <label className={labelCls} style={{ color: "var(--color-secondary)" }}>
              <span className="flex items-center gap-2">
                💼 Professional Roles <span style={{ color: "var(--color-secondary)" }} className="text-lg">*</span>
                <span className="text-sm font-normal" style={{ color: "var(--color-primary)", opacity: 0.75 }}>(1-2 roles)</span>
              </span>
            </label>
            <MultiSelectField
              name="role_ids"
              value={(formData as any).role_ids || []}
              onChange={onMultiSelectChange}
              options={rolesData?.data?.roles || []}
              placeholder="Choose your professional services..."
              maxSelections={2}
              className={fieldCls}
              style={{ borderColor: "var(--color-primary)" }}
            />
            {submitted && errors.role_ids && (
              <motion.p 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm text-red-600 mt-2 font-medium flex items-center gap-2 animate-pulse"
                style={{ color: "var(--color-secondary)" }}
              >
                <span>⚠️</span> {errors.role_ids}
              </motion.p>
            )}
          </div>

          <div className="md:col-span-2 flex items-center justify-end gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onNext}
              className="font-black py-4 px-8 rounded-2xl shadow-xl border-2 transition-all duration-300"
              style={{
                backgroundColor: "var(--color-secondary)",
                color: "var(--color-primary)",
                borderColor: "var(--color-primary)",
              }}
            >
              <span className="flex items-center gap-2">
                Continue <span className="text-lg">→</span>
              </span>
            </motion.button>
          </div>
        </motion.div>
      )}

      {step === 1 && (
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-2 gap-8"
        >
          <FormInput
            label="Company"
            name="company"
            value={(formData as any).company}
            onChange={onInputChange}
            placeholder="Your company name"
            icon={<Building size={20} />}
            required
            error={errors.company}
            submitted={submitted}
            hasIcon
          />

          <FormInput
            label="License Number"
            name="licenseNumber"
            value={(formData as any).licenseNumber}
            onChange={onInputChange}
            placeholder="Registration/License #"
            icon={<FileText size={20} />}
            required
            error={errors.licenseNumber}
            submitted={submitted}
            hasIcon
          />

          <div className="md:col-span-2">
            <FormInput
              label="Services"
              name="services"
              value={(formData as any).services}
              onChange={onInputChange}
              placeholder="e.g., Plumbing, Electrical, HVAC"
              icon={<Wrench size={20} />}
              error={errors.services}
              submitted={submitted}
              hasIcon
            />
          </div>

          <FormInput
            label="Experience (years)"
            name="yearsOfExperience"
            type="number"
            value={(formData as any).yearsOfExperience}
            onChange={onInputChange}
            placeholder="5"
            icon={<Calendar size={20} />}
            min="0"
            max="50"
            error={errors.yearsOfExperience}
            submitted={submitted}
            hasIcon
          />

          <FormInput
            label="Portfolio URL"
            name="portfolioUrl"
            type="url"
            value={(formData as any).portfolioUrl}
            onChange={onInputChange}
            placeholder="https://your-portfolio.com"
            icon={<Star size={20} />}
            error={errors.portfolioUrl}
            submitted={submitted}
            hasIcon
          />

          <div className="md:col-span-2 flex items-center justify-between gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onPrev}
              className="font-black py-4 px-8 rounded-2xl shadow-xl border-2 transition-all duration-300"
              style={{
                background: "white",
                color: "var(--color-secondary)",
                borderColor: "var(--color-primary)",
              }}
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">←</span> Back
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              onClick={onSubmit}
              className="font-black py-4 px-12 rounded-2xl shadow-xl border-2 transition-all duration-300"
              style={{
                backgroundColor: "var(--color-secondary)",
                color: "var(--color-primary)",
                borderColor: "var(--color-primary)",
              }}
            >
              <span className="flex items-center gap-2">
                {loading ? "🔄 Submitting..." : "🚀 Complete Registration"}
              </span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
};