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

export const AgreementStoreSchema = yup.object().shape({
  name: yup
    .string()
    .required("El nombre es requerido")
    .max(100, "El nombre no puede exceder los 100 caracteres"),
  description: yup
    .string()
    .required("La descripción es requerida")
    .max(2000, "La descripción no puede exceder los 2000 caracteres"),
  photo: imageSchema,
});

export const AgreementUpdateSchema = yup.object().shape({
  name: yup
    .string()
    .required("El nombre es requerido")
    .max(100, "El nombre no puede exceder los 100 caracteres"),
  description: yup
    .string()
    .required("La descripción es requerida")
    .max(2000, "La descripción no puede exceder los 2000 caracteres"),
  photo: imageSchema,
});
