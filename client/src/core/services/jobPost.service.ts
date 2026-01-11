// Get all job posts (admin)
export const getAllJobPosts = async () => {
  const url = `${API_BASE_URL}/v1/job-posts`;
  const res = await axios.get(url);
  return res.data;
};
// Eliminar múltiples job posts por IDs

import type { JobPost } from '@/pages/homeownner/PostJob/Main';
import axios from '@/core/config/axios';

export interface IJobPostRequest {
  [key: string]: any;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const buildJobPostFormData = (data: any, initialData?: JobPost | null) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'image') return; // Handled separately
    if (value === undefined || value === null) return;
    // Ignore if it's an empty object
    if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Blob)) return;
    // If it's a Blob, add it
    if (value instanceof Blob) {
      formData.append(key, value);
      return;
    }
    // If it's string, number or boolean, add as string
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      formData.append(key, String(value));
    }
  });
  formData.append('homeowner_id', initialData?.homeowner_id?.toString() || '1');
  // Image
  if (data.image && Array.isArray(data.image) && data.image[0] && typeof data.image[0] !== 'object') {
    // If it's a string, don't add it
  } else if (data.image && Array.isArray(data.image) && data.image[0] instanceof File) {
    formData.append('image', data.image[0]);
  }
  return formData;
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
  console.log('FormData entries for createJobPost:', formData);
  const url = `${API_BASE_URL}/v1/job-posts`;
  const res = await axios.post(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};




export const updateJobPost = async (
  data: IJobPostRequest,
  initialData: JobPost
): Promise<any> => {
  const formData = buildJobPostFormData(data, initialData);
  const url = `${API_BASE_URL}/v1/job-posts/${initialData.id}`;
  const res = await axios.put(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};