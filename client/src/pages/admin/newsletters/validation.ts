import * as yup from "yup";

export const NewsletterStoreSchema = yup.object().shape({
  name: yup
    .string()
    .required("El nombre es requerido")
    .max(100, "El nombre no puede exceder los 100 caracteres"),
  email: yup
    .string()
    .required("El correo electronico es requerido")
    .max(2000, "El correo electronico no puede exceder los 2000 caracteres"),
  subject: yup
    .string()
    .required("El asunto es requerido")
    .max(2000, "El asunto no puede exceder los 2000 caracteres"),
  content: yup
    .string()
    .required("El contenido es requerido")
    .max(2000, "El contenido no puede exceder los 2000 caracteres"),

});

export const NewsletterUpdateSchema = yup.object().shape({
  name: yup
    .string()
    .required("El nombre es requerido")
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El título no puede exceder los 100 caracteres"),
  email: yup
    .string()
    .required("El correo electronico es requerido")
    .max(2000, "El correo electronico no puede exceder los 2000 caracteres"),
  subject: yup
    .string()
    .required("El asunto es requerido")
    .max(2000, "El asunto no puede exceder los 2000 caracteres"),
  content: yup
    .string()
    .required("El contenido es requerido")
    .max(2000, "El contenido no puede exceder los 2000 caracteres"),

});
