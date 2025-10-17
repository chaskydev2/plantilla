import axios from '@/core/config/axios';
import type { IApiResponse, IPaginationRequest } from '@/core/types/IApi';
import type { IContractorForm, IContractorFilters, ContractStatus } from '@/core/types/IContractor';

export const getAllPaginated = async (params?: IPaginationRequest & IContractorFilters, config: { signal?: AbortSignal } = {}): Promise<IApiResponse> => {
  const res = await axios.get('/v1/trabajadores', { params, ...config });
  return res.data;
}

export const create = async (request: IContractorForm): Promise<IApiResponse> => {
  const res = await axios.post('/v1/trabajadores', request);
  return res.data;
}

export const update = async (id: any, request: Partial<IContractorForm>): Promise<IApiResponse> => {
  const res = await axios.put(`/v1/trabajadores/${id}`, request);
  return res.data;
}

export const get = async (id: any): Promise<IApiResponse> => {
  const res = await axios.get(`/v1/trabajadores/${id}`);
  return res.data;
}

export const remove = async (id: any): Promise<IApiResponse> => {
  const response = await axios.delete(`/v1/trabajadores/${id}`);
  return response.data;
}

// Métodos específicos de Contractor
export const getStats = async (): Promise<IApiResponse> => {
  const res = await axios.get('/v1/trabajadores/stats');
  return res.data;
}

export const getByStatus = async (status: ContractStatus, params?: IPaginationRequest): Promise<IApiResponse> => {
  const res = await axios.get(`/v1/trabajadores/status/${status}`, { params });
  return res.data;
}

export const getNearLocation = async (params: { lat: number; lng: number; radius?: number } & IPaginationRequest): Promise<IApiResponse> => {
  const res = await axios.get('/v1/trabajadores/near', { params });
  return res.data;
}

export const approve = async (id: any): Promise<IApiResponse> => {
  const res = await axios.patch(`/v1/trabajadores/${id}/approve`);
  return res.data;
}

export const reject = async (id: any): Promise<IApiResponse> => {
  const res = await axios.patch(`/v1/trabajadores/${id}/reject`);
  return res.data;
}

export const suspend = async (id: any): Promise<IApiResponse> => {
  const res = await axios.patch(`/v1/trabajadores/${id}/suspend`);
  return res.data;
}

export const ContractorService = {
  getAllPaginated,
  create,
  update,
  get,
  remove,
  getStats,
  getByStatus,
  getNearLocation,
  approve,
  reject,
  suspend,
}