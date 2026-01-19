// Change aprobation status for a job post
import type { JobPost } from '@/pages/homeownner/PostJob/Main';
import axios from '@/core/config/axios';

export interface IJobPostRequest {
  [key: string]: any;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || '';


export const changeJobPostAprobationStatus = async (
  jobPostId: number,
  status_aprobation: boolean
): Promise<any> => {
  //const url = `${API_BASE_URL}/job-posts/${jobPostId}/aprobation`;
    const url = `${API_BASE_URL}/v1/job-posts/${jobPostId}/aprobation`;
    const res = await axios.post(url, { status_aprobation });
  console.log('Response from changeJobPostAprobationStatus:', res);
  
  return res.data;
};


const buildJobPostFormData = (data: any, initialData?: JobPost | null) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (key === 'image') return; // Handled separately below
    if (key === 'remove_image') {
      if (value) formData.append('remove_image', '1');
      return;
    }
    // Permitir null y string vacía, solo omitir undefined
    if (value === undefined) return;
    // Si es un objeto vacío (excepto File/Blob), omitir
    if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Blob)) return;
    // Si es Blob, agregar
    if (value instanceof Blob) {
      formData.append(key, value);
      return;
    }
    // Si es string, number o boolean, agregar como string (permitir null y '')
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value === null) {
      formData.append(key, value === null ? '' : String(value));
    }
  });
  // homeowner_id: solo agregar si no está en data
  if (!('homeowner_id' in data)) {
    formData.append('homeowner_id', initialData?.homeowner_id?.toString() || '1');
  }
  // Imagen
  const imageValue = data.image;
  if (imageValue instanceof File) {
    formData.append('image', imageValue);
  } else if (imageValue && Array.isArray(imageValue) && imageValue[0] instanceof File) {
    formData.append('image', imageValue[0]);
  } else if (imageValue instanceof Blob) {
    formData.append('image', imageValue);
  } else if (typeof imageValue === 'string' && imageValue.startsWith('data:image/')) {
    // Laravel acepta base64 y lo transforma en archivo
    formData.append('image', imageValue);
  } else if (imageValue === null) {
    // Si image es null explícito, enviar para eliminar
    formData.append('image', '');
  }
  return formData;
};


// Get all job posts (admin)
export const getAllJobPosts = async () => {
  const url = `${API_BASE_URL}/v1/job-posts`;
  const res = await axios.get(url);
  console.log('Response from getAllJobPosts:', res);
  return res.data;
};


export const deleteJobPosts = async (ids: number[]): Promise<any> => {
  const url = `${API_BASE_URL}/v1/job-posts/destroy-many`;
  const res = await axios.delete(url, { data: { ids } });
  return res.data;
};
// Obtener todos los job posts de un homeowner
export const getJobPostsByHomeowner = async (homeownerId: number) => {
  try {
     const url = `${API_BASE_URL}/v1/job-posts/homeowner/${homeownerId}`;
    const res = await axios.get(url);
    console.log('Respuesta de getJobPostsByHomeowner:', res);
    return res.data;
  } catch (err) {
    console.log('Error en getJobPostsByHomeowner:', err);
    // Puedes personalizar el error si lo necesitas
    throw err;
  }
};

export const createJobPost = async (
  data: IJobPostRequest,
  initialData?: JobPost | null
): Promise<any> => {
  const formData = buildJobPostFormData(data, initialData);
  console.log('FormData entries for createJobPost:', data);
  const url = `${API_BASE_URL}/v1/job-posts`;
  const res = await axios.post(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const deleteJobPostById = async (id: number): Promise<any> => {
  const url = `${API_BASE_URL}/v1/job-posts/${id}`;
  const res = await axios.delete(url);
  return res.data;
};


export const updateJobPost = async (
  data: IJobPostRequest,
  initialData: JobPost
): Promise<any> => {
  console.log('Data received for updateJobPost:', data);
  const formData = buildJobPostFormData(data, initialData);
  // Loguear el contenido real de formData
  if (formData && typeof formData.forEach === 'function') {
    console.log('FormData to be sent (key => value):');
    formData.forEach((value, key) => {
      if (value instanceof File) {
        console.log(`${key} => [File] name: ${value.name}, type: ${value.type}, size: ${value.size}`);
      } else {
        console.log(`${key} =>`, value);
      }
    });
  }
  // Laravel: para PUT con multipart/form-data, usar POST y _method=PUT
  formData.append('_method', 'PUT');
  const url = `${API_BASE_URL}/v1/job-posts/${initialData.id}`;
  const res = await axios.post(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  console.log('Response from updateJobPost:', res);
  return res.data;
};