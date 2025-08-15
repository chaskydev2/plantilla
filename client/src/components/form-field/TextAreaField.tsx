import React from 'react';
import { useFormContext } from 'react-hook-form';

interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  label?: string;
  helperText?: string;
  rows?: number;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
  showCharCount?: boolean;
  maxLength?: number;
}

const TextareaField: React.FC<TextareaFieldProps> = ({
  name,
  label,
  helperText,
  className = '',
  rows = 3,
  resize = 'vertical',
  showCharCount = false,
  maxLength,
  ...props
}) => {
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
      <textarea
        id={name}
        {...register(name)}
        {...props}
        rows={rows}
        maxLength={maxLength}
        style={{ resize }}
          className={`textarea w-full border border-gray-300 ${error ? 'border-red-500' : ''
            } bg-white text-black dark:text-gray-100  dark:bg-gray-800`}
      />
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

export default TextareaField;