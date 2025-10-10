import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// ===================== Multi-Select Component =====================
export interface MultiSelectOption {
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

export const MultiSelectField: React.FC<MultiSelectFieldProps> = ({
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