import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import type { SubmitHandler, FieldValues, DefaultValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface FormProviderWrapperProps<T extends FieldValues> {
  children: React.ReactNode;
  onSubmit: SubmitHandler<T>;
  validationSchema: yup.ObjectSchema<any>;
  defaultValues?: DefaultValues<T>;
  className?: string;
  mode?: 'create' | 'edit';
}

export const FormProviderWrapper = <T extends FieldValues>({
  children,
  onSubmit,
  validationSchema,
  defaultValues,
  className = '',
  mode = 'create',
}: FormProviderWrapperProps<T>) => {
  const methods = useForm<T>({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const handleError = (error: any) => {
    console.log("error ", error);
  };
  
  return (
    <FormProvider {...methods}>
      <form 
        onSubmit={methods.handleSubmit(onSubmit, handleError)} 
        className={`card ${className}`}
      >
        <div className="card-body">
          {children}
          <div className="card-actions justify-end mt-4">
            <button 
              type="submit" 
              className={`
                bg-gray-600 text-white font-bold 
                flex items-center justify-center gap-2 
                rounded-xl py-3 px-10 
                hover:bg-gray-700 
                hover:shadow-2xl 
                transform hover:scale-105 
                transition-all duration-300
                w-full sm:w-auto
                border-none
                focus:outline-none
              `}
              disabled={methods.formState.isSubmitting}
            >
              {methods.formState.isSubmitting ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Procesando...
                </>
              ) : mode === 'create' ? 'Crear' : 'Actualizar'}
            </button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};