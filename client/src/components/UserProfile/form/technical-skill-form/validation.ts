import * as yup from 'yup';

export const profileStoreSchema = yup.object().shape({
  skill_type: yup
    .string()
    .required('El tipo de habilidad es requerido')
    .min(3, 'Debe tener al menos 3 caracteres')
    .max(100, 'No puede exceder los 100 caracteres'),

  skill_name: yup
    .string()
    .required('El nombre de la habilidad es requerido')
    .min(3, 'Debe tener al menos 3 caracteres')
    .max(150, 'No puede exceder los 150 caracteres'),

  skill_level: yup
    .string()
    .required('El nivel de dominio es requerido')
    .max(50, 'No puede exceder los 50 caracteres'),

  description: yup
    .string()
    .required('La descripción es requerida')
    .min(3, 'Debe contener al menos 3 caracteres')
    .max(1000, 'No puede exceder los 1000 caracteres'),
});

export const profileUpdateSchema = yup.object().shape({
  skill_type: yup
    .string()
    .min(3, 'Debe tener al menos 3 caracteres')
    .max(100, 'No puede exceder los 100 caracteres')
    .notRequired(),

  skill_name: yup
    .string()
    .min(3, 'Debe tener al menos 3 caracteres')
    .max(150, 'No puede exceder los 150 caracteres')
    .notRequired(),

  skill_level: yup
    .string()
    .max(50, 'No puede exceder los 50 caracteres')
    .notRequired(),

  description: yup
    .string()
    .min(20, 'Debe contener al menos 20 caracteres')
    .max(1000, 'No puede exceder los 1000 caracteres')
    .notRequired(),
});