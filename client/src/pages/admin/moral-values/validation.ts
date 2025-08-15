import * as yup from "yup";
export const MoralValueStoreSchema = yup.object().shape({
  title: yup
    .string()
    .required("El titulo es requerido")
    .max(100, "El titulo no puede exceder los 100 caracteres"),
  description: yup
    .string()
    .required("La descripción es requerida")
    .max(2000, "La descripción no puede exceder los 2000 caracteres"),
});

export const MoralValueUpdateSchema = yup.object().shape({
  title: yup
    .string()
    .required("El titulo es requerido")
    .max(100, "El titulo no puede exceder los 100 caracteres"),
  description: yup
    .string()
    .required("La descripción es requerida")
    .max(2000, "La descripción no puede exceder los 2000 caracteres"),
});
