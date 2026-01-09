import type { JobPost } from '@/pages/homeownner/PostJob/Main';

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


export const createJobPost = async (
  data: IJobPostRequest,
  initialData?: JobPost | null
): Promise<Response> => {
  const formData = buildJobPostFormData(data, initialData);
  const url = `${API_BASE_URL}/v1/job-posts`;
  return fetch(url, {
    method: 'POST',
    body: formData,
  });
};


export const updateJobPost = async (
  data: IJobPostRequest,
  initialData: JobPost
): Promise<Response> => {
  const formData = buildJobPostFormData(data, initialData);
  const url = `${API_BASE_URL}/v1/job-posts/${initialData.id}`;
  return fetch(url, {
    method: 'PUT',
    body: formData,
  });
};