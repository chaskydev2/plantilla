import * as yup from 'yup';

export const AttributeStoreSchema = yup.object().shape({
  name: yup.string()
    .required('Name is required')
    .min(2, 'Name must have at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  slug: yup.string()
    .optional()
    .max(120, 'Slug cannot exceed 120 characters')
    .matches(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers and hyphens'),
  description: yup.string()
    .optional()
    .max(500, 'Description cannot exceed 500 characters'),
  required_for: yup.string()
    .required('Required for is required')
    .oneOf(['homeowner', 'contractor', 'both'], 'Invalid required for value')
});

export const AttributeUpdateSchema = yup.object().shape({
  name: yup.string()
    .optional()
    .min(2, 'Name must have at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  slug: yup.string()
    .optional()
    .max(120, 'Slug cannot exceed 120 characters')
    .matches(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers and hyphens'),
  description: yup.string()
    .optional()
    .max(500, 'Description cannot exceed 500 characters'),
  required_for: yup.string()
    .optional()
    .oneOf(['homeowner', 'contractor', 'both'], 'Invalid required for value')
});