import { useFormContext } from 'react-hook-form';

interface CheckboxFieldProps {
  name: string;
  label: string;
  className?: string;
}

export const CheckboxField = ({ name, label, className = '' }: CheckboxFieldProps) => {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name];

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center">
        <input
          type="checkbox"
          id={name}
          {...register(name)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
        />
        <label htmlFor={name} className="ml-2 block text-sm text-gray-900 dark:text-gray-100">
          {label}
        </label>
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">
          {error.message as string}
        </p>
      )}
    </div>
  );
};

export default CheckboxField;