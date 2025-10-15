import axios from '@/core/config/axios';
import type { IApiResponse, IPaginationRequest } from '@/core/types/IApi';
import type { 
  IProfessionCreateRequest, 
  IProfessionUpdateRequest,
  IProfession
} from '@/core/types/IProfession';

export const getAllPaginated = async (params?: IPaginationRequest): Promise<IApiResponse<IProfession[]>> => {
  const res = await axios.get('/v1/professions', { params });
  
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
  const res = await axios.get('/v1/professions/all');
  
  // Adaptar la respuesta del API Laravel al formato esperado
  return {
    success: true,
    message: res.data.message,
    data: res.data.data || res.data
  };
}

export const create = async (request: IProfessionCreateRequest): Promise<IApiResponse> => {
  const res = await axios.post('/v1/professions', request);
  
  // Adaptar la respuesta del API Laravel al formato esperado
  return {
    success: true,
    message: res.data.message,
    data: res.data.data
  };
}

export const update = async (id: number, request: IProfessionUpdateRequest): Promise<IApiResponse> => {
  const res = await axios.put(`/v1/professions/${id}`, request);
  
  // Adaptar la respuesta del API Laravel al formato esperado
  return {
    success: true,
    message: res.data.message,
    data: res.data.data
  };
}

export const remove = async (id: number): Promise<IApiResponse> => {
  try {
    const res = await axios.delete(`/v1/professions/${id}`);
    
    // Adaptar la respuesta del API Laravel al formato esperado
    return {
      success: true,
      message: res.data.message || 'Profession deleted successfully',
      data: res.data.data || null
    };
  } catch (error: any) {
    // Si hay un error del servidor, retornamos una respuesta de error consistente
    if (error.response?.status === 500) {
      const serverError = error.response.data;
      return {
        success: false,
        message: serverError.message || 'Server error occurred while deleting profession',
        data: null
      };
    }
    
    // Para otros errores, también retornamos una respuesta consistente
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Error occurred while deleting profession',
      data: null
    };
  }
}

export const show = async (id: number): Promise<IApiResponse> => {
  const res = await axios.get(`/v1/professions/${id}`);
  
  // Adaptar la respuesta del API Laravel al formato esperado
  return {
    success: true,
    message: res.data.message,
    data: res.data.data
  };
}

export const ProfessionService = {
  getAllPaginated,
  getAll,
  create,
  update,
  remove,
  show
}