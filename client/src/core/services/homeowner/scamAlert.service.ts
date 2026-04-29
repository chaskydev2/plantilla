import axios from '@/core/config/axios';
import type { IApiResponse, IPaginationRequest } from '@/core/types/IApi';
import type { IScamAlert } from '@/core/types/IScamAlert';

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

const normalizeResponse = (api: any, fallbackPerPage?: number): IApiResponse<IScamAlert[]> => {
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

const create = async (payload: Partial<IScamAlert>): Promise<IApiResponse<IScamAlert>> => {
  const res = await axios.post(`/v1/scam-alerts`, payload);
  return res.data;
};

const getAllPaginated = async (
  params?: IPaginationRequest,
  config: { signal?: AbortSignal } = {}
): Promise<IApiResponse<IScamAlert[]>> => {
  const requestParams = {
    page: params?.page,
    per_page: params?.limit ?? params?.per_page,
    search: params?.search,
    sort_by: params?.sortBy?.sort ?? 'reported_at',
    sort_dir: params?.sortBy?.order ?? 'desc',
  };

  const res = await axios.get(`/v1/scam-alerts`, {
    params: requestParams,
    ...config,
  });

  return normalizeResponse(res.data, requestParams.per_page);
};

const remove = async (
  claimId: number | string
): Promise<IApiResponse> => {
  const res = await axios.delete(`/v1/scam-alerts/${claimId}`);
  return res.data;
};

const update = async (
  claimId: number | string,
  payload: Partial<IScamAlert>
): Promise<IApiResponse<IScamAlert>> => {
  const res = await axios.put(`/v1/scam-alerts/${claimId}`, payload);
  return res.data;
};

const getAllPublic = async (
  config: { signal?: AbortSignal } = {}
): Promise<IApiResponse<IScamAlert[]>> => {
  const res = await axios.get(`/v1/scam-alerts/all`, config);
  return normalizeResponse(res.data);
};

const getMyHomeownerClaims = async (
  params?: IPaginationRequest,
  config: { signal?: AbortSignal } = {}
): Promise<IApiResponse<IScamAlert[]>> => {
  const requestParams = {
    page: params?.page,
    per_page: params?.limit ?? params?.per_page,
    search: params?.search,
    sort_by: params?.sortBy?.sort ?? 'reported_at',
    sort_dir: params?.sortBy?.order ?? 'desc',
  };

  const res = await axios.get(`/v1/homeowner-profile/claims`, {
    params: requestParams,
    ...config,
  });

  console.log("res data ", res);
  return normalizeResponse(res.data, requestParams.per_page);
};

export const ScamAlertService = {
  create,
  getAllPaginated,
  getMyHomeownerClaims,
  remove,
  update,
  getAllPublic,
};
