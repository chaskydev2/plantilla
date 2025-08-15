import * as yup from "yup";

export const courseStoreSchema = yup.object().shape({
  name: yup
    .string()
    .required("El nombre es requerido")
    .max(100, "El nombre no puede exceder los 100 caracteres"),
  instructor_id: yup.string().required("El insctructor es requerido"),
  start_date: yup.string().required("La fecha inicio es requerido"),
  end_date: yup.string().required("La fecha fin es requerido"),
  location: yup
    .string()
    .required("La ubicación es requerido")
    .max(200, "La ubicación no puede exceder los 200 caracteres"),
  cost: yup.number().required("La costo es requerido"),
  max_capacity: yup.number().required("La capacidad maxima es requerido"),
  status: yup.string().required("El estado es requerido"),
});

export const courseUpdateSchema = yup.object().shape({
  name: yup
    .string()
    .required("El nombre es requerido")
    .max(100, "El nombre no puede exceder los 100 caracteres"),
  instructor_id: yup.string().required("El insctructor es requerido"),
  start_date: yup.string().required("La fecha inicio es requerido"),
  end_date: yup.string().required("La fecha fin es requerido"),
  location: yup
    .string()
    .required("La ubicación es requerido")
    .max(200, "La ubicación no puede exceder los 200 caracteres"),
  cost: yup.number().required("La costo es requerido"),
  max_capacity: yup.number().required("La capacidad maxima es requerido"),
  status: yup.string().required("El estado es requerido"),
});
