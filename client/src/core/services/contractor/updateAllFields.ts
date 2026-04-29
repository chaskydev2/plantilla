// Add this function to contractor.service.ts
import axios from '@/core/config/axios';
import type { IApiResponse } from '@/core/types/IApi';

export const updateAllFields = async (id: number, data: any): Promise<IApiResponse> => {
  const res = await axios.put(`/v1/contractors/${id}/update-all`, data);
  return res.data;
};
