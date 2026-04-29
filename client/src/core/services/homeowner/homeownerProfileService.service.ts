import axios from '@/core/config/axios';
import type { IApiResponse, IPaginationRequest } from '@/core/types/IApi';
import type { IHomeownerServiceLink } from '@/core/types/IHomeownerService';

const mapPagination = (api: any, fallbackPerPage?: number) => {
  const perPage = api?.per_page ?? fallbackPerPage ?? 10;
  const total = api?.total ?? 0;
  const from = api?.from ?? 0;
  const to = api?.to ?? 0;
  const count = to && from ? to - from + 1 : Array.isArray(api?.data) ? api.data.length : 0;

  return {
    total,
    count,
    per_page: perPage,
    current_page: api?.current_page ?? 1,
    total_pages: api?.last_page ?? (perPage ? Math.max(1, Math.ceil(total / perPage)) : 1),
  };
};

const normalizeResponse = (
  api: any,
  fallbackPerPage?: number
): IApiResponse<IHomeownerServiceLink[]> => {
  const data = api?.data ?? api ?? [];
  return {
    success: true,
    data,
    meta: api?.meta
      ? { pagination: mapPagination(api.meta, fallbackPerPage) }
      : api?.data
        ? { pagination: mapPagination(api, fallbackPerPage) }
        : undefined,
  };
};

const getAllPaginated = async (
  homeownerProfileId: number | string,
  params?: IPaginationRequest,
  config: { signal?: AbortSignal } = {}
): Promise<IApiResponse<IHomeownerServiceLink[]>> => {
  const requestParams = {
    page: params?.page,
    per_page: params?.limit ?? params?.per_page,
    search: params?.search,
    sort_by: params?.sortBy?.sort ?? 'name',
    sort_dir: params?.sortBy?.order ?? 'asc',
  };

  const res = await axios.get(`/v1/homeowner-profiles/${homeownerProfileId}/services`, {
    params: requestParams,
    ...config,
  });

  return normalizeResponse(res.data, requestParams.per_page);
};

const add = async (
  homeownerProfileId: number | string,
  serviceId: number
): Promise<IApiResponse<IHomeownerServiceLink>> => {
  const res = await axios.post(`/v1/homeowner-profiles/${homeownerProfileId}/services`, {
    service_id: serviceId,
  });
  return res.data;
};

const remove = async (
  homeownerProfileId: number | string,
  serviceId: number | string
): Promise<IApiResponse> => {
  const res = await axios.delete(`/v1/homeowner-profiles/${homeownerProfileId}/services/${serviceId}`);
  return res.data;
};

const sync = async (
  homeownerProfileId: number | string,
  serviceIds: Array<number | string>
): Promise<IApiResponse> => {
  const res = await axios.put(`/v1/homeowner-profiles/${homeownerProfileId}/services/sync`, {
    services: serviceIds,
  });
  return res.data;
};

const getHomeownersByService = async (
  serviceId: number | string,
  params?: IPaginationRequest,
  config: { signal?: AbortSignal } = {}
): Promise<IApiResponse> => {
  const res = await axios.get(`/v1/services/${serviceId}/homeowners`, {
    params,
    ...config,
  });
  return res.data;
};

export const HomeownerProfileServiceService = {
  getAllPaginated,
  add,
  remove,
  sync,
  getHomeownersByService,
};
