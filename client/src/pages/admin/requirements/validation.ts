import * as yup from "yup";

export const RequirementStoreSchema = yup.object().shape({
  title: yup
    .string()
    .required("El nombre es requerido")
    .max(100, "El nombre no puede exceder los 100 caracteres"),
  description: yup
    .string()
    .required("La descripción es requerida")
    .max(2000, "La descripción no puede exceder los 2000 caracteres"),
  type: yup
    .string()
    .required("El tipo es requerido")
    .max(2000, "El tipo no puede exceder los 2000 caracteres"),
  order: yup
    .number()
    .required("El orden es requerido")
    .min(0, "El orden debe ser un número positivo"),
});

export const RequirementUpdateSchema = yup.object().shape({
  title: yup
    .string()
    .required("El nombre es requerido")
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El título no puede exceder los 100 caracteres"),
  description: yup
    .string()
    .required("La descripción es requerida")
    .max(2000, "La descripción no puede exceder los 2000 caracteres"),
  type: yup
    .string()
    .required("El tipo es requerido")
    .max(2000, "El tipo no puede exceder los 2000 caracteres"),
  order: yup
    .number()
    .required("El orden es requerido")
    .min(0, "El orden debe ser un número positivo"),
});
