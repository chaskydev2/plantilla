import * as yup from 'yup';

export const CategoryStoreSchema = yup.object().shape({
  name: yup.string()
    .required('Name is required')
    .min(2, 'Name must have at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  slug: yup.string()
    .optional()
    .max(120, 'Slug cannot exceed 120 characters')
    .matches(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers and hyphens'),
  parent_id: yup.number()
    .nullable()
    .optional()
    .positive('Parent ID must be a positive number'),
  description: yup.string()
    .optional()
    .max(500, 'Description cannot exceed 500 characters'),
  icon: yup.string()
    .optional()
    .max(100, 'Icon cannot exceed 100 characters')
});

export const CategoryUpdateSchema = yup.object().shape({
  name: yup.string()
    .optional()
    .min(2, 'Name must have at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  slug: yup.string()
    .optional()
    .max(120, 'Slug cannot exceed 120 characters')
    .matches(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers and hyphens'),
  parent_id: yup.number()
    .nullable()
    .optional()
    .positive('Parent ID must be a positive number'),
  description: yup.string()
    .optional()
    .max(500, 'Description cannot exceed 500 characters'),
  icon: yup.string()
    .optional()
    .max(100, 'Icon cannot exceed 100 characters')
});