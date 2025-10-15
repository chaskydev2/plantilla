import axios from '@/core/config/axios';
import type { IApiResponse, IPaginationRequest } from '@/core/types/IApi';
import type { 
  IAttributeCreateRequest, 
  IAttributeUpdateRequest,
  IAttribute
} from '@/core/types/IAttribute';

export const getAllPaginated = async (params?: IPaginationRequest): Promise<IApiResponse<IAttribute[]>> => {
  const res = await axios.get('/v1/attributes', { params });
  
  // Adaptar la respuesta del API Laravel al formato esperado por useResource
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
}

export const getAll = async (): Promise<IApiResponse> => {
  const res = await axios.get('/v1/attributes/all');
  
  // Adaptar la respuesta del API Laravel al formato esperado
  return {
    success: true,
    message: res.data.message,
    data: res.data.data || res.data
  };
}

export const create = async (request: IAttributeCreateRequest): Promise<IApiResponse> => {
  const res = await axios.post('/v1/attributes', request);
  
  // Adaptar la respuesta del API Laravel al formato esperado
  return {
    success: true,
    message: res.data.message,
    data: res.data.data
  };
}

export const update = async (id: number, request: IAttributeUpdateRequest): Promise<IApiResponse> => {
  const res = await axios.put(`/v1/attributes/${id}`, request);
  
  // Adaptar la respuesta del API Laravel al formato esperado
  return {
    success: true,
    message: res.data.message,
    data: res.data.data
  };
}

export const remove = async (id: number): Promise<IApiResponse> => {
  try {
    const res = await axios.delete(`/v1/attributes/${id}`);
    
    // Adaptar la respuesta del API Laravel al formato esperado
    return {
      success: true,
      message: res.data.message || 'Attribute deleted successfully',
      data: res.data.data || null
    };
  } catch (error: any) {
    // Si hay un error del servidor, retornamos una respuesta de error consistente
    if (error.response?.status === 500) {
      const serverError = error.response.data;
      return {
        success: false,
        message: serverError.message || 'Server error occurred while deleting attribute',
        data: null
      };
    }
    
    // Para otros errores, también retornamos una respuesta consistente
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Error occurred while deleting attribute',
      data: null
    };
  }
}

export const show = async (id: number): Promise<IApiResponse> => {
  const res = await axios.get(`/v1/attributes/${id}`);
  
  // Adaptar la respuesta del API Laravel al formato esperado
  return {
    success: true,
    message: res.data.message,
    data: res.data.data
  };
}

export const AttributeService = {
  getAllPaginated,
  getAll,
  create,
  update,
  remove,
  show
}