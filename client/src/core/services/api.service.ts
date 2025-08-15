import axios from '@/core/config/axios';
import type { IApiResponse } from '@/core/types/IApi';

interface ApiServiceOptions {
  basePath: string;
}

export const createApiService = ({ basePath }: ApiServiceOptions) => {
  const get = async (url: string, params?: Record<string, any>): Promise<IApiResponse> => {
    const res = await axios.get(`/v1/${basePath}/${url}`, { params });
    return res.data;
  };

  const create = async (url: string, request: any): Promise<IApiResponse> => {
    const res = await axios.post(`/v1/${basePath}/${url}`, request);
    return res.data;
  };

  return {
    get,
    create,
  };
};