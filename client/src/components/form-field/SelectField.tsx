import React from 'react';
import { useFormContext } from 'react-hook-form';

interface SelectFieldProps<T = any> extends React.SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  label?: string;
  options: T[];
  valueKey?: keyof T;
  labelKey?: string;
  helperText?: string;
  placeholder?: string;
  
}

const SelectField = <T extends Record<string, any>>({
  name,
  label,
  options,
  valueKey = 'value' as keyof T,
  labelKey = 'label',
  helperText,
  placeholder,
  className = '',
  ...props
}: SelectFieldProps<T>) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  return (
    <fieldset className={`fieldset ${className}`}>
      {label && (
        <legend className="fieldset-legend dark:text-gray-400  dark:bg-transparent text-gray-900">{label}</legend>
      )}
      
      <select
        id={name}
        {...register(name)}
        {...props}
        className={`select w-full border border-gray-300 ${
          error ? 'select-error' : ''
        } bg-white text-black dark:text-gray-100  dark:bg-gray-800`}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((item) => (
          <option
            key={String(item[valueKey])}
            value={item[valueKey]}
          >
            {item[labelKey]}
          </option>
        ))}
      </select>
      
      {helperText && !error && (
        <label className="label">
          <span className="label-text-alt">{helperText}</span>
        </label>
      )}
      {error && (
        <label className="label">
          <span className="label-text-alt text-error">
            {error.message?.toString()}
          </span>
        </label>
      )}
    </fieldset>
  );
};

export default SelectField;