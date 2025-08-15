import React, { useEffect, useState, useRef } from "react";
import { useFormContext } from "react-hook-form";

interface MultiSelectFieldProps<T = any>
  extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  label?: string;
  options: T[];
  valueKey?: keyof T;
  labelKey?: string;
  helperText?: string;
  placeholder?: string;
  isMulti?: boolean;
  showSelectAll?: boolean;
}

const MultiSelectField = <T extends Record<string, any>>({
  name,
  label,
  options,
  valueKey = "value" as keyof T,
  labelKey = "label",
  helperText,
  placeholder,
  isMulti = true,
  showSelectAll = true,
  className = "",
  ...props
}: MultiSelectFieldProps<T>) => {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext();

  const selectedValues = watch(name) || [];
  const error = errors[name];
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar el dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredOptions = options.filter((option) =>
    String(option[labelKey]).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleOption = (value: any) => {
    let newValues;
    if (selectedValues.includes(value)) {
      newValues = selectedValues.filter((v: any) => v !== value);
    } else {
      newValues = [...selectedValues, value];
    }
    setValue(name, newValues, { shouldValidate: true });
  };

  const removeOption = (value: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const newValues = selectedValues.filter((v: any) => v !== value);
    setValue(name, newValues, { shouldValidate: true });
  };

  const selectAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    const allValues = filteredOptions.map((option) => option[valueKey]);
    setValue(name, allValues, { shouldValidate: true });
  };

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    setValue(name, [], { shouldValidate: true });
  };

  const getOptionLabel = (value: any) => {
    const option = options.find(
      (opt) => String(opt[valueKey]) === String(value)
    );
    return option ? option[labelKey] : value;
  };

  useEffect(() => {
    if (isMulti && selectedValues === undefined) {
      setValue(name, []);
    }
  }, [isMulti, name, selectedValues, setValue]);

  const allSelected =
    filteredOptions.length > 0 &&
    filteredOptions.every((option) =>
      selectedValues.includes(option[valueKey])
    );

  const someSelected =
    filteredOptions.length > 0 &&
    filteredOptions.some((option) =>
      selectedValues.includes(option[valueKey])
    ) &&
    !allSelected;

  const toggleSelectAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (allSelected) {
      clearAll(e);
    } else {
      selectAll(e);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef} {...props}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}

      <div
        className={`min-h-10 h-29 p-2 border dark:bg-gray-800 rounded-md cursor-pointer overflow-y-auto ${
          error ? "border-red-500" : "border-gray-300 dark:border-gray-600"
        } ${isOpen ? "ring-2 ring-blue-500" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-2">
          {selectedValues.length > 0 ? (
            selectedValues.map((value: any) => (
              <span
                key={value}
                className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-sm"
              >
                {getOptionLabel(value)}
                <button
                  type="button"
                  onClick={(e) => removeOption(value, e)}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-600 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-700"
                >
                  ×
                </button>
              </span>
            ))
          ) : (
            <span className="text-gray-500 dark:text-gray-400">
              {placeholder || "Select options..."}
            </span>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-300 dark:border-gray-600 max-h-60 overflow-auto">
          <div className="p-2 sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <input
              type="text"
              placeholder="Search..."
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {showSelectAll && filteredOptions.length > 0 && (
            <div className="border-b border-gray-200 dark:border-gray-700">
              <div
                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  allSelected ? "bg-blue-50 dark:bg-blue-900" : ""
                }`}
                onClick={toggleSelectAll}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    readOnly
                    className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected;
                    }}
                  />
                  <span className="font-medium">
                    {allSelected ? "Quitar todo" : "Seleccionar todo"}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="py-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={String(option[valueKey])}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    selectedValues.includes(option[valueKey])
                      ? "bg-blue-50 dark:bg-blue-900"
                      : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleOption(option[valueKey]);
                  }}
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedValues.includes(option[valueKey])}
                      readOnly
                      className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                    />
                    <span>{option[labelKey]}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500 dark:text-gray-400">
                No options found
              </div>
            )}
          </div>
        </div>
      )}

      <input type="hidden" {...register(name)} />

      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error.message?.toString()}
        </p>
      )}
    </div>
  );
};

export default MultiSelectField;
