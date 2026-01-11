import React, { useMemo, useState, useEffect, useRef, useId } from "react";
import { motion } from "framer-motion";
import type { MultiSelectFieldProps } from "./types";
import { cn } from "./utils";

// =========================================
// Multi-Select Component
// =========================================

const Caret: React.FC<{ open: boolean }> = ({ open }) => (
  <motion.svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="ml-2"
    animate={{ rotate: open ? 180 : 0 }}
    transition={{ duration: 0.2 }}
  >
    <path
      d="M6 9l6 6 6-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </motion.svg>
);

const MultiSelectField: React.FC<MultiSelectFieldProps> = ({
  name,
  value,
  onChange,
  options,
  placeholder = "Select options…",
  maxSelections = 2,
  className = "",
  style = {},
  ariaLabel,
  disabled = false,
}) => {
  const id = useId();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const [filter, setFilter] = useState("");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const liveMsgRef = useRef<HTMLDivElement | null>(null);

  const announce = (message: string) => {
    if (!liveMsgRef.current) return;
    liveMsgRef.current.textContent = "";
    setTimeout(() => {
      if (liveMsgRef.current) liveMsgRef.current.textContent = message;
    }, 50);
  };

  const selectedOptions = options.filter((o) => value.includes(o.id));
  const reachedMax = value.length >= maxSelections;

  const filteredOptions = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.name.toLowerCase().includes(q));
  }, [options, filter]);

  // keyboard navigation & close on esc
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        setIsOpen(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => {
          const list = filteredOptions;
          if (list.length === 0) return null;
          if (prev === null) return 0;
          return Math.min(list.length - 1, prev + 1);
        });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => {
          const list = filteredOptions;
          if (list.length === 0) return null;
          if (prev === null) return list.length - 1;
          return Math.max(0, prev - 1);
        });
      } else if (e.key === "Enter") {
        if (activeIndex !== null) {
          e.preventDefault();
          const opt = filteredOptions[activeIndex];
          if (opt) toggleOption(opt.id);
        }
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, activeIndex, filteredOptions]); // ✅ incluye filteredOptions para evitar stale

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchRef.current?.focus(), 0);
      setActiveIndex(null);
    } else {
      setFilter("");
    }
  }, [isOpen]);

  const toggleOption = (optionId: number) => {
    if (value.includes(optionId)) {
      onChange(name, value.filter((id) => id !== optionId));
      announce(`${options.find((o) => o.id === optionId)?.name} eliminado`);
    } else if (value.length < maxSelections) {
      onChange(name, [...value, optionId]);
      announce(`${options.find((o) => o.id === optionId)?.name} añadido`);
    } else {
      announce(`Máximo de ${maxSelections} seleccionados`);
    }
  };

  const removeChip = (optionId: number) => {
    if (value.includes(optionId)) onChange(name, value.filter((id) => id !== optionId));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        whileHover={disabled ? {} : { scale: 1.005 }}
        whileTap={disabled ? {} : { scale: 0.995 }}
        className={cn(
          "w-full min-h-[56px] flex items-center justify-between rounded-xl border-2 px-4 py-3 text-left shadow-sm focus:outline-none",
          disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
          className
        )}
        style={{ borderColor: "var(--color-primary)", background: "white", ...style }}
        onClick={() => !disabled && setIsOpen((o) => !o)}
        aria-controls={`ms-${id}-listbox`}
        aria-label={ariaLabel || placeholder}
        aria-disabled={disabled}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex-1 min-w-0">
            {selectedOptions.length > 0 ? (
              <div className="flex flex-wrap gap-2 items-center min-w-0">
                {selectedOptions.map((option) => (
                  <span
                    key={option.id}
                    className="flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors"
                    style={{
                      borderColor: "var(--color-primary)",
                      color: "var(--color-secondary)",
                      background: "rgba(0,0,0,0.02)",
                      maxWidth: 220,
                    }}
                    title={option.name}
                  >
                    <span className="truncate max-w-[160px]">{option.name}</span>

                    {/* ✅ FIX: No <button> dentro de <button> */}
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeChip(option.id);
                        announce(`${option.name} eliminado`);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          e.stopPropagation();
                          removeChip(option.id);
                          announce(`${option.name} eliminado`);
                        }
                      }}
                      aria-label={`Remove ${option.name}`}
                      className="ml-1 text-[12px] leading-none p-1 rounded hover:bg-gray-100 cursor-pointer select-none"
                      style={{ color: "var(--color-secondary)" }}
                    >
                      ×
                    </span>
                  </span>
                ))}
                <span className="text-xs text-gray-500 ml-1">({selectedOptions.length})</span>
              </div>
            ) : (
              <div className="text-gray-500 text-sm truncate">{placeholder}</div>
            )}
          </div>
        </div>

        <Caret open={isOpen} />
      </motion.button>

      {isOpen && (
        <motion.div
          role="listbox"
          id={`ms-${id}-listbox`}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
          className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border-2 bg-white shadow-2xl"
          style={{ borderColor: "var(--color-primary)" }}
        >
          <div className="px-3 py-2 border-b" style={{ borderColor: "var(--color-primary)" }}>
            <div className="flex items-center gap-2">
              <input
                ref={searchRef}
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Buscar..."
                className="w-full rounded-md px-3 py-2 text-sm border focus:outline-none"
                aria-label="Buscar opciones"
              />
              {filter && (
                <button
                  type="button"
                  onClick={() => setFilter("")}
                  className="text-sm px-3 py-1 rounded"
                  aria-label="Clear search"
                >
                  Limpiar
                </button>
              )}
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto" role="presentation">
            {filteredOptions.length === 0 && (
              <div className="px-4 py-6 text-center text-sm text-gray-500">
                No options available
              </div>
            )}

            {filteredOptions.map((option, idx) => {
              const active = value.includes(option.id);
              const isFocused = activeIndex === idx;

              return (
                <button
                  type="button"
                  key={option.id}
                  role="option"
                  aria-selected={active}
                  aria-disabled={!active && reachedMax}
                  disabled={!active && reachedMax}
                  onClick={() => toggleOption(option.id)}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={cn(
                    "w-full text-left px-4 py-3 border-l-4 transition-colors flex items-center justify-between",
                    active ? "font-semibold" : "hover:bg-gray-50",
                    reachedMax && !active && "opacity-50 cursor-not-allowed"
                  )}
                  style={{
                    color: "var(--color-secondary)",
                    borderLeftColor: active ? "var(--color-secondary)" : "transparent",
                    background: isFocused
                      ? "rgba(0,0,0,0.03)"
                      : active
                      ? "rgba(0,0,0,0.03)"
                      : "transparent",
                  }}
                >
                  <span className="truncate">{option.name}</span>
                  <span className="text-xs" aria-hidden>
                    {active ? "✓" : ""}
                  </span>
                </button>
              );
            })}
          </div>

          <div
            className="px-4 py-2 text-xs border-t flex items-center justify-between"
            style={{ color: "var(--color-secondary)", borderColor: "var(--color-primary)" }}
          >
            <div>
              {reachedMax ? (
                <span>
                  Máximo de {maxSelections} seleccionado{maxSelections > 1 ? "s" : ""}.
                </span>
              ) : (
                <span>{options.length} opciones</span>
              )}
            </div>

            <div>
              <button
                type="button"
                onClick={() => {
                  onChange(name, []);
                  announce("Selección limpiada");
                }}
                className="text-xs px-3 py-1 rounded"
                aria-label="Clear all selections"
              >
                Limpiar
              </button>
            </div>
          </div>

          {/* Live region for announcements */}
          <div aria-live="polite" className="sr-only" ref={liveMsgRef} />
        </motion.div>
      )}
    </div>
  );
};

export default MultiSelectField;
