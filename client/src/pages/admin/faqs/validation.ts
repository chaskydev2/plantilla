import * as yup from "yup";
export const FaqStoreSchema = yup.object().shape({
  question: yup
    .string()
    .required("La pregunta es requerido")
    .max(2000, "El nombre no puede exceder los 2000 caracteres"),
  answer: yup
    .string()
    .required("La respuesta es requerido")
    .max(2000, "El contenido no puede exceder los 2000 caracteres"),
  order: yup
    .number()
    .required("El orden es requerido")
    .min(0, "El orden debe ser un número positivo"),
});

export const FaqUpdateSchema = yup.object().shape({
  question: yup
    .string()
    .required("La pregunta es requerido")
    .max(2000, "El nombre no puede exceder los 2000 caracteres"),
  answer: yup
    .string()
    .required("La respuesta es requerido")
    .max(2000, "El contenido no puede exceder los 2000 caracteres"),
  order: yup
    .number()
    .required("El orden es requerido")
    .min(0, "El orden debe ser un número positivo"),
});
