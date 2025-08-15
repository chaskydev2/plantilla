import * as yup from "yup";


export const eventStoreSchema = yup.object().shape({
  name: yup
    .string()
    .required("El nombre es requerido")
    .max(100, "El nombre no puede exceder los 100 caracteres"),
  event_type_id: yup
    .string()
    .required("El tipo de evento es requerido"),
  start_date: yup
    .string()
    .required("La fecha inicio es requerido"),
  location: yup
    .string()
    .required("La ubicación es requerido")
    .max(200, "La ubicación no puede exceder los 200 caracteres"),
});

export const eventUpdateSchema = yup.object().shape({
  name: yup
    .string()
    .required("El nombre es requerido")
    .max(100, "El nombre no puede exceder los 100 caracteres"),
  event_type_id: yup
    .string()
    .required("El tipo de evento es requerido"),
  start_date: yup
    .string()
    .required("La fecha inicio es requerido"),
  location: yup
    .string()
    .required("La ubicación es requerido")
    .max(200, "La ubicación no puede exceder los 200 caracteres"),
});
