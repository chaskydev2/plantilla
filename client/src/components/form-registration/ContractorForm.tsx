import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { FormData, FormValidationErrors } from "./types";
import { fieldCls, labelCls, borderPrimary, helpMuted } from "./utils";
import ErrorText from "./ErrorText";
import PasswordInput from "./PasswordInput";
import MultiSelectField from "./MultiSelectField";
import { ProfessionService } from "@/core/services/profession/profession.service";
import type { IProfession } from "@/core/types/IProfession";

interface ContractorFormProps {
  formData: Extract<FormData, { userType: "contractor" }>;
  errors: FormValidationErrors;
  submitted: boolean;
  loading: boolean;
  step: number;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleMultiSelectChange: (name: string, value: number[]) => void;
  handleNext: () => void;
  handlePrev: () => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const ContractorForm: React.FC<ContractorFormProps> = ({
  formData,
  errors,
  submitted,
  loading,
  step,
  handleChange,
  handleMultiSelectChange,
  handleNext,
  handlePrev,
  handleSubmit,
}) => {
  const [professionsData, setProfessionsData] = useState<IProfession[]>([]);
  const [loadingProfessions, setLoadingProfessions] = useState(true);

  // Cargar profesiones cuando el componente se monta
  useEffect(() => {
    const loadProfessions = async () => {
      try {
        const response = await ProfessionService.getAll();
        if (response.success && response.data) {
          setProfessionsData(response.data);
        }
      } catch (error) {
        console.error('Error loading professions:', error);
      } finally {
        setLoadingProfessions(false);
      }
    };

    loadProfessions();
  }, []);

  // Transformar las profesiones al formato esperado por MultiSelectField
  const professionsOptions = professionsData.map(profession => ({
    id: profession.id,
    name: profession.name,
    value: profession.id,
    label: profession.name
  }));
  return (
    <div>
      {step === 0 && (
        <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="grid md:grid-cols-2 gap-6">
          <div>
            <label className={labelCls} style={{ color: "var(--color-secondary)" }} htmlFor="firstNameC">
              First Name *
            </label>
            <input
              id="firstNameC"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={fieldCls}
              style={borderPrimary}
              placeholder="Your first name"
            />
            <ErrorText msg={submitted ? errors.firstName : undefined} />
          </div>

          <div>
            <label className={labelCls} style={{ color: "var(--color-secondary)" }} htmlFor="lastNameC">
              Last Name *
            </label>
            <input
              id="lastNameC"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={fieldCls}
              style={borderPrimary}
              placeholder="Your last name"
            />
            <ErrorText msg={submitted ? errors.lastName : undefined} />
          </div>

          <div>
            <label className={labelCls} style={{ color: "var(--color-secondary)" }} htmlFor="emailC">
              Email *
            </label>
            <input
              id="emailC"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={fieldCls}
              style={borderPrimary}
              placeholder="name@example.com"
            />
            <ErrorText msg={submitted ? errors.email : undefined} />
          </div>

          <div>
            <label className={labelCls} style={{ color: "var(--color-secondary)" }} htmlFor="phone">
              Phone *
            </label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={fieldCls}
              style={borderPrimary}
              placeholder="+591 7xx xxx xx"
              inputMode="tel"
            />
            <ErrorText msg={submitted ? errors.phone : undefined} />
          </div>

          <div>
            <label className={labelCls} style={{ color: "var(--color-secondary)" }} htmlFor="passwordC">
              Password *
            </label>
            <PasswordInput
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={fieldCls}
              style={borderPrimary}
              placeholder="Minimum 6 characters"
            />
            <ErrorText msg={submitted ? errors.password : undefined} />
          </div>

          <div>
            <label className={labelCls} style={{ color: "var(--color-secondary)" }} htmlFor="confirmPasswordC">
              Confirm Password *
            </label>
            <PasswordInput
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={fieldCls}
              style={borderPrimary}
              placeholder="Type password again"
            />
            <ErrorText msg={submitted ? errors.confirmPassword : undefined} />
          </div>

          <div className="md:col-span-2">
            <label className={labelCls} style={{ color: "var(--color-secondary)" }}>
              Professional Roles *
            </label>
            <MultiSelectField
              name="role_ids"
              value={formData.role_ids || []}
              onChange={handleMultiSelectChange}
              options={professionsOptions}
              placeholder={loadingProfessions ? "Loading professions..." : "Choose your roles"}
              maxSelections={2}
              className={fieldCls}
              style={{ borderColor: "var(--color-primary)" }}
              ariaLabel="Professional roles"
              disabled={loadingProfessions}
            />
            {loadingProfessions && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 mt-2"
                style={{ color: "var(--color-primary)", opacity: 0.7 }}
              >
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600"></div>
                <span className="text-sm">Loading professions...</span>
              </motion.div>
            )}
            <ErrorText msg={submitted ? errors.role_ids : undefined} />
          </div>

          <div className="md:col-span-2 flex items-center justify-end gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleNext}
              className="px-6 py-3 rounded-xl border font-bold shadow-sm"
              style={{ background: "var(--color-secondary)", color: "var(--color-primary)", ...borderPrimary }}
            >
              Continue
            </motion.button>
          </div>
        </motion.div>
      )}

      {step === 1 && (
        <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="grid md:grid-cols-2 gap-6">
          <div>
            <label className={labelCls} style={{ color: "var(--color-secondary)" }} htmlFor="company">
              Company *
            </label>
            <input
              id="company"
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className={fieldCls}
              style={borderPrimary}
              placeholder="Company name"
            />
            <ErrorText msg={submitted ? errors.company : undefined} />
          </div>

          <div>
            <label className={labelCls} style={{ color: "var(--color-secondary)" }} htmlFor="licenseNumber">
              License Number *
            </label>
            <input
              id="licenseNumber"
              type="text"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              className={fieldCls}
              style={borderPrimary}
              placeholder="Registration / License #"
            />
            <ErrorText msg={submitted ? errors.licenseNumber : undefined} />
          </div>

          <div className="md:col-span-2">
            <label className={labelCls} style={{ color: "var(--color-secondary)" }}>
              Services <span className="font-normal" style={helpMuted}>
                (optional)
              </span>
            </label>
            <input
              type="text"
              name="services"
              value={formData.services}
              onChange={handleChange}
              className={fieldCls}
              style={borderPrimary}
              placeholder="e.g., Plumbing, Electrical, HVAC"
            />
          </div>

          <div>
            <label className={labelCls} style={{ color: "var(--color-secondary)" }} htmlFor="yearsOfExperience">
              Experience (years)
            </label>
            <input
              id="yearsOfExperience"
              type="number"
              name="yearsOfExperience"
              value={formData.yearsOfExperience}
              onChange={handleChange}
              className={fieldCls}
              style={borderPrimary}
              placeholder="5"
              min={0}
              max={50}
            />
            <ErrorText msg={submitted ? errors.yearsOfExperience : undefined} />
          </div>

          <div>
            <label className={labelCls} style={{ color: "var(--color-secondary)" }} htmlFor="portfolioUrl">
              Portfolio URL <span className="font-normal" style={helpMuted}>
                (optional)
              </span>
            </label>
            <input
              id="portfolioUrl"
              type="url"
              name="portfolioUrl"
              value={formData.portfolioUrl || ""}
              onChange={handleChange}
              className={fieldCls}
              style={borderPrimary}
              placeholder="https://your-portfolio.com"
            />
          </div>

          <div className="md:col-span-2 flex items-center justify-between gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handlePrev}
              className="px-6 py-3 rounded-xl border font-bold shadow-sm"
              style={{ background: "white", color: "var(--color-secondary)", ...borderPrimary }}
            >
              Back
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              onClick={handleSubmit}
              className="px-7 py-3 rounded-xl border font-bold shadow-sm"
              style={{ background: "var(--color-secondary)", color: "var(--color-primary)", ...borderPrimary }}
            >
              {loading ? "Submitting…" : "Complete Registration"}
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ContractorForm;