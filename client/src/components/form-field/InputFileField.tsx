import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { X, Image as ImageIcon, UploadCloud } from 'lucide-react';

interface InputFileFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  helperText?: string;
  accept?: string;
  maxSize?: number; // in bytes
}

const InputFileField: React.FC<InputFileFieldProps> = ({
  name,
  label,
  helperText,
  className = '',
  accept = 'image/*',
  maxSize = 4 * 1024 * 1024, // 4MB default
  ...props
}) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileValue = watch(name);

  const processFile = useCallback((file: File) => {
     if (file.size > maxSize) {
      setValue(name, null, { shouldValidate: true });
      return;
    }
 
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
      setValue(name, reader.result, { shouldValidate: true });
    };
    reader.readAsDataURL(file);
  }, [maxSize, name, setValue]);

  useEffect(() => {
    if (!fileValue) {
      setPreview(null);
      return;
    }

    if (typeof fileValue === 'string') {
      setPreview(fileValue);
      return;
    }

    if (fileValue instanceof FileList && fileValue.length > 0) {
      processFile(fileValue[0]);
    }
  }, [fileValue, processFile]);

  const handleDelete = () => {
    setPreview(null);
    setValue(name, null, { shouldValidate: true });
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("e ", e.target.files);
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const error = errors[name];

  return (
    <fieldset className={`fieldset ${className}`}>
      {label && (
        <legend className="fieldset-legend dark:text-gray-400 dark:bg-transparent text-gray-900">
          {label}
        </legend>
      )}

      <input
        id={name}
        type="file"
        accept={accept}
        {...register(name, {
          onChange: handleFileChange,
        })}
        {...props}
        ref={inputRef}
        className="hidden"
      />

      {preview ? (
        <div className="relative mt-2">
          <div className="group relative inline-block">
            <img
              src={preview}
              alt="Preview"
              className="h-32 w-32 object-cover rounded-md border border-gray-300"
              onError={() => setPreview(null)}
            />
            <button
              type="button"
              onClick={handleDelete}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Remove image"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md cursor-pointer transition-colors ${
            isDragging
              ? 'border-success bg-success/10'
              : 'border-gray-300 dark:border-gray-600'
          }`}
          onClick={() => inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="space-y-1 text-center">
            <div className="flex justify-center text-gray-400">
              {isDragging ? <UploadCloud size={24} /> : <ImageIcon size={24} />}
            </div>
            <div className="flex flex-col text-sm text-gray-600 dark:text-gray-300">
              <span className="font-medium">
                {isDragging ? 'Suelta la imagen aquí' : 'Haz clic para subir'}
              </span>
              <span className="text-xs mt-1">o arrastra y suelta</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {helperText || `Formatos: ${accept} (max ${maxSize / 1024 / 1024}MB)`}
            </p>
          </div>
        </div>
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

export default InputFileField;