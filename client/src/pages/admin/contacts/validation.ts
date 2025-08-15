import * as yup from "yup";

export const ContactStoreSchema = yup.object().shape({
  address: yup
    .string()
    .required("La direccion es requerida")
    .max(200, "la dirreccion no puede exceder los 200 caracteres"),
  mobile_number: yup
    .string()
    .required("El número de celular es requerido")
    .max(20, "El número de celular no puede exceder los 20 caracteres"),
  phone_number: yup
    .string()
    .required("El número de teléfono es requerido")
    .max(20, "El número de teléfono no puede exceder los 20 caracteres"),
  email: yup
    .string()
    .required("El correo electrónico es requerido")
    .max(200, "El correo electrónico no puede exceder los 200 caracteres"),
  business_hours: yup
    .string()
    .required("El horario laboral es requerido")
    .max(2000, "El horario laboral no puede exceder los 2000 caracteres"),
});

export const ContactUpdateSchema = yup.object().shape({
  address: yup
    .string()
    .required("La direccion es requerida")
    .max(200, "la direccion no puede exceder los 200 caracteres"),
  mobile_number: yup
    .string()
    .required("El número de celular es requerido")
    .max(20, "El número de celular no puede exceder los 20 caracteres"),
  phone_number: yup
    .string()
    .required("El número de teléfono es requerido")
    .max(20, "El número de teléfono no puede exceder los 20 caracteres"),
  email: yup
    .string()
    .required("El correo electrónico es requerido")
    .max(200, "El correo electrónico no puede exceder los 200 caracteres"),
  business_hours: yup
    .string()
    .required("El horario laboral es requerido")
    .max(2000, "El horario laboral no puede exceder los 2000 caracteres"),
});
