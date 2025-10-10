import React from "react";
import { motion } from "framer-motion";

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  icon?: string;
  required?: boolean;
  error?: string;
  submitted?: boolean;
  inputMode?: string;
  min?: string;
  max?: string;
  hasIcon?: boolean;
}

const fieldCls = "w-full border-2 rounded-xl px-5 py-4 text-gray-900 shadow-lg outline-none bg-white/90 backdrop-blur-sm transition-all duration-300 hover:shadow-xl focus:shadow-2xl focus:scale-[1.01] hover:bg-white/95";
const labelCls = "block text-sm font-bold mb-3 tracking-wide";
const errorText = "text-sm text-red-600 mt-2 font-medium flex items-center gap-2 animate-pulse";

export const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  icon,
  required = false,
  error,
  submitted = false,
  inputMode,
  min,
  max,
  hasIcon = false
}) => {
  return (
    <div className="group">
      <label className={labelCls} style={{ color: "var(--color-secondary)" }}>
        <span className="flex items-center gap-2">
          {icon && <span>{icon}</span>} {label}
          {required && (
            <span style={{ color: "var(--color-secondary)" }} className="text-lg animate-pulse">*</span>
          )}
        </span>
      </label>
      
      <div className="relative">
        <motion.input
          whileFocus={{ scale: 1.02, borderColor: "var(--color-secondary)" }}
          whileHover={{ scale: 1.005 }}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className={`${fieldCls} ${hasIcon ? 'pl-12' : ''}`}
          style={{ borderColor: "var(--color-primary)", "--tw-ring-color": "var(--color-primary)" } as React.CSSProperties}
          placeholder={placeholder}
          inputMode={inputMode as any}
          min={min}
          max={max}
        />
        {hasIcon && icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">
            {icon}
          </div>
        )}
      </div>
      
      {submitted && error && (
        <motion.p 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className={errorText}
          style={{ color: "var(--color-secondary)" }}
        >
          <span>⚠️</span> {error}
        </motion.p>
      )}
    </div>
  );
};