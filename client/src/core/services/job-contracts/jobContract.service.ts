import axios from 'axios';
import type { IJobContract } from '@/core/types/IJobContract';

const API_URL = '/api/job-contracts';

export const JobContractService = {
  async getAllPaginated(params = {}, config = {}) {
    const res = await axios.get(API_URL, { params, ...config });
    return {
      success: true,
      data: res.data.data || res.data,
      meta: { pagination: res.data.meta?.pagination || {} }
    };
  },
  async remove(id: number) {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
  },
  async create(data: Partial<IJobContract>) {
    const res = await axios.post(API_URL, data);
    return res.data;
  },
  async update(id: number, data: Partial<IJobContract>) {
    const res = await axios.put(`${API_URL}/${id}`, data);
    return res.data;
  },
};
