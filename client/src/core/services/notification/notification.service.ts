import apiClient from '@/core/config/axios';
import type { IApiResponse, IPaginationRequest } from '@/core/types/IApi';

const basePath = '/v1/users';

export const getByUser = async (
  userId: number,
  params?: IPaginationRequest,
  config: { signal?: AbortSignal } = {}
): Promise<IApiResponse> => {
  const res = await apiClient.get(`${basePath}/${userId}/notifications`, { params, ...config });
  return res.data;
};

export const markRead = async (userId: number, notificationId: number): Promise<IApiResponse> => {
  const res = await apiClient.patch(`${basePath}/${userId}/notifications/${notificationId}/read`);
  return res.data;
};

export const markAllRead = async (userId: number): Promise<IApiResponse> => {
  const res = await apiClient.patch(`${basePath}/${userId}/notifications/read-all`);
  return res.data;
};

export const remove = async (userId: number, notificationId: number): Promise<IApiResponse> => {
  const res = await apiClient.delete(`${basePath}/${userId}/notifications/${notificationId}`);
  console.log(res); 
  return res.data;
};

export const removeAll = async (userId: number): Promise<IApiResponse> => {
  const res = await apiClient.delete(`${basePath}/${userId}/notifications`);
  console.log(res);
  return res.data;
};

export const NotificationService = {
  getByUser,
  markRead,
  markAllRead,
  remove,
  removeAll,
};
