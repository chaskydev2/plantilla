import axios from '@/core/config/axios';
import type { IApiResponse, IPaginationRequest } from '@/core/types/IApi';
import type { IYouTubeVideo, IYouTubeVideoCreateRequest, IYouTubeVideoUpdateRequest } from '@/core/types/IYouTubeVideo';

export const getAllPaginated = async (
  params?: IPaginationRequest,
  config: { signal?: AbortSignal } = {}
): Promise<IApiResponse<IYouTubeVideo[]>> => {
  const requestParams = {
    page: params?.page,
    per_page: params?.limit ?? params?.per_page,
    search: params?.search,
    category: params?.category,
    topic: params?.topic,
  };

  const res = await axios.get('/v1/youtube-videos/all', { params: requestParams, ...config });
  const api = res.data;
  
  // Handle paginated response from Laravel
  const data = Array.isArray(api?.data) ? api.data : [];
  const perPage = api?.per_page ?? requestParams.per_page ?? 15;
  
  const pagination = api?.meta
    ? {
        total: api.meta.total ?? 0,
        count: api.meta.count ?? data.length,
        per_page: perPage,
        current_page: api.meta.current_page ?? 1,
        total_pages: api.meta.last_page ?? 1,
      }
    : {
        total: data.length,
        count: data.length,
        per_page: perPage,
        current_page: 1,
        total_pages: 1,
      };

  return {
    success: true,
    data,
    meta: { pagination },
  };
};

export const create = async (request: IYouTubeVideoCreateRequest): Promise<IApiResponse<IYouTubeVideo>> => {
  const res = await axios.post('/v1/youtube-videos', request);
  return res.data;
};

export const update = async (id: number, request: IYouTubeVideoUpdateRequest): Promise<IApiResponse<IYouTubeVideo>> => {
  const res = await axios.put(`/v1/youtube-videos/${id}`, request);
  return res.data;
};

export const get = async (id: number): Promise<IApiResponse<IYouTubeVideo>> => {
  const res = await axios.get(`/v1/youtube-videos/${id}`);
  return res.data;
};

export const remove = async (id: number): Promise<IApiResponse> => {
  const res = await axios.delete(`/v1/youtube-videos/${id}`);
  return res.data;
};

export const YouTubeVideoService = {
  getAllPaginated,
  create,
  update,
  get,
  remove,
};
