// Servicio básico para job applications
import axios from 'axios';

const API_URL = '/api/job-applications';

export const JobApplicationService = {
  async getAllPaginated(params = {}, config = {}) {
    const res = await axios.get(API_URL, { params, ...config });
    // Ajusta según la estructura de tu API
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
};
