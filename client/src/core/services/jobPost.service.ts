
import type { JobPost } from '@/pages/homeownner/PostJob/Main';
import axios from '@/core/config/axios';
import type { IApiResponse, IPaginationRequest } from '@/core/types/IApi';

export interface IJobPostRequest {
  [key: string]: any;
}

// Helper for FormData
const buildJobPostFormData = (data: any, initialData?: JobPost | null) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'image') return;
    if (key === 'remove_image') {
      if (value) formData.append('remove_image', '1');
      return;
    }
    if (value === undefined) return;
    if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Blob)) return;
    if (value instanceof Blob) {
      formData.append(key, value);
      return;
    }
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value === null) {
      formData.append(key, value === null ? '' : String(value));
    }
  });
  if (!('homeowner_id' in data)) {
    formData.append('homeowner_id', initialData?.homeowner_id?.toString() || '1');
  }
  const imageValue = data.image;
  if (imageValue instanceof File) {
    formData.append('image', imageValue);
  } else if (imageValue && Array.isArray(imageValue) && imageValue[0] instanceof File) {
    formData.append('image', imageValue[0]);
  } else if (imageValue instanceof Blob) {
    formData.append('image', imageValue);
  } else if (typeof imageValue === 'string' && imageValue.startsWith('data:image/')) {
    formData.append('image', imageValue);
  } else if (imageValue === null) {
    formData.append('image', '');
  }
  return formData;
};

// --- Service methods ---

export const getAllPaginated = async (
  params?: IPaginationRequest,
  config: { signal?: AbortSignal } = {}
): Promise<IApiResponse> => {
  const res = await axios.get('/v1/job-posts', { params, ...config });
  return res.data;
};

export const getAll = async (): Promise<IApiResponse> => {
  const res = await axios.get('/v1/job-posts');
  console.log('Fetched All Job Posts:', res);
  return res.data;
};

export const getByHomeowner = async (
  homeownerId: number,
  params?: IPaginationRequest,
  config: { signal?: AbortSignal } = {}
): Promise<IApiResponse> => {
  const res = await axios.get(`/v1/job-posts/homeowner/${homeownerId}`, { params, ...config });
  console.log('Fetched Job Posts by Homeowner:', res);
  return res.data;
};

export const create = async (
  data: IJobPostRequest,
  initialData?: JobPost | null
): Promise<IApiResponse> => {
  const formData = buildJobPostFormData(data, initialData);
  const res = await axios.post('/v1/job-posts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  console.log('Created Job Post:', res);
  return res.data;
};

export const update = async (
  id: number,
  data: IJobPostRequest,
  initialData: JobPost
): Promise<IApiResponse> => {
  const formData = buildJobPostFormData(data, initialData);
  formData.append('_method', 'PUT');
  const res = await axios.post(`/v1/job-posts/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  console.log('Updated Job Post:', res);
  return res.data;
};

export const get = async (id: number): Promise<IApiResponse> => {
  const res = await axios.get(`/v1/job-posts/${id}`);
  console.log('Fetched Job Post:', res);
  return res.data;
};

export const remove = async (id: number): Promise<IApiResponse> => {
  const res = await axios.delete(`/v1/job-posts/${id}`);
  console.log('Removed Job Post:', res);
  return res.data;
};

export const removeMany = async (ids: number[]): Promise<IApiResponse> => {
  const res = await axios.delete('/v1/job-posts/destroy-many', { data: { ids } });
  console.log('Removed Many Job Posts:', res);
  return res.data;
};

export const changeAprobationStatus = async (
  jobPostId: number,
  status_aprobation: boolean
): Promise<IApiResponse> => {
  const res = await axios.post(`/v1/job-posts/${jobPostId}/aprobation`, { status_aprobation });
  console.log('Changed Aprobation Status:', res);
  return res.data;
};

export const JobPostService = {
  getAllPaginated,
  getAll,
  getByHomeowner,
  create,
  update,
  get,
  remove,
  removeMany,
  changeAprobationStatus,
};

// --- Compatibility exports for legacy imports ---
// Compatibility: createJobPost and updateJobPost accept two arguments for legacy usage
export const createJobPost = (data: IJobPostRequest, initialData?: JobPost | null) => create(data, initialData);
export const updateJobPost = (data: IJobPostRequest, initialData: JobPost) => update(initialData.id, data, initialData);
export const getJobPostsByHomeowner = getByHomeowner;
export const deleteJobPostById = remove;
export const getAllJobPosts = getAll;
export const changeJobPostAprobationStatus = changeAprobationStatus;