import axios from '@/core/config/axios';
import type { IApiResponse, IPaginationRequest } from '@/core/types/IApi';
import type { IUserCreateRequest, IUserUpdateRequest } from '@/core/types/IUser';

export const getAllPaginated = async (params?: IPaginationRequest, config: { signal?: AbortSignal } = {}): Promise<IApiResponse> => {
  const res = await axios.get('/v1/users', { params, ...config });
  console.log(res.data); 
  return res.data;
}

export const create = async (request: IUserCreateRequest): Promise<IApiResponse> => {
  const res = await axios.post('/v1/users', request);
  return res.data;
}

export const getAll = async (): Promise<IApiResponse> => {
  const res = await axios.get('/v1/users/all');
  return res.data;
}

export const update = async (id: any, request: IUserUpdateRequest): Promise<IApiResponse> => {
  const res = await axios.put(`/v1/users/${id}`, request);
  return res.data;
}

export const get = async (id: any): Promise<IApiResponse> => {
  const res = await axios.get(`/v1/users/${id}`);
  return res.data;
}

export const remove = async (id: any): Promise<IApiResponse> => {
  const response = await axios.delete(`/v1/users/${id}`);
  return response.data;
}

export const forceRemove = async (id: any): Promise<IApiResponse> => {
  // Assumption: backend supports a force delete endpoint for permanent removal
  const response = await axios.delete(`/v1/users/${id}/force`);
  return response.data;
}

export const restore = async (id: any): Promise<IApiResponse> => {
  const response = await axios.post(`/v1/users/${id}/restore`);
  return response.data;
}

export const updateStatus = async (id: number, status: boolean | number) => {
  // Siempre enviar 1 o 0
  const statusValue = typeof status === 'boolean' ? (status ? 1 : 0) : status;
  const res = await axios.patch(`/v1/users/${id}/verification`, { verification: statusValue });
  console.log(res);
  return {
    success: true,
    message: res.data.message,
    data: res.data.data
  };
};

export const updateEditProfileStatus = async (id: number, editProfile: boolean | number) => {
  // Siempre enviar 1 o 0
  const value = typeof editProfile === 'boolean' ? (editProfile ? 1 : 0) : editProfile;
  const res = await axios.patch(`/v1/users/${id}/edit-profile`, { edit_profile: value });
  console.log(res);
  return {
    success: true,
    message: res.data.message,
    data: res.data.data
  };
};

// Servicio para obtener información adicional del usuario
export const getUserInformation = async (id: any): Promise<IApiResponse> => {
  const res = await axios.get(`/v1/users/${id}/info`);
  return res.data;
};

export const UserService = {
  getAllPaginated,
  create,
  update,
  get,
  remove,
  forceRemove,
  restore,
  getAll,
  updateStatus,
  updateEditProfileStatus,
  getUserInformation,
}
