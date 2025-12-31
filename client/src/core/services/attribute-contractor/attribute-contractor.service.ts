import axios from '@/core/config/axios';
import type { IApiResponse, IPaginationRequest } from '@/core/types/IApi';
import type { AttributeContractor } from '@/pages/admin/attribute-contractor/types';

export const getAllPaginated = async (params?: IPaginationRequest): Promise<IApiResponse<AttributeContractor[]>> => {
  const res = await axios.get('/v1/attribute-contractors', { params });
  const apiResponse = res.data;
  return {
    success: true,
    data: apiResponse.data || [],
    meta: {
      pagination: {
        total: apiResponse.meta?.total || 0,
        count: apiResponse.meta?.to - apiResponse.meta?.from + 1 || 0,
        per_page: apiResponse.meta?.per_page || 10,
        current_page: apiResponse.meta?.current_page || 1,
        total_pages: apiResponse.meta?.last_page || 1,
      }
    }
  };
};

export const getAll = async (): Promise<IApiResponse> => {
  const res = await axios.get('/v1/attribute-contractors');
  return {
    success: true,
    message: res.data.message,
    data: res.data.data || res.data
  };
};

export const create = async (request: Partial<AttributeContractor>): Promise<IApiResponse> => {
  const res = await axios.post('/v1/attribute-contractors', request);
  return {
    success: true,
    message: res.data.message,
    data: res.data.data
  };
};

export const update = async (id: number, request: Partial<AttributeContractor>): Promise<IApiResponse> => {
  const res = await axios.put(`/v1/attribute-contractors/${id}`, request);
  return {
    success: true,
    message: res.data.message,
    data: res.data.data
  };
};

export const remove = async (id: number): Promise<IApiResponse> => {
  try {
    const res = await axios.delete(`/v1/attribute-contractors/${id}`);
    return {
      success: true,
      message: res.data.message || 'AttributeContractor deleted successfully',
      data: res.data.data || null
    };
  } catch (error: any) {
    if (error.response?.status === 500) {
      const serverError = error.response.data;
      return {
        success: false,
        message: serverError.message || 'Server error occurred while deleting AttributeContractor',
        data: null
      };
    }
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Error occurred while deleting AttributeContractor',
      data: null
    };
  }
};

export const show = async (id: number): Promise<IApiResponse> => {
  const res = await axios.get(`/v1/attribute-contractors/${id}`);
  return {
    success: true,
    message: res.data.message,
    data: res.data.data
  };
};


const updateStatus = async (id: number, status: boolean | number) => {
  // Siempre enviar 1 o 0 al backend
  const statusValue = typeof status === 'boolean' ? (status ? 1 : 0) : status;
  const res = await axios.patch(`/v1/attribute-contractors/${id}/status`, { status: statusValue });
  console.log('Respuesta de updateStatus:', res.data);
  return {
    success: true,
    message: res.data.message,
    data: res.data.data
  };
};

// Servicio para actualizar el comentario
const updateComentario = async (id: number, comentario: string) => {
  const res = await axios.patch(`/v1/attribute-contractors/${id}/comentario`, { comentario });
  return {
    success: true,
    message: res.data.message,
    data: res.data.data
  };
};

export const AttributeContractorService = {
  getAllPaginated,
  getAll,
  create,
  update,
  remove,
  show,
  updateStatus,
  updateComentario
};
