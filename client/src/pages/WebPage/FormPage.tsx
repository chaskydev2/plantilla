import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";

// ===================== Multi-Select Component =====================
interface MultiSelectOption {
  id: number;
  name: string;
}

interface MultiSelectFieldProps {
  name: string;
  value: number[];
  onChange: (name: string, value: number[]) => void;
  options: MultiSelectOption[];
  placeholder?: string;
  maxSelections?: number;
  className?: string;
  style?: React.CSSProperties;
}

const MultiSelectField: React.FC<MultiSelectFieldProps> = ({
  name,
  value,
  onChange,
  options,
  placeholder = "Select options...",
  maxSelections = 2,
  className = "",
  style = {}
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggleOption = (optionId: number) => {
    if (value.includes(optionId)) {
      onChange(name, value.filter(id => id !== optionId));
    } else if (value.length < maxSelections) {
      onChange(name, [...value, optionId]);
    }
  };

  const selectedOptions = options.filter(option => value.includes(option.id));

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.div 
        whileHover={{ scale: 1.01 }}
        whileFocus={{ scale: 1.02 }}
        className={`${className} cursor-pointer flex items-center justify-between min-h-[56px]`}
        style={style}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-2">
          {selectedOptions.length > 0 ? (
            selectedOptions.map(option => (
              <motion.span 
                key={option.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="px-3 py-1 rounded-full text-sm font-medium border-2 shadow-md"
                style={{
                  backgroundColor: "var(--color-primary)",
                  color: "var(--color-secondary)",
                  borderColor: "var(--color-secondary)",
                  opacity: 0.9
                }}
              >
                💼 {option.name}
              </motion.span>
            ))
          ) : (
            <span className="text-gray-500 flex items-center gap-2">
              <span>💼</span> {placeholder}
            </span>
          )}
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, type: "spring" }}
          className="ml-2 text-lg"
        >
          ⬇️
        </motion.div>
      </motion.div>
      
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2, type: "spring" }}
          className="absolute z-50 w-full mt-2 bg-white border-2 rounded-xl shadow-2xl max-h-60 overflow-y-auto backdrop-blur-sm"
          style={{ borderColor: "var(--color-primary)" }}
        >
          {options.map(option => (
            <motion.div
              key={option.id}
              whileHover={{ scale: 1.02, x: 5 }}
              className={`p-4 cursor-pointer transition-all duration-200 border-l-4 ${
                value.includes(option.id) ? 'font-bold bg-opacity-10' : 'hover:bg-gray-50'
              }`}
              style={{
                backgroundColor: value.includes(option.id) ? "var(--color-primary)" : "white",
                color: value.includes(option.id) ? "var(--color-secondary)" : "var(--color-secondary)",
                borderLeftColor: value.includes(option.id) ? "var(--color-secondary)" : "transparent",
                opacity: value.includes(option.id) ? 0.95 : 1
              }}
              onClick={() => handleToggleOption(option.id)}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span>💼</span> {option.name}
                </span>
                {value.includes(option.id) && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-lg"
                  >
                    ✅
                  </motion.span>
                )}
              </div>
            </motion.div>
          ))}
          {options.length === 0 && (
            <div className="p-4 text-gray-500 text-center flex items-center justify-center gap-2">
              <span>⚠️</span>
              <span>No professional roles available</span>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

// ===================== Types =====================
// New base with auth fields as requested
interface BaseAuth {
  fullName: string;
  email: string; // gmail/email
  password: string;
  confirmPassword: string;
}

// User type
type UserType = "ownerHome" | "contractor";

// Homeowner requires: name, gmail, address, password + confirm
interface HomeownerFields {
  address: string;
}

// Contractor steps require (step 1): phone, gmail, name, password + confirm
// plus (step 2) contractor details
interface ContractorFields {
  phone: string;
  company: string;
  licenseNumber: string;
  services: string; // comma separated tags
  yearsOfExperience: string; // keep as string for easy validation
  portfolioUrl?: string;
  role_ids: number[];
}

// Discriminated union FormData
export type FormData =
  | (BaseAuth & { userType: "ownerHome" } & HomeownerFields)
  | (BaseAuth & { userType: "contractor" } & ContractorFields);

// ===================== Initial State =====================
const initialBaseAuth: BaseAuth = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const initialHomeowner: FormData = {
  ...initialBaseAuth,
  userType: "ownerHome",
  address: "",
};

const initialContractor: FormData = {
  ...initialBaseAuth,
  userType: "contractor",
  phone: "",
  company: "",
  licenseNumber: "",
  services: "",
  yearsOfExperience: "",
  portfolioUrl: "",
  role_ids: [],
};

// ===================== UI Helpers =====================
const fieldCls =
  "w-full border-2 rounded-xl px-5 py-4 text-gray-900 shadow-lg outline-none bg-white/90 backdrop-blur-sm transition-all duration-300 hover:shadow-xl focus:shadow-2xl focus:scale-[1.01] hover:bg-white/95";

const labelCls = "block text-sm font-bold mb-3 tracking-wide";

const pillButton = (active: boolean) =>
  `px-8 py-4 rounded-2xl text-sm font-bold transition-all duration-300 ${
    active
      ? "shadow-2xl transform scale-105 ring-4 ring-opacity-20"
      : "bg-white/90 backdrop-blur-sm border-2 hover:bg-opacity-80 hover:scale-102 hover:shadow-lg"
  }`;

const errorText = "text-sm text-red-600 mt-2 font-medium flex items-center gap-2 animate-pulse";

// Stepper bullets with enhanced design
const Stepper: React.FC<{ steps: string[]; current: number }> = ({ steps, current }) => {
  return (
    <div className="flex items-center justify-center gap-6 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
      {steps.map((s, idx) => {
        const active = idx <= current;
        const completed = idx < current;
        return (
          <div key={s} className="flex items-center gap-3">
            <div className="flex flex-col items-center gap-2">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center border-3 font-bold text-lg transition-all duration-500 ${
                  active ? "scale-110 shadow-xl" : "opacity-60"
                } ${completed ? "animate-pulse" : ""}`}
                style={{
                  backgroundColor: active ? "var(--color-secondary)" : "white",
                  color: active ? "var(--color-primary)" : "var(--color-secondary)",
                  borderColor: "var(--color-primary)",
                  boxShadow: active ? `0 8px 25px rgba(245, 210, 56, 0.4)` : 'none'
                }}
              >
                {completed ? "✓" : idx + 1}
              </div>
              <span className="text-sm font-bold text-center" style={{ color: "var(--color-secondary)" }}>
                {s}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div 
                className={`w-16 h-1 rounded-full transition-all duration-500 ${completed ? 'animate-pulse' : ''}`}
                style={{ 
                  background: completed 
                    ? `linear-gradient(90deg, var(--color-primary), var(--color-secondary))` 
                    : `var(--color-primary)`,
                  opacity: completed ? 1 : 0.3 
                }} 
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

// ===================== Component =====================
const CertificationRequestForm_SignupStepper: React.FC = () => {
  const [userType, setUserType] = useState<UserType>("ownerHome");
  const [formData, setFormData] = useState<FormData>(initialHomeowner);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // contractor specific: 2 steps; homeowner: 1 step
  const contractorSteps = ["Account", "Company"];
  const [step, setStep] = useState(0); // 0-based index

  // Mock roles data - in real app, this would come from API
  const rolesData = {
    data: {
      roles: [
        { id: 1, name: "Plumber" },
        { id: 2, name: "Electrician" },
        { id: 3, name: "Carpenter" },
        { id: 4, name: "Painter" },
        { id: 5, name: "HVAC Technician" },
        { id: 6, name: "Landscaper" },
        { id: 7, name: "Roofer" },
        { id: 8, name: "General Contractor" },
      ]
    }
  };

  // Switch form model when userType changes
  useEffect(() => {
    setErrors({});
    setSubmitted(false);
    setStep(0);
    setFormData(userType === "ownerHome" ? initialHomeowner : initialContractor);
  }, [userType]);

  const compiledPayload = useMemo(() => ({ ...formData }), [formData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (name: string, value: number[]) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  // ===================== Validation =====================
  const validateCommonAuth = (data: BaseAuth) => {
    const e: Record<string, string> = {};
    if (!data.fullName.trim()) e.fullName = "Full name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = "Enter a valid email address.";
    if (data.password.length < 6) e.password = "Password must be at least 6 characters.";
    if (data.password !== data.confirmPassword) e.confirmPassword = "Passwords do not match.";
    return e;
  };

  const validateHomeowner = (data: Extract<FormData, { userType: "ownerHome" }>) => {
    const e = validateCommonAuth(data);
    if (!data.address.trim()) e.address = "Address is required.";
    return e;
  };

  const validateContractorStep0 = (data: Extract<FormData, { userType: "contractor" }>) => {
    const e = validateCommonAuth(data);
    if (!/^[+]?\d[\d\s-]{6,}$/.test(data.phone || "")) e.phone = "Enter a valid phone number.";
    if (!data.role_ids || data.role_ids.length === 0) e.role_ids = "Please select at least one professional role.";
    if (data.role_ids && data.role_ids.length > 2) e.role_ids = "You can select maximum 2 roles.";
    return e;
  };

  const validateContractorStep1 = (data: Extract<FormData, { userType: "contractor" }>) => {
    const e: Record<string, string> = {};
    if (!data.company.trim()) e.company = "Company name is required.";
    if (!data.licenseNumber.trim()) e.licenseNumber = "License number is required.";
    if (data.yearsOfExperience && !/^\d{1,2}$/.test(data.yearsOfExperience))
      e.yearsOfExperience = "Years must be a number (0-99).";
    return e;
  };

  // ===================== Submit / Navigation =====================
  const handleNext = () => {
    if (userType === "contractor") {
      const errs = validateContractorStep0(formData as Extract<FormData, { userType: "contractor" }>);
      setErrors(errs);
      if (Object.keys(errs).length === 0) setStep(1);
    }
  };

  const handlePrev = () => setStep((s) => Math.max(0, s - 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    let v: Record<string, string> = {};
    if (userType === "ownerHome") {
      v = validateHomeowner(formData as Extract<FormData, { userType: "ownerHome" }>);
    } else {
      // contractor must validate both steps on final submit
      v = {
        ...validateContractorStep0(formData as Extract<FormData, { userType: "contractor" }>),
        ...validateContractorStep1(formData as Extract<FormData, { userType: "contractor" }>),
      };
    }

    setErrors(v);
    if (Object.keys(v).length > 0) {
      // jump user to the first error step in contractor flow
      if (userType === "contractor") {
        const hasStep0Err = ["fullName", "email", "password", "confirmPassword", "phone", "role_ids"].some(
          (k) => v[k]
        );
        setStep(hasStep0Err ? 0 : 1);
      }
      return;
    }

    try {
      setLoading(true);
      console.log("Submitted payload:", compiledPayload);
      
      // Simulate API call with progress
      await new Promise((resolve) => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 20;
          if (progress >= 100) {
            clearInterval(interval);
            resolve(true);
          }
        }, 200);
      });
      
      // Success feedback
      alert("✅ Registration sent successfully! Check the console for the payload.");
    } catch (error) {
      console.error(error);
      alert("❌ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ===================== Render =====================
  return (
    <div
      className="pt-24 pb-20 min-h-screen text-gray-900 relative overflow-hidden"
      style={{
        background: `var(--color-primary)`,
      }}
    >
  

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative py-12 px-6 md:px-12 mb-12 rounded-2xl shadow-xl max-w-6xl mx-auto border-3 backdrop-blur-lg"
        style={{
          background: `white`,
          color: "var(--color-primary)",
          borderColor: "var(--color-secondary)",
        }}
      >
        {/* Header background effects */}
        <div 
          className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl animate-spin"
          style={{ backgroundColor: "var(--color-primary)", opacity: 0.1, animationDuration: '20s' }}
        />
        <div 
          className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full blur-2xl animate-ping"
          style={{ backgroundColor: "var(--color-primary)", opacity: 0.1, animationDuration: '4s' }}
        />
        
        <div className="relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-2xl md:text-3xl font-black text-black tracking-tight leading-tight"
          >
            Create your account
          </motion.h1>
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-lg md:text-xl font-bold mt-2 text-black drop-shadow-lg"
          >
            Homeowners & Contractors
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-sm md:text-base mt-3 max-w-3xl leading-relaxed font-medium"
            style={{ color: "var(--color-primary)", opacity: 0.95 }}
          >
            Join our trusted network of professionals. Simple registration with smart validation flow.
          </motion.p>
        </div>
      </motion.div>

      {/* Card */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        className="relative py-12 px-6 md:px-12 mb-12 rounded-2xl shadow-xl max-w-6xl mx-auto border-3 backdrop-blur-lg overflow-hidden"
        style={{
          background: `white`,
          color: "var(--color-primary)",
          borderColor: "var(--color-secondary)",
        }}
      >
        {/* Loading overlay */}
        {loading && (
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
        )}
        {/* Form background effects */}
        <div 
          className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl animate-spin"
          style={{ backgroundColor: "var(--color-primary)", opacity: 0.1, animationDuration: '20s' }}
        />
        <div 
          className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full blur-2xl animate-ping"
          style={{ backgroundColor: "var(--color-primary)", opacity: 0.1, animationDuration: '4s' }}
        />

        {/* User type selector */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="relative z-10 flex flex-wrap items-center justify-between gap-6 mb-8"
        >
          <div>
            <h2 className="text-2xl md:text-3xl font-black mb-2 tracking-tight text-black">
              Choose Account Type
            </h2>
            <p className="text-sm md:text-base font-medium" style={{ color: "var(--color-primary)", opacity: 0.95 }}>
              Select your role to customize your registration experience
            </p>
          </div>
          {/* Switch-style Toggle */}
          <div className="relative">
            {/* Switch Background */}
            <div 
              className="relative flex items-center p-1 rounded-full border-3 shadow-2xl backdrop-blur-lg overflow-hidden"
              style={{
                backgroundColor: "var(--color-primary)",
                borderColor: "var(--color-secondary)",
                minWidth: "320px",
                height: "60px"
              }}
            >
              {/* Animated Background Slider */}
              <motion.div
                className="absolute top-1 bottom-1 rounded-full shadow-lg z-10"
                initial={false}
                animate={{
                  left: userType === "ownerHome" ? "4px" : "50%",
                  width: userType === "ownerHome" ? "48%" : "48%"
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 500, 
                  damping: 30,
                  duration: 0.3 
                }}
                style={{
                  backgroundColor: "var(--color-secondary)",
                  boxShadow: `0 4px 12px rgba(0,0,0,0.2), 0 0 20px var(--color-secondary)`
                }}
              />
              
              {/* Switch Options */}
              <div className="relative z-20 flex w-full">
                {/* Homeowner Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setUserType("ownerHome")}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full font-bold text-sm transition-all duration-300 relative z-30"
                  style={{
                    color: userType === "ownerHome" ? "var(--color-primary)" : "var(--color-secondary)",
                    textShadow: userType === "ownerHome" ? "none" : "0 1px 2px rgba(0,0,0,0.1)"
                  }}
                >
                  <motion.span 
                    className="text-lg"
                    animate={{ 
                      scale: userType === "ownerHome" ? 1.2 : 1,
                      rotate: userType === "ownerHome" ? [0, -10, 10, 0] : 0
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    🏠
                  </motion.span>
                  <span className="tracking-wide">Homeowner</span>
                </motion.button>

                {/* Contractor Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setUserType("contractor")}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full font-bold text-sm transition-all duration-300 relative z-30"
                  style={{
                    color: userType === "contractor" ? "var(--color-primary)" : "var(--color-secondary)",
                    textShadow: userType === "contractor" ? "none" : "0 1px 2px rgba(0,0,0,0.1)"
                  }}
                >
                  <motion.span 
                    className="text-lg"
                    animate={{ 
                      scale: userType === "contractor" ? 1.2 : 1,
                      rotate: userType === "contractor" ? [0, -10, 10, 0] : 0
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    🔧
                  </motion.span>
                  <span className="tracking-wide">Contractor</span>
                </motion.button>
              </div>

              {/* Decorative Elements */}
              <div 
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full animate-pulse"
                style={{ backgroundColor: "var(--color-secondary)", opacity: 0.3 }}
              />
              <div 
                className="absolute -bottom-1 -left-1 w-4 h-4 rounded-full animate-ping"
                style={{ backgroundColor: "var(--color-secondary)", opacity: 0.2 }}
              />
            </div>

            {/* Status Indicator */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium px-3 py-1 rounded-full border backdrop-blur-sm"
              style={{
                backgroundColor: "var(--color-secondary)",
                color: "var(--color-primary)",
                borderColor: "var(--color-primary)",
                opacity: 0.9
              }}
            >
              {userType === "ownerHome" ? "Property Owner" : "Service Provider"}
            </motion.div>
          </div>
        </motion.div>

        {/* Progress (Contractor only) */}
        {userType === "contractor" && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="relative z-10 mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-black">
                Registration Progress
              </h3>
              <div className="text-sm font-bold px-3 py-1 rounded-full border-2" 
                style={{ 
                  color: "var(--color-secondary)", 
                  borderColor: "var(--color-primary)",
                  backgroundColor: "var(--color-primary)",
                  opacity: 0.1
                }}
              >
                Step {step + 1} of {contractorSteps.length}
              </div>
            </div>
            <Stepper steps={contractorSteps} current={step} />
          </motion.div>
        )}

        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="relative z-10 h-1 rounded-full mb-8 shadow-lg"
          style={{ 
            backgroundColor: "var(--color-secondary)",
            transformOrigin: 'left'
          }} 
        />

        {/* ===================== Forms ===================== */}
        {userType === "ownerHome" ? (
          // ----- Homeowner (single step) -----
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="relative z-10 grid md:grid-cols-2 gap-8"
          >
            <div className="md:col-span-2 group">
              <label className={labelCls} style={{ color: "var(--color-secondary)" }}>
                <span className="flex items-center gap-2">
                  👤 Full Name <span style={{ color: "var(--color-secondary)" }} className="text-lg animate-pulse">*</span>
                </span>
              </label>
              <div className="relative">
                <motion.input
                  whileFocus={{ scale: 1.02, borderColor: "var(--color-secondary)" }}
                  whileHover={{ scale: 1.005 }}
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`${fieldCls} pl-12`}
                  style={{ borderColor: "var(--color-primary)", "--tw-ring-color": "var(--color-primary)" } as React.CSSProperties}
                  placeholder="Enter your full name"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">
                  👤
                </div>
              </div>
              {submitted && errors.fullName && (
                <motion.p 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={errorText}
                  style={{ color: "var(--color-secondary)" }}
                >
                  <span>⚠️</span> {errors.fullName}
                </motion.p>
              )}
            </div>

            <div className="group">
              <label className={labelCls} style={{ color: "var(--color-secondary)" }}>
                <span className="flex items-center gap-2">
                  📧 Email <span style={{ color: "var(--color-secondary)" }} className="text-lg animate-pulse">*</span>
                </span>
              </label>
              <div className="relative">
                <motion.input
                  whileFocus={{ scale: 1.02, borderColor: "var(--color-secondary)" }}
                  whileHover={{ scale: 1.005 }}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`${fieldCls} pl-12`}
                  style={{ borderColor: "var(--color-primary)", "--tw-ring-color": "var(--color-primary)" } as React.CSSProperties}
                  placeholder="name@example.com"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">
                  📧
                </div>
              </div>
              {submitted && errors.email && (
                <motion.p 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={errorText}
                  style={{ color: "var(--color-secondary)" }}
                >
                  <span>⚠️</span> {errors.email}
                </motion.p>
              )}
            </div>

            <div className="group">
              <label className={labelCls} style={{ color: "var(--color-secondary)" }}>
                <span className="flex items-center gap-2">
                  🏠 Address <span style={{ color: "var(--color-secondary)" }} className="text-lg animate-pulse">*</span>
                </span>
              </label>
              <div className="relative">
                <motion.input
                  whileFocus={{ scale: 1.02, borderColor: "var(--color-secondary)" }}
                  whileHover={{ scale: 1.005 }}
                  type="text"
                  name="address"
                  value={(formData as any).address}
                  onChange={handleChange}
                  className={`${fieldCls} pl-12`}
                  style={{ borderColor: "var(--color-primary)", "--tw-ring-color": "var(--color-primary)" } as React.CSSProperties}
                  placeholder="Your home address"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">
                  🏠
                </div>
              </div>
              {submitted && errors.address && (
                <motion.p 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={errorText}
                  style={{ color: "var(--color-secondary)" }}
                >
                  <span>⚠️</span> {errors.address}
                </motion.p>
              )}
            </div>

            <div className="group">
              <label className={labelCls} style={{ color: "var(--color-secondary)" }}>
                <span className="flex items-center gap-2">
                  🔒 Password <span style={{ color: "var(--color-secondary)" }} className="text-lg">*</span>
                </span>
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={fieldCls}
                style={{ borderColor: "var(--color-primary)", "--tw-ring-color": "var(--color-primary)" } as React.CSSProperties}
                placeholder="Minimum 6 characters"
              />
              {submitted && errors.password && (
                <motion.p 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={errorText}
                  style={{ color: "var(--color-secondary)" }}
                >
                  <span>⚠️</span> {errors.password}
                </motion.p>
              )}
            </div>

            <div className="group">
              <label className={labelCls} style={{ color: "var(--color-secondary)" }}>
                <span className="flex items-center gap-2">
                  🔐 Confirm Password <span style={{ color: "var(--color-secondary)" }} className="text-lg">*</span>
                </span>
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={fieldCls}
                style={{ borderColor: "var(--color-primary)", "--tw-ring-color": "var(--color-primary)" } as React.CSSProperties}
                placeholder="Type password again"
              />
              {submitted && errors.confirmPassword && (
                <motion.p 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={errorText}
                  style={{ color: "var(--color-secondary)" }}
                >
                  <span>⚠️</span> {errors.confirmPassword}
                </motion.p>
              )}
            </div>
          </motion.div>
        ) : (
          // ----- Contractor (two steps) -----
          <div className="relative z-10">
            {step === 0 && (
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="grid md:grid-cols-2 gap-8"
              >
                <div className="md:col-span-2 group">
                  <label className={labelCls} style={{ color: "var(--color-secondary)" }}>
                    <span className="flex items-center gap-2">
                      👤 Full Name <span style={{ color: "var(--color-secondary)" }} className="text-lg">*</span>
                    </span>
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={fieldCls}
                    style={{ borderColor: "var(--color-primary)", "--tw-ring-color": "var(--color-primary)" } as React.CSSProperties}
                    placeholder="Enter your full name"
                  />
                  {submitted && errors.fullName && (
                    <motion.p 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={errorText}
                      style={{ color: "var(--color-secondary)" }}
                    >
                      <span>⚠️</span> {errors.fullName}
                    </motion.p>
                  )}
                </div>

                <div className="group">
                  <label className={labelCls} style={{ color: "var(--color-secondary)" }}>
                    <span className="flex items-center gap-2">
                      📧 Email <span style={{ color: "var(--color-secondary)" }} className="text-lg">*</span>
                    </span>
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={fieldCls}
                    style={{ borderColor: "var(--color-primary)", "--tw-ring-color": "var(--color-primary)" } as React.CSSProperties}
                    placeholder="name@example.com"
                  />
                  {submitted && errors.email && (
                    <motion.p 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={errorText}
                      style={{ color: "var(--color-secondary)" }}
                    >
                      <span>⚠️</span> {errors.email}
                    </motion.p>
                  )}
                </div>

                <div className="group">
                  <label className={labelCls} style={{ color: "var(--color-secondary)" }}>
                    <span className="flex items-center gap-2">
                      📱 Phone <span style={{ color: "var(--color-secondary)" }} className="text-lg">*</span>
                    </span>
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="tel"
                    name="phone"
                    value={(formData as any).phone}
                    onChange={handleChange}
                    className={fieldCls}
                    style={{ borderColor: "var(--color-primary)", "--tw-ring-color": "var(--color-primary)" } as React.CSSProperties}
                    placeholder="+591 7xx xxx xx"
                    inputMode="tel"
                  />
                  {submitted && errors.phone && (
                    <motion.p 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={errorText}
                      style={{ color: "var(--color-secondary)" }}
                    >
                      <span>⚠️</span> {errors.phone}
                    </motion.p>
                  )}
                </div>

                <div className="group">
                  <label className={labelCls} style={{ color: "var(--color-secondary)" }}>
                    <span className="flex items-center gap-2">
                      🔒 Password <span style={{ color: "var(--color-secondary)" }} className="text-lg">*</span>
                    </span>
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={fieldCls}
                    style={{ borderColor: "var(--color-primary)", "--tw-ring-color": "var(--color-primary)" } as React.CSSProperties}
                    placeholder="Minimum 6 characters"
                  />
                  {submitted && errors.password && (
                    <motion.p 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={errorText}
                      style={{ color: "var(--color-secondary)" }}
                    >
                      <span>⚠️</span> {errors.password}
                    </motion.p>
                  )}
                </div>

                <div className="group">
                  <label className={labelCls} style={{ color: "var(--color-secondary)" }}>
                    <span className="flex items-center gap-2">
                      🔐 Confirm Password <span style={{ color: "var(--color-secondary)" }} className="text-lg">*</span>
                    </span>
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={fieldCls}
                    style={{ borderColor: "var(--color-primary)", "--tw-ring-color": "var(--color-primary)" } as React.CSSProperties}
                    placeholder="Type password again"
                  />
                  {submitted && errors.confirmPassword && (
                    <motion.p 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={errorText}
                      style={{ color: "var(--color-secondary)" }}
                    >
                      <span>⚠️</span> {errors.confirmPassword}
                    </motion.p>
                  )}
                </div>

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
                    onChange={handleMultiSelectChange}
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
                      className={errorText}
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
                    onClick={handleNext}
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
                <div className="group">
                  <label className={labelCls} style={{ color: "var(--color-secondary)" }}>
                    <span className="flex items-center gap-2">
                      🏢 Company <span style={{ color: "var(--color-secondary)" }} className="text-lg">*</span>
                    </span>
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="text"
                    name="company"
                    value={(formData as any).company}
                    onChange={handleChange}
                    className={fieldCls}
                    style={{ borderColor: "var(--color-primary)", "--tw-ring-color": "var(--color-primary)" } as React.CSSProperties}
                    placeholder="Your company name"
                  />
                  {submitted && errors.company && (
                    <motion.p 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={errorText}
                      style={{ color: "var(--color-secondary)" }}
                    >
                      <span>⚠️</span> {errors.company}
                    </motion.p>
                  )}
                </div>

                <div className="group">
                  <label className={labelCls} style={{ color: "var(--color-secondary)" }}>
                    <span className="flex items-center gap-2">
                      📋 License Number <span style={{ color: "var(--color-secondary)" }} className="text-lg">*</span>
                    </span>
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="text"
                    name="licenseNumber"
                    value={(formData as any).licenseNumber}
                    onChange={handleChange}
                    className={fieldCls}
                    style={{ borderColor: "var(--color-primary)", "--tw-ring-color": "var(--color-primary)" } as React.CSSProperties}
                    placeholder="Registration/License #"
                  />
                  {submitted && errors.licenseNumber && (
                    <motion.p 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={errorText}
                      style={{ color: "var(--color-secondary)" }}
                    >
                      <span>⚠️</span> {errors.licenseNumber}
                    </motion.p>
                  )}
                </div>

                <div className="md:col-span-2 group">
                  <label className={labelCls} style={{ color: "var(--color-secondary)" }}>
                    <span className="flex items-center gap-2">
                      🛠️ Services <span className="text-sm" style={{ color: "var(--color-primary)", opacity: 0.75 }}>(optional)</span>
                    </span>
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="text"
                    name="services"
                    value={(formData as any).services}
                    onChange={handleChange}
                    className={fieldCls}
                    style={{ borderColor: "var(--color-primary)", "--tw-ring-color": "var(--color-primary)" } as React.CSSProperties}
                    placeholder="e.g., Plumbing, Electrical, HVAC"
                  />
                </div>

                <div className="group">
                  <label className={labelCls} style={{ color: "var(--color-secondary)" }}>
                    <span className="flex items-center gap-2">
                      📅 Experience <span className="text-sm" style={{ color: "var(--color-primary)", opacity: 0.75 }}>(years)</span>
                    </span>
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="number"
                    name="yearsOfExperience"
                    value={(formData as any).yearsOfExperience}
                    onChange={handleChange}
                    className={fieldCls}
                    style={{ borderColor: "var(--color-primary)", "--tw-ring-color": "var(--color-primary)" } as React.CSSProperties}
                    placeholder="5"
                    min="0"
                    max="50"
                  />
                </div>

                <div className="group">
                  <label className={labelCls} style={{ color: "var(--color-secondary)" }}>
                    <span className="flex items-center gap-2">
                      🌟 Portfolio URL <span className="text-sm" style={{ color: "var(--color-primary)", opacity: 0.75 }}>(optional)</span>
                    </span>
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="url"
                    name="portfolioUrl"
                    value={(formData as any).portfolioUrl}
                    onChange={handleChange}
                    className={fieldCls}
                    style={{ borderColor: "var(--color-primary)", "--tw-ring-color": "var(--color-primary)" } as React.CSSProperties}
                    placeholder="https://your-portfolio.com"
                  />
                </div>

                <div className="md:col-span-2 flex items-center justify-between gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={handlePrev}
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
        )}

        {/* Notes / Footnote */}
        <div className="relative z-10 mt-8 pt-4 border-t-2 flex items-center justify-between gap-4" style={{ borderColor: "var(--color-primary)", opacity: 0.3 }}>
          <div className="text-sm font-medium" style={{ color: "var(--color-secondary)", opacity: 0.8 }}>
            Fields marked with <span style={{ color: "var(--color-secondary)" }} className="font-bold">*</span> are required.
          </div>
          {userType === "ownerHome" && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
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
          )}
        </div>

        {/* Success message */}
        {submitted && Object.keys(errors).length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="relative z-10 mt-6 text-base font-bold rounded-2xl p-6 shadow-xl border-2 relative overflow-hidden backdrop-blur-sm"
            style={{
              color: "var(--color-secondary)",
              backgroundColor: "var(--color-primary)",
              opacity: 0.95,
              borderColor: "var(--color-primary)",
            }}
          >
            <div 
              className="absolute inset-0 pointer-events-none" 
              style={{ backgroundColor: "var(--color-secondary)", opacity: 0.1 }}
            />
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="absolute -top-3 -right-3 w-12 h-12 rounded-full flex items-center justify-center text-xl"
              style={{ backgroundColor: "var(--color-secondary)" }}
            >
              🎉
            </motion.div>
            <div className="relative flex items-center gap-3">
              <motion.span 
                className="text-3xl animate-bounce"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ✅
              </motion.span>
              <div>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl font-black"
                >
                  Registration Successful!
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xs opacity-80 mt-1"
                >
                  🚀 Your application has been submitted for review. We'll contact you soon!
                </motion.div>
              </div>
            </div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.6, duration: 2 }}
              className="absolute bottom-0 left-0 h-1 rounded-full"
              style={{ backgroundColor: "var(--color-secondary)" }}
            />
          </motion.div>
        )}
      </motion.form>
    </div>
  );
};

export default CertificationRequestForm_SignupStepper;
