import * as yup from 'yup';

export const profileStoreSchema = yup.object().shape({
  reference_name: yup
    .string()
    .required('El nombre del referente es requerido')
    .min(3, 'Debe tener al menos 3 caracteres')
    .max(100, 'No puede exceder los 100 caracteres'),

  company: yup
    .string()
    .required('La empresa/institución es requerida')
    .min(3, 'Debe tener al menos 3 caracteres')
    .max(150, 'No puede exceder los 150 caracteres'),

  position: yup
    .string()
    .required('El cargo del referente es requerido')
    .min(3, 'Debe tener al menos 3 caracteres')
    .max(100, 'No puede exceder los 100 caracteres'),

  phone: yup
    .string()
    .required('El teléfono de contacto es requerido')
    .max(15, 'No puede exceder los 15 caracteres'),

  email: yup
    .string()
    .required('El correo electrónico es requerido')
    .email('Ingrese un correo electrónico válido')
    .max(100, 'No puede exceder los 100 caracteres'),

  additional_notes: yup
    .string()
    .nullable()
    .max(500, 'No puede exceder los 500 caracteres')
});

export const profileUpdateSchema = yup.object().shape({
  reference_name: yup
    .string()
    .required('El nombre del referente es requerido')
    .min(3, 'Debe tener al menos 3 caracteres')
    .max(100, 'No puede exceder los 100 caracteres'),

  company: yup
    .string()
    .required('La empresa/institución es requerida')
    .min(3, 'Debe tener al menos 3 caracteres')
    .max(150, 'No puede exceder los 150 caracteres'),

  position: yup
    .string()
    .required('El cargo del referente es requerido')
    .min(3, 'Debe tener al menos 3 caracteres')
    .max(100, 'No puede exceder los 100 caracteres'),

  phone: yup
    .string()
    .required('El teléfono de contacto es requerido')
    .max(15, 'No puede exceder los 15 caracteres'),

  email: yup
    .string()
    .required('El correo electrónico es requerido')
    .email('Ingrese un correo electrónico válido')
    .max(100, 'No puede exceder los 100 caracteres'),

  additional_notes: yup
    .string()
    .nullable()
    .max(500, 'No puede exceder los 500 caracteres')
});