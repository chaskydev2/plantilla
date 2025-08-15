import * as yup from "yup";

export const userStoreSchema = yup.object().shape({
  ci: yup.string().required("El nombre es requerido").min(3).max(20),
  address: yup.string().nullable().max(500),
  mobile_number: yup.string().nullable().max(20),
  phone_number: yup.string().nullable().max(20),
  linkedin_url: yup.string().nullable().url("Debe ser una URL válida").max(200),
  portfolio_url: yup.string().nullable().url("Debe ser una URL válida").max(200),
  professional_summary: yup.string().nullable().max(500),
  travel_availability: yup.boolean().default(false),
  has_driving_license: yup.boolean().default(false),
  driving_license_category: yup.string().nullable(),
});