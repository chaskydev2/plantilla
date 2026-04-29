import * as yup from 'yup';

const slugSchema = yup
  .string()
  .optional()
  .nullable()
  .transform((value) => (value === '' ? null : value))
  .max(255, 'El slug no puede exceder los 255 caracteres')
  .test(
    'is-valid-slug',
    'El slug solo puede contener letras minúsculas, números y guiones',
    (value) => !value || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
  );

export const ServiceStoreSchema = yup.object().shape({
  name: yup
    .string()
    .required('El nombre del servicio es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(255, 'El nombre no puede exceder los 255 caracteres')
    .trim(),
  slug: slugSchema,
  icon: yup.mixed().optional().nullable(),
  image: yup.mixed().optional().nullable(),
});

export const ServiceUpdateSchema = yup.object().shape({
  name: yup
    .string()
    .required('El nombre del servicio es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(255, 'El nombre no puede exceder los 255 caracteres')
    .trim(),
  slug: slugSchema,
  icon: yup.mixed().optional().nullable(),
  remove_icon: yup.boolean().optional(),
  image: yup.mixed().optional().nullable(),
  remove_image: yup.boolean().optional(),
});
