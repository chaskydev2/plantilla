import * as yup from "yup";

export const imageSchema = yup
  .mixed()
  .test("file-size", "Maximum file size is 4MB", (value) => {
    if (!value) return true;

    if (typeof value === "string") {
      const isBase64Image = value.startsWith("data:image/");
      const isImageUrl = /\.(jpe?g|png|gif|webp)$/i.test(value.split('?')[0]);
      return isBase64Image || isImageUrl;
    }

    if (value instanceof File) {
      return value.size <= 4 * 1024 * 1024;
    }

    return false;
  });

export const HistoryStoreSchema = yup.object().shape({
  title: yup
    .string()
    .required("Title is required")
    .max(100, "Title cannot exceed 100 characters"),
  description: yup
    .string()
    .optional()
    .max(2000, "Description cannot exceed 2000 characters"),
  content: yup
    .string()
    .optional()
    .max(2000, "Content cannot exceed 2000 characters"),
  banner1: imageSchema.optional(),
  banner2: imageSchema.optional(),
  banner3: imageSchema.optional(),
});

export const HistoryUpdateSchema = yup.object().shape({
  title: yup
    .string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters"),
  description: yup
    .string()
    .optional()
    .max(2000, "Description cannot exceed 2000 characters"),
  content: yup
    .string()
    .optional()
    .max(2000, "Content cannot exceed 2000 characters"),
  banner1: imageSchema.optional(),
  banner2: imageSchema.optional(),
  banner3: imageSchema.optional(),
});
