import axios from '@/core/config/axios';
import type { IApiResponse, IPagination, IPaginationRequest } from '@/core/types/IApi';

type JobPostListResponse = {
  data?: any[];
  current_page?: number;
  last_page?: number;
  per_page?: number | string;
  total?: number;
};

const toApiParams = (params: IPaginationRequest = {}) => {
  const { page, limit, sortBy, ...rest } = params;
  const mapped: Record<string, unknown> = { ...rest };

  if (page !== undefined) mapped.page = page;
  if (limit !== undefined) mapped.per_page = limit;
  if (sortBy?.sort) mapped.sort_by = sortBy.sort;
  if (sortBy?.order) mapped.sort_dir = sortBy.order;

  return mapped;
};

const toPagination = (payload: JobPostListResponse): IPagination => {
  const dataLength = Array.isArray(payload.data) ? payload.data.length : 0;
  const perPageRaw = payload.per_page ?? dataLength;
  const perPage = Number(perPageRaw);
  const normalizedPerPage = Number.isFinite(perPage) && perPage > 0 ? perPage : dataLength;

  return {
    total: payload.total ?? 0,
    count: dataLength,
    per_page: normalizedPerPage,
    current_page: payload.current_page ?? 1,
    total_pages: payload.last_page ?? 1,
  };
};

export const jobPostService = {
  async getAllPaginated(
    params: IPaginationRequest = {},
    config: { signal?: AbortSignal } = {}
  ): Promise<IApiResponse<any[]>> {
    const response = await axios.get('/v1/job-posts', {
      params: toApiParams(params),
      ...config,
    });

    const payload: JobPostListResponse = response.data ?? {};
    const data = Array.isArray(payload.data) ? payload.data : [];

    return {
      success: true,
      data,
      meta: {
        pagination: toPagination(payload),
      },
    };
  },

  async remove(id: number) {
    const response = await axios.delete(`/v1/job-posts/${id}`);
    return response.data;
  },

  async create(data: any) {
    const response = await axios.post('/v1/job-posts', data);
    return response.data;
  },

  async update(id: number, data: any) {
    const response = await axios.put(`/v1/job-posts/${id}`, data);
    return response.data;
  },
};
