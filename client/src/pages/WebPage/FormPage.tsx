import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AuthService } from "../../core/services/auth/auth.service";
import variables from "../../core/config/variables";
import type { FormData, UserType, FormValidationErrors } from "../../components/form-registration/types";
import {
  // Components
  Stepper,
  HomeownerForm,
  ContractorForm,
  // Utils
  borderPrimary,
  helpMuted,
  initialHomeowner,
  initialContractor,
  // Validation
  useFormValidation,
} from "../../components/form-registration";

// =========================================
// Main Component
// =========================================
const CertificationRequestForm_SignupStepper: React.FC = () => {
  const [userType, setUserType] = useState<UserType>("ownerHome");
  const [formData, setFormData] = useState<FormData>(initialHomeowner);
  const [errors, setErrors] = useState<FormValidationErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);

  const contractorSteps = ["Account", "Company"];
  const validation = useFormValidation();

  // Reset form when user type changes
  useEffect(() => {
    setErrors({});
    setSubmitted(false);
    setStep(0);
    setFormData(userType === "ownerHome" ? initialHomeowner : initialContractor);
  }, [userType]);

  const compiledPayload = useMemo(() => ({ ...formData }), [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
    // remove error as user types
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });
  };

  const handleMultiSelectChange = (name: string, value: number[]) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });
  };

  // When there are errors after submit, focus first error
  useEffect(() => {
    if (!submitted) return;
    const firstKey = Object.keys(errors)[0];
    if (!firstKey) return;
    const el = document.querySelector(`[name="${firstKey}"]`) as HTMLElement | null;
    if (el) el.focus();
  }, [errors, submitted]);

  // Navigation
  const handleNext = () => {
    if (userType === "contractor") {
      const errs = validation.validateContractorStep0(formData as Extract<FormData, { userType: "contractor" }>);
      setErrors(errs);
      setSubmitted(true);
      if (Object.keys(errs).length === 0) setStep(1);
    }
  };

  const handlePrev = () => setStep((s) => Math.max(0, s - 1));

  const isFormMinimallyValid = validation.isFormMinimallyValid(formData, userType);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const validationErrors = validation.validateForm(formData, userType);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
      if (userType === "contractor") {
        const hasStep0Err = ["firstName", "lastName", "email", "password", "confirmPassword", "phone", "role_ids"].some((k) => validationErrors[k]);
        setStep(hasStep0Err ? 0 : 1);
      }
      return;
    }

    try {
      setLoading(true);
      
      if (userType === "ownerHome") {
        // Call homeowner registration API
        const homeownerData = formData as Extract<FormData, { userType: "ownerHome" }>;
        const registrationPayload = {
          first_name: homeownerData.firstName,
          last_name: homeownerData.lastName,
          email: homeownerData.email,
          phone: homeownerData.phone,
          password: homeownerData.password,
        };
        
        const response = await AuthService.registerHomeowner(registrationPayload);
        
        // Store the token in localStorage using the correct variable name
        if (response.data.access_token) {
          localStorage.setItem(variables.session.tokenName, response.data.access_token);
          localStorage.setItem('user_data', JSON.stringify(response.data.user));
        }
        
        console.log("Registration successful:", response);
        alert("Registration successful! Welcome to our platform!");
        
        // Optionally redirect to dashboard or profile page
        // window.location.href = '/dashboard';
        
      } else {
        // For contractors, keep the existing simulation for now
        await new Promise((r) => setTimeout(r, 1200));
        console.log("Submitted payload:", compiledPayload);
        alert("Registration sent successfully!");
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      
      // Handle different types of errors
      if (err.response?.data?.errors) {
        // Laravel validation errors
        const apiErrors: FormValidationErrors = {};
        Object.keys(err.response.data.errors).forEach(field => {
          // Map API field names to form field names
          const fieldMap: { [key: string]: string } = {
            'first_name': 'firstName',
            'last_name': 'lastName',
            'phone': 'phone',
            'email': 'email',
            'password': 'password'
          };
          
          const formField = fieldMap[field] || field;
          apiErrors[formField] = err.response.data.errors[field][0];
        });
        setErrors(apiErrors);
        alert("Please correct the errors and try again.");
      } else if (err.response?.data?.message) {
        alert(`Registration failed: ${err.response.data.message}`);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="pt-20 pb-16 min-h-screen text-gray-900"
      style={{
        background: "var(--color-primary)",
      }}
    >
      {/* Header */}
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
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-black">Create your account</h1>
              <p className="mt-2 text-sm md:text-base" style={helpMuted}>
                Homeowners & Contractors — simple registration with smart validation.
              </p>
            </div>
            {/* Segmented control */}
            <div className="relative">
              <div
                className="relative flex items-center rounded-full border text-sm font-semibold"
                style={{ ...borderPrimary, background: "white" }}
                role="tablist"
                aria-label="User type"
              >
                <motion.div
                  className="absolute top-0 bottom-0 m-1 rounded-full shadow"
                  initial={false}
                  animate={{ left: userType === "ownerHome" ? 2 : "50%", width: "50%" }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  style={{ background: "var(--color-secondary)" }}
                />
                <button
                  type="button"
                  onClick={() => setUserType("ownerHome")}
                  className="relative z-10 w-40 px-5 py-2 rounded-full"
                  style={{ color: userType === "ownerHome" ? "var(--color-primary)" : "var(--color-secondary)" }}
                  role="tab"
                  aria-selected={userType === "ownerHome"}
                >
                  Homeowner
                </button>
                <button
                  type="button"
                  onClick={() => setUserType("contractor")}
                  className="relative z-10 w-40 px-5 py-2 rounded-full"
                  style={{ color: userType === "contractor" ? "var(--color-primary)" : "var(--color-secondary)" }}
                  role="tab"
                  aria-selected={userType === "contractor"}
                >
                  Contractor
                </button>
              </div>
              <div
                className="absolute w-full text-center text-[11px] mt-1"
                style={{ color: "var(--color-secondary)" }}
              >
                {userType === "ownerHome" ? "Property Owner" : "Service Provider"}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Card */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative max-w-6xl mx-auto mt-8 px-6 md:px-8"
      >
        <div
          className="relative rounded-2xl border p-6 md:p-10 shadow-sm"
          style={{ background: "white", ...borderPrimary }}
        >
          {/* Loading overlay */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-50 rounded-2xl bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center"
            >
              <div className="w-8 h-8 rounded-full border-2 border-current border-t-transparent animate-spin" style={{ color: "var(--color-secondary)" }} />
              <div className="mt-3 text-sm font-semibold text-black">Processing…</div>
            </motion.div>
          )}

          {/* Progress */}
          {userType === "contractor" && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-semibold text-black">Registration Progress</h3>
                <span className="text-xs px-2 py-1 rounded-full border" style={borderPrimary}>
                  Step {step + 1} of {contractorSteps.length}
                </span>
              </div>
              <Stepper steps={contractorSteps} current={step} />
            </div>
          )}

          <div className="h-[1px] w-full mb-8" style={{ background: "rgba(0,0,0,0.06)" }} />

          {/* Forms */}
          {userType === "ownerHome" ? (
            <HomeownerForm
              formData={formData as Extract<FormData, { userType: "ownerHome" }>}
              errors={errors}
              submitted={submitted}
              handleChange={handleChange}
            />
          ) : (
            <ContractorForm
              formData={formData as Extract<FormData, { userType: "contractor" }>}
              errors={errors}
              submitted={submitted}
              loading={loading}
              step={step}
              handleChange={handleChange}
              handleMultiSelectChange={handleMultiSelectChange}
              handleNext={handleNext}
              handlePrev={handlePrev}
              handleSubmit={handleSubmit}
            />
          )}

          {/* Footer */}
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
                className="px-6 py-3 rounded-xl border font-bold shadow-sm"
                style={{
                  background: "var(--color-secondary)",
                  color: "var(--color-primary)",
                  ...borderPrimary,
                  opacity: loading || !isFormMinimallyValid ? 0.8 : 1,
                }}
              >
                {loading ? "Creating…" : "Create Account"}
              </motion.button>
            )}
          </div>

          {/* Success toast (inline) */}
          {submitted && Object.keys(errors).length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 rounded-xl border px-4 py-3 text-sm font-semibold"
              style={{ background: "rgba(0,0,0,0.02)", ...borderPrimary, color: "var(--color-secondary)" }}
            >
              Registration successful — we will contact you soon.
            </motion.div>
          )}
        </div>
      </motion.form>
    </div>
  );
};

export default CertificationRequestForm_SignupStepper;
