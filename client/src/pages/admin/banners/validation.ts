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

export const BannerStoreSchema = yup.object().shape({
  title: yup
    .string()
    .required("El título es requerido")
    .max(100, "El título no puede exceder los 100 caracteres"),
  subtitle: yup
    .string()
    .required("El subtítulo es requerido")
    .max(2000, "El subtítulo no puede exceder los 2000 caracteres"),
  image: imageSchema,
});

export const BannerUpdateSchema = yup.object().shape({
  title: yup
    .string()
    .required("El título es requerido")
    .max(100, "El título no puede exceder los 100 caracteres"),
  subtitle: yup
    .string()
    .required("El subtítulo es requerido")
    .max(2000, "El subtítulo no puede exceder los 2000 caracteres"),
  image: imageSchema,
});
