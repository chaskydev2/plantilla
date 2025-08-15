import * as yup from "yup";

export const imageSchema = yup
  .mixed()
  .test("file-size", "El tamaño máximo permitido es 4MB", (value) => {
    if (!value) return true;

    if (typeof value === "string") {
      const isBase64Image = value.startsWith("data:image/");
      const isImageUrl = /\.(jpe?g|png|gif|webp)$/i.test(value.split('?')[0]);
      return isBase64Image || isImageUrl; // Si no cumple, retorna false
    }

    if (value instanceof File) {
      return value.size <= 4 * 1024 * 1024;
    }

    return false;
  });

export const HistoryStoreSchema = yup.object().shape({
  title: yup
    .string()
    .required("El nombre es requerido")
    .max(100, "El nombre no puede exceder los 100 caracteres"),
  description: yup
    .string()
    .required("El contenido es requerido")
    .max(2000, "El contenido no puede exceder los 2000 caracteres"),
  content: yup
    .string()
    .required("El contenido es requerido")
    .max(2000, "El contenido no puede exceder los 2000 caracteres"),
  banner1: imageSchema,
  banner2: imageSchema,
  banner3: imageSchema,
});

export const HistoryUpdateSchema = yup.object().shape({
  title: yup
    .string()
    .required("El nombre es requerido")
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El título no puede exceder los 100 caracteres"),
  description: yup
    .string()
    .required("El contenido es requerido")
    .max(2000, "El contenido no puede exceder los 2000 caracteres"),
  content: yup
    .string()
    .required("El contenido es requerido")
    .max(2000, "El contenido no puede exceder los 2000 caracteres"),
  banner1: imageSchema,
  banner2: imageSchema,
  banner3: imageSchema,
});
