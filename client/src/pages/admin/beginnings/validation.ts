import * as yup from "yup";

export const BeginningStoreSchema = yup.object().shape({
  mission: yup
    .string()
    .required("La misión es requerida")
    .max(200, "La misión no puede exceder los 200 caracteres"),
  vision: yup
    .string()
    .required("La visión es requerida")
    .max(2000, "La visión no puede exceder los 2000 caracteres"),
  our_father: yup
    .string()
    .required("El Padre Nuestro es requerido")
    .max(2000, "El Padre Nuestro no puede exceder los 2000 caracteres"),
});

export const BeginningUpdateSchema = yup.object().shape({
  mission: yup
    .string()
    .required("La misión es requerida")
    .max(2000, "La misión no puede exceder los 2000 caracteres"),
  vision: yup
    .string()
    .required("La visión es requerida")
    .max(2000, "La visión no puede exceder los 2000 caracteres"),
  our_father: yup
    .string()
    .required("El Padre Nuestro es requerido")
    .max(2000, "El Padre Nuestro no puede exceder los 2000 caracteres"),
});
