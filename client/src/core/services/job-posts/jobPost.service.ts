


 import axios from 'axios';

export const jobPostService = {
  async getAllPaginated(params = {}, config = {}) {
    const response = await axios.get('/api/job-posts', { params, ...config });
    // La respuesta debe tener la estructura: { data: [...], meta: { pagination: {...} } }
    return response.data;
  },
  async remove(id: number) {
    const response = await axios.delete(`/api/job-posts/${id}`);
    return response.data;
  },
  async create(data: any) {
    const response = await axios.post('/api/job-posts', data);
    return response.data;
  },
  async update(id: number, data: any) {
    const response = await axios.put(`/api/job-posts/${id}`, data);
    return response.data;
  },
};
