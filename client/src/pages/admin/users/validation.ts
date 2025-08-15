import * as yup from 'yup';

export const userStoreSchema = yup.object().shape({
  first_name: yup.string()
    .required('El nombre es requerido')
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(50, 'El nombre no puede exceder los 50 caracteres'),
  last_name: yup.string()
    .required('El apellido es requerido')
    .min(3, 'El apellido debe tener al menos 3 caracteres')
    .max(50, 'El apellido no puede exceder los 50 caracteres'),
  email: yup.string()
    .required('El email es requerido')
    .email('Ingresa un email válido')
    .max(100, 'El email no puede exceder los 100 caracteres'),
  password: yup.string()
    .required('La contraseña es requerida')
    .min(5, 'La contraseña debe tener al menos 5 caracteres'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Las contraseñas no coinciden')
    .required('Debes confirmar tu contraseña'),
  role_id: yup.string()
    .nullable()
    .notRequired(),
});

export const userUpdateSchema = yup.object().shape({
  first_name: yup.string()
    .required('El nombre es requerido')
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(50, 'El nombre no puede exceder los 50 caracteres'),
  last_name: yup.string()
    .required('El apellido es requerido')
    .min(3, 'El apellido debe tener al menos 3 caracteres')
    .max(50, 'El apellido no puede exceder los 50 caracteres'),
  email: yup.string()
    .required('El email es requerido')
    .email('Ingresa un email válido')
    .max(100, 'El email no puede exceder los 100 caracteres'),
  password: yup.string()
    .transform(value => value === "" ? null : value)
    .nullable()
    .notRequired()
    .min(5, 'La contraseña debe tener al menos 5 caracteres'),
  role_id: yup.string()
    .nullable()
    .notRequired(),
});