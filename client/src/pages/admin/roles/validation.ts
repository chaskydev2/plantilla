import * as yup from 'yup';

export const rolStoreSchema = yup.object().shape({
  name: yup.string()
    .required('El nombre es requerido')
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(50, 'El nombre no puede exceder los 50 caracteres'),
});

export const rolUpdateSchema = yup.object().shape({
  name: yup.string()
    .required('El nombre es requerido')
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(50, 'El nombre no puede exceder los 50 caracteres'),
});