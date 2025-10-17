import axios from '@/core/config/axios';
import type { IApiResponse, IPaginationRequest } from '@/core/types/IApi';
import type { 
  ICategoryCreateRequest, 
  ICategoryUpdateRequest,
  ICategory
} from '@/core/types/ICategory';

export const getAllPaginated = async (params?: IPaginationRequest): Promise<IApiResponse<ICategory[]>> => {
  const res = await axios.get('/v1/categories', { params });
  
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
  const res = await axios.get('/v1/categories/all');
  
  // Adaptar la respuesta del API Laravel al formato esperado
  return {
    success: true,
    message: res.data.message,
    data: res.data.data || res.data
  };
}

// Get categories in tree structure for dropdowns
export const getTree = async (): Promise<IApiResponse> => {
  const res = await axios.get('/v1/categories/tree');
  
  return {
    success: true,
    message: res.data.message,
    data: res.data.data || res.data
  };
}

// Get only parent categories (no parent_id)
export const getParents = async (): Promise<IApiResponse> => {
  const res = await axios.get('/v1/categories/parents');
  
  return {
    success: true,
    message: res.data.message,
    data: res.data.data || res.data
  };
}

// Get children of a specific category
export const getChildren = async (parentId: number): Promise<IApiResponse> => {
  const res = await axios.get(`/v1/categories/${parentId}/children`);
  
  return {
    success: true,
    message: res.data.message,
    data: res.data.data || res.data
  };
}

export const create = async (request: ICategoryCreateRequest): Promise<IApiResponse> => {
  const res = await axios.post('/v1/categories', request);
  
  // Adaptar la respuesta del API Laravel al formato esperado
  return {
    success: true,
    message: res.data.message,
    data: res.data.data
  };
}

export const update = async (id: number, request: ICategoryUpdateRequest): Promise<IApiResponse> => {
  const res = await axios.put(`/v1/categories/${id}`, request);
  
  // Adaptar la respuesta del API Laravel al formato esperado
  return {
    success: true,
    message: res.data.message,
    data: res.data.data
  };
}

export const remove = async (id: number): Promise<IApiResponse> => {
  try {
    const res = await axios.delete(`/v1/categories/${id}`);
    
    // Adaptar la respuesta del API Laravel al formato esperado
    return {
      success: true,
      message: res.data.message || 'Category deleted successfully',
      data: res.data.data || null
    };
  } catch (error: any) {
    // Si hay un error del servidor, retornamos una respuesta de error consistente
    if (error.response?.status === 500) {
      const serverError = error.response.data;
      return {
        success: false,
        message: serverError.message || 'Server error occurred while deleting category',
        data: null
      };
    }
    
    // Para otros errores, también retornamos una respuesta consistente
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Error occurred while deleting category',
      data: null
    };
  }
}

export const show = async (id: number): Promise<IApiResponse> => {
  const res = await axios.get(`/v1/categories/${id}`);
  
  // Adaptar la respuesta del API Laravel al formato esperado
  return {
    success: true,
    message: res.data.message,
    data: res.data.data
  };
}

// Move category to a new parent
export const moveTo = async (id: number, newParentId: number | null): Promise<IApiResponse> => {
  const res = await axios.patch(`/v1/categories/${id}/move`, { parent_id: newParentId });
  
  return {
    success: true,
    message: res.data.message,
    data: res.data.data
  };
}

export const CategoryService = {
  getAllPaginated,
  getAll,
  getTree,
  getParents,
  getChildren,
  create,
  update,
  remove,
  show,
  moveTo
}