import * as yup from "yup";
import { ContractStatus } from "@/core/types/IContractor";

export const ContractorStoreSchema = yup.object().shape({
  user_id: yup
    .number()
    .required("El usuario es requerido")
    .positive("Debe seleccionar un usuario válido"),
  
  // Información de la empresa
  company_name: yup
    .string()
    .required("El nombre de la empresa es requerido")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(255, "El nombre no puede exceder los 255 caracteres")
    .trim(),
  
  license_number: yup
    .string()
    .required("El número de licencia es requerido")
    .max(255, "El número de licencia no puede exceder los 255 caracteres")
    .trim(),
  
  is_insured: yup
    .boolean()
    .default(false),
  
  service_area: yup
    .string()
    .required("El área de servicio es requerida")
    .max(255, "El área de servicio no puede exceder los 255 caracteres")
    .trim(),
  
  average_rating: yup
    .number()
    .min(0, "La calificación debe ser mayor o igual a 0")
    .max(5, "La calificación debe ser menor o igual a 5")
    .default(0),

  // Información de dirección
  preferred_zip: yup
    .string()
    .optional()
    .nullable()
    .transform((value) => value === '' ? null : value)
    .max(15, "El código postal no puede exceder los 15 caracteres"),
  
  address_line1: yup
    .string()
    .optional()
    .nullable()
    .transform((value) => value === '' ? null : value)
    .max(200, "La dirección no puede exceder los 200 caracteres"),
  
  address_line2: yup
    .string()
    .optional()
    .nullable()
    .transform((value) => value === '' ? null : value)
    .max(200, "La dirección no puede exceder los 200 caracteres"),
  
  city: yup
    .string()
    .optional()
    .nullable()
    .transform((value) => value === '' ? null : value)
    .max(120, "La ciudad no puede exceder los 120 caracteres"),
  
  state_code: yup
    .string()
    .optional()
    .nullable()
    .transform((value) => value === '' ? null : value)
    .max(10, "El código de estado no puede exceder los 10 caracteres"),
  
  country_code: yup
    .string()
    .required("El código de país es requerido")
    .length(2, "El código de país debe tener exactamente 2 caracteres")
    .uppercase()
    .default("US"),

  // Coordenadas
  lat: yup
    .number()
    .optional()
    .nullable()
    .transform((value) => value === '' ? null : value)
    .min(-90, "La latitud debe estar entre -90 y 90")
    .max(90, "La latitud debe estar entre -90 y 90"),
  
  lng: yup
    .number()
    .optional()
    .nullable()
    .transform((value) => value === '' ? null : value)
    .min(-180, "La longitud debe estar entre -180 y 180")
    .max(180, "La longitud debe estar entre -180 y 180"),

  // Información de contacto
  mobile_number: yup
    .string()
    .optional()
    .nullable()
    .transform((value) => value === '' ? null : value)
    .max(20, "El número de celular no puede exceder los 20 caracteres"),
  
  phone_number: yup
    .string()
    .optional()
    .nullable()
    .transform((value) => value === '' ? null : value)
    .max(20, "El número de teléfono no puede exceder los 20 caracteres"),
  
  linkedin_url: yup
    .string()
    .optional()
    .nullable()
    .transform((value) => value === '' ? null : value)
    .url("Debe ser una URL válida")
    .max(500, "La URL no puede exceder los 500 caracteres"),
  
  portfolio_url: yup
    .string()
    .optional()
    .nullable()
    .transform((value) => value === '' ? null : value)
    .url("Debe ser una URL válida")
    .max(500, "La URL no puede exceder los 500 caracteres"),

  // Información profesional
  has_driving_license: yup
    .boolean()
    .default(false),
  
  driving_license_category: yup
    .string()
    .optional()
    .nullable()
    .transform((value) => value === '' ? null : value)
    .max(10, "La categoría de licencia no puede exceder los 10 caracteres"),

  // Fechas del contrato
  affiliation_date: yup
    .date()
    .optional()
    .nullable()
    .transform((value) => value === '' ? null : value)
    .max(new Date(), "La fecha de afiliación no puede ser futura"),
  
  approval_date: yup
    .date()
    .optional()
    .nullable()
    .transform((value) => value === '' ? null : value)
    .max(new Date(), "La fecha de aprobación no puede ser futura")
    .test(
      'is-after-affiliation',
      'La fecha de aprobación debe ser posterior a la fecha de afiliación',
      function (value) {
        const { affiliation_date } = this.parent;
        if (!value || !affiliation_date) return true;
        return new Date(value) >= new Date(affiliation_date);
      }
    ),
  
  contract_status: yup
    .string()
    .required("El estado del contrato es requerido")
    .oneOf(Object.values(ContractStatus), "Estado de contrato inválido")
    .default(ContractStatus.PENDING),
});

export const ContractorUpdateSchema = yup.object().shape({
  // Para actualización, los campos requeridos se vuelven opcionales
  company_name: yup
    .string()
    .optional()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(255, "El nombre no puede exceder los 255 caracteres")
    .trim(),
  
  license_number: yup
    .string()
    .optional()
    .max(255, "El número de licencia no puede exceder los 255 caracteres")
    .trim(),
  
  is_insured: yup
    .boolean()
    .optional(),
  
  service_area: yup
    .string()
    .optional()
    .max(255, "El área de servicio no puede exceder los 255 caracteres")
    .trim(),
  
  average_rating: yup
    .number()
    .optional()
    .min(0, "La calificación debe ser mayor o igual a 0")
    .max(5, "La calificación debe ser menor o igual a 5"),

  // Información de dirección
  preferred_zip: yup
    .string()
    .optional()
    .nullable()
    .transform((value) => value === '' ? null : value)
    .max(15, "El código postal no puede exceder los 15 caracteres"),
  
  address_line1: yup
    .string()
    .optional()
    .nullable()
    .transform((value) => value === '' ? null : value)
    .max(200, "La dirección no puede exceder los 200 caracteres"),
  
  address_line2: yup
    .string()
    .optional()
    .nullable()
    .transform((value) => value === '' ? null : value)
    .max(200, "La dirección no puede exceder los 200 caracteres"),
  
  city: yup
    .string()
    .optional()
    .nullable()
    .transform((value) => value === '' ? null : value)
    .max(120, "La ciudad no puede exceder los 120 caracteres"),
  
  state_code: yup
    .string()
    .optional()
    .nullable()
    .transform((value) => value === '' ? null : value)
    .max(10, "El código de estado no puede exceder los 10 caracteres"),
  
  country_code: yup
    .string()
    .optional()
    .length(2, "El código de país debe tener exactamente 2 caracteres")
    .uppercase(),

  // Coordenadas
  lat: yup
    .number()
    .optional()
    .nullable()
    .transform((value) => value === '' ? null : value)
    .min(-90, "La latitud debe estar entre -90 y 90")
    .max(90, "La latitud debe estar entre -90 y 90"),
  
  lng: yup
    .number()
    .optional()
    .nullable()
    .transform((value) => value === '' ? null : value)
    .min(-180, "La longitud debe estar entre -180 y 180")
    .max(180, "La longitud debe estar entre -180 y 180"),

  // Información de contacto
  mobile_number: yup
    .string()
    .optional()
    .nullable()
    .transform((value) => value === '' ? null : value)
    .max(20, "El número de celular no puede exceder los 20 caracteres"),
  
  phone_number: yup
    .string()
    .optional()
    .nullable()
    .transform((value) => value === '' ? null : value)
    .max(20, "El número de teléfono no puede exceder los 20 caracteres"),
  
  linkedin_url: yup
    .string()
    .optional()
    .nullable()
    .transform((value) => value === '' ? null : value)
    .url("Debe ser una URL válida")
    .max(500, "La URL no puede exceder los 500 caracteres"),
  
  portfolio_url: yup
    .string()
    .optional()
    .nullable()
    .transform((value) => value === '' ? null : value)
    .url("Debe ser una URL válida")
    .max(500, "La URL no puede exceder los 500 caracteres"),

  // Información profesional
  has_driving_license: yup
    .boolean()
    .optional(),
  
  driving_license_category: yup
    .string()
    .optional()
    .nullable()
    .transform((value) => value === '' ? null : value)
    .max(10, "La categoría de licencia no puede exceder los 10 caracteres"),

  // Fechas del contrato
  affiliation_date: yup
    .date()
    .optional()
    .nullable()
    .transform((value) => value === '' ? null : value)
    .max(new Date(), "La fecha de afiliación no puede ser futura"),
  
  approval_date: yup
    .date()
    .optional()
    .nullable()
    .transform((value) => value === '' ? null : value)
    .max(new Date(), "La fecha de aprobación no puede ser futura")
    .test(
      'is-after-affiliation',
      'La fecha de aprobación debe ser posterior a la fecha de afiliación',
      function (value) {
        const { affiliation_date } = this.parent;
        if (!value || !affiliation_date) return true;
        return new Date(value) >= new Date(affiliation_date);
      }
    ),
  
  contract_status: yup
    .string()
    .optional()
    .oneOf(Object.values(ContractStatus), "Estado de contrato inválido"),
});