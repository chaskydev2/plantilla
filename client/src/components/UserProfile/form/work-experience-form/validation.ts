import * as yup from 'yup';

export const profileStoreSchema = yup.object().shape({
  company_name: yup
    .string()
    .required('El nombre de la empresa/institución es requerido')
    .min(3, 'Debe tener al menos 3 caracteres')
    .max(150, 'No puede exceder los 150 caracteres'),

  company_location: yup
    .string()
    .required('La ubicación (ciudad/departamento) es requerida')
    .min(3, 'Debe tener al menos 3 caracteres')
    .max(100, 'No puede exceder los 100 caracteres'),

  start_date: yup
    .date()
    .required('La fecha de inicio es requerida'),

  end_date: yup
    .date()
    .nullable(),

  position: yup
    .string()
    .required('El cargo/función es requerido')
    .min(3, 'Debe tener al menos 3 caracteres')
    .max(100, 'No puede exceder los 100 caracteres'),

  responsibilities: yup
    .string()
    .required('Las tareas realizadas son requeridas')
    .min(10, 'Debe describir al menos 10 caracteres')
    .max(1000, 'No puede exceder los 1000 caracteres'),
});

export const profileUpdateSchema = profileStoreSchema.clone().shape({
    company_name: yup
    .string()
    .required('El nombre de la empresa/institución es requerido')
    .min(3, 'Debe tener al menos 3 caracteres')
    .max(150, 'No puede exceder los 150 caracteres'),

  company_location: yup
    .string()
    .required('La ubicación (ciudad/departamento) es requerida')
    .min(3, 'Debe tener al menos 3 caracteres')
    .max(100, 'No puede exceder los 100 caracteres'),

  start_date: yup
    .date()
    .required('La fecha de inicio es requerida'),

  end_date: yup
    .date()
    .nullable(),

  position: yup
    .string()
    .required('El cargo/función es requerido')
    .min(3, 'Debe tener al menos 3 caracteres')
    .max(100, 'No puede exceder los 100 caracteres'),

  responsibilities: yup
    .string()
    .required('Las tareas realizadas son requeridas')
    .min(10, 'Debe describir al menos 10 caracteres')
    .max(1000, 'No puede exceder los 1000 caracteres'),
});