import apiClient from '@/core/config/axios';
import type { AxiosRequestConfig } from 'axios';
import type { IApiResponse } from '@/core/types/IApi';

const basePath = 'v1/homeowner-profile/dashboard';

const withAuth = (config: AxiosRequestConfig = {}): AxiosRequestConfig => {
  const token =
    localStorage.getItem('_tkn') ||
    localStorage.getItem('token') ||
    localStorage.getItem('access_token');

  if (!token) {
    return config;
  }

  return {
    ...config,
    headers: {
      ...(config.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getMyDashboard = async (): Promise<IApiResponse> => {
  const res = await apiClient.get(basePath, withAuth());
  const api = res.data;
  return {
    success: true,
    data: api.data || api,
    message: api.message,
  };
};

export const DashboardHomeownerService = {
  getMyDashboard,
};
