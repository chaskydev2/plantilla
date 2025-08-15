import * as yup from "yup";

export const userStoreSchema = yup.object().shape({
  first_name: yup.string().required("El nombre es requerido").min(3).max(50),
  last_name: yup.string().required("El apellido es requerido").min(3).max(50),
  email: yup.string().required("El email es requerido").email().max(100),
  
  password: yup
    .string()
    .transform(value => !value ? null : value)
    .nullable()
    .notRequired()
    .min(5, "La contraseña debe tener al menos 5 caracteres"),

  confirmPassword: yup
    .string()
    .transform(value => !value ? null : value)
    .when('password', {
      is: (value: any) => value != null,
      then: (schema) => schema
        .required("Confirma tu contraseña")
        .oneOf([yup.ref('password')], "Las contraseñas deben coincidir"),
      otherwise: (schema) => schema.notRequired()
    }),
});