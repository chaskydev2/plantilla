import React from 'react';
import { useFormContext } from 'react-hook-form';

interface SwitchFieldProps {
  name: string;
  label?: string;
  helperText?: string;
  className?: string;
  disabled?: boolean;
}

const SwitchField: React.FC<SwitchFieldProps> = ({
  name,
  label,
  helperText,
  className = '',
  disabled = false,
}) => {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext();

  const value = watch(name);
  const error = errors[name];

  return (
    <div className={`form-control ${className}`}>
      <label className="label cursor-pointer justify-start gap-4">
        <span className="label-text">{label}</span>
        <input
          type="checkbox"
          id={name}
          {...register(name)}
          disabled={disabled}
          className={`toggle ${error ? 'toggle-error' : ''} ${value ? 'toggle-success' : 'bg-white text-black dark:text-gray-100  dark:bg-gray-800'}`}
        />
      </label>
      
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
    </div>
  );
};

export default SwitchField;