import * as yup from 'yup';

export const ProfessionStoreSchema = yup.object().shape({
  name: yup.string()
    .required('El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  slug: yup.string()
    .optional()
    .max(120, 'El slug no puede exceder 120 caracteres')
    .matches(/^[a-z0-9-]+$/, 'El slug solo puede contener letras minúsculas, números y guiones'),
  description: yup.string()
    .optional()
    .max(500, 'La descripción no puede exceder 500 caracteres')
});

export const ProfessionUpdateSchema = yup.object().shape({
  name: yup.string()
    .optional()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  slug: yup.string()
    .optional()
    .max(120, 'El slug no puede exceder 120 caracteres')
    .matches(/^[a-z0-9-]+$/, 'El slug solo puede contener letras minúsculas, números y guiones'),
  description: yup.string()
    .optional()
    .max(500, 'La descripción no puede exceder 500 caracteres')
});