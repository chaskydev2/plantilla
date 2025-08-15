import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  helperText?: string;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  name,
  label,
  helperText,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  return (
    <fieldset className={`fieldset ${className}`}>
      {label && (
        <legend className="fieldset-legend dark:text-gray-400 dark:bg-transparent text-gray-900">
          {label}
        </legend>
      )}
      <div className="relative">
        <input
          id={name}
          type={showPassword ? 'text' : 'password'}
          {...register(name)}
          {...props}
          className={`input w-full border border-gray-300 ${error ? 'border-red-500' : ''
            } bg-white text-black dark:text-gray-100  dark:bg-gray-800`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <button
          type="button"
          className={`absolute inset-y-0 right-0 pr-3 flex items-center ${isFocused ? 'text-primary' : 'text-gray-500'
            }`}
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>
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

export default PasswordField;