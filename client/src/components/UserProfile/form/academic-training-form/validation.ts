import * as yup from 'yup';

export const profileStoreSchema = yup.object().shape({
  professional_title: yup.string()
    .required('El título profesional es requerido')
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(100, 'El título no puede exceder los 100 caracteres'),
    
  academic_degree: yup.string()
    .required('El grado académico es requerido')
    .min(3, 'El grado académico debe tener al menos 3 caracteres')
    .max(100, 'El grado académico no puede exceder los 100 caracteres'),
    
  graduated_from: yup.string()
    .required('La institución educativa es requerida')
    .min(3, 'El nombre de la institución debe tener al menos 3 caracteres')
    .max(150, 'El nombre no puede exceder los 150 caracteres'),
    
  relevant_certifications: yup.string()
    .notRequired()
    .max(500, 'Las certificaciones no pueden exceder los 500 caracteres'),
    
  graduation_date: yup.date()
    .required('La fecha de graduación es requerida'),
    
  degree_date: yup.date()
    .required('La fecha de obtención del grado es requerida'),
});

export const profileUpdateSchema = yup.object().shape({
  professional_title: yup.string()
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(100, 'El título no puede exceder los 100 caracteres')
    .notRequired(),
    
  academic_degree: yup.string()
    .min(3, 'El grado académico debe tener al menos 3 caracteres')
    .max(100, 'El grado académico no puede exceder los 100 caracteres')
    .notRequired(),
    
  graduated_from: yup.string()
    .min(3, 'El nombre de la institución debe tener al menos 3 caracteres')
    .max(150, 'El nombre no puede exceder los 150 caracteres')
    .notRequired(),
    
  relevant_certifications: yup.string()
    .max(500, 'Las certificaciones no pueden exceder los 500 caracteres')
    .notRequired(),
    
  graduation_date: yup.date()
    .required('La fecha de graduación es requerida'),
    
  degree_date: yup.date()
    .required('La fecha de obtención del grado es requerida'),
});