import axios from '@/core/config/axios';
import type { IApiResponse } from '@/core/types/IApi';
import type { ITextBlock, ITextBlockCreateRequest, ITextBlockUpdateRequest } from '@/core/types/ITextBlock';

export const getAll = async (config: { signal?: AbortSignal } = {}): Promise<IApiResponse<ITextBlock[]>> => {
  const res = await axios.get('/v1/text-blocks', config);
  return res.data;
};

export const getFirst = async (config: { signal?: AbortSignal } = {}): Promise<IApiResponse<ITextBlock | null>> => {
  const res = await axios.get('/v1/text-blocks', config);
  const data = res.data?.data?.data || res.data?.data || [];
  return {
    success: true,
    data: Array.isArray(data) && data.length > 0 ? data[0] : null,
  };
};

export const create = async (request: ITextBlockCreateRequest): Promise<IApiResponse<ITextBlock>> => {
  const res = await axios.post('/v1/text-blocks', request);
  return res.data;
};

export const update = async (id: number, request: ITextBlockUpdateRequest): Promise<IApiResponse<ITextBlock>> => {
  const res = await axios.put(`/v1/text-blocks/${id}`, request);
  return res.data;
};

export const get = async (id: number): Promise<IApiResponse<ITextBlock>> => {
  const res = await axios.get(`/v1/text-blocks/${id}`);
  return res.data;
};

export const remove = async (id: number): Promise<IApiResponse> => {
  const res = await axios.delete(`/v1/text-blocks/${id}`);
  return res.data;
};

export const TextBlockService = {
  getAll,
  getFirst,
  create,
  update,
  get,
  remove,
};
