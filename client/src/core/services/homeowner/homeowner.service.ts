import axios from '@/core/config/axios';
import type { IApiResponse, IPaginationRequest } from '@/core/types/IApi';
import type { IHomeownerForm, IHomeownerFilters } from '@/core/types/IHomeowner';

export const getAllPaginated = async (params?: IPaginationRequest & IHomeownerFilters, config: { signal?: AbortSignal } = {}): Promise<IApiResponse> => {
  try {
    const res = await axios.get('/v1/homeowner-profiles', { params, ...config });
  
    // 🔧 SOLUCION: Transformar la respuesta para que useResource la entienda
    const transformedResponse: IApiResponse = {
      success: true,                    // ← Agregar el campo success que falta
      data: res.data.data || [],        // ← Los homeowners están en res.data.data
      meta: res.data.meta ? {           // ← Transformar la paginación si existe
        pagination: res.data.meta
      } : undefined,
      message: 'Homeowners retrieved successfully'
    };
    
    
    return transformedResponse;
  } catch (error: any) {
    console.error('❌ Error fetching homeowner profiles:', error);
    console.error('❌ Error response:', error.response?.data);
    throw error;
  }
}

export const create = async (request: IHomeownerForm): Promise<IApiResponse> => {
  try {
    const res = await axios.post('/v1/homeowner-profiles', request);
    return res.data;
  } catch (error) {
    console.error('Error creating homeowner profile:', error);
    throw error;
  }
}

export const update = async (id: any, request: Partial<IHomeownerForm>): Promise<IApiResponse> => {
  const res = await axios.put(`/v1/homeowner-profiles/${id}`, request);
  return res.data;
}

export const get = async (id: any): Promise<IApiResponse> => {
  const res = await axios.get(`/v1/homeowner-profiles/${id}`);
  return res.data;
}

export const remove = async (id: any): Promise<IApiResponse> => {
  const response = await axios.delete(`/v1/homeowner-profiles/${id}`);
  return response.data;
}

// Método específico para obtener todos los registros (ruta /all)
export const getAll = async (): Promise<IApiResponse> => {
  const res = await axios.get('/v1/homeowner-profiles/all');
  return res.data;
}

export const getStats = async (): Promise<IApiResponse> => {
  const res = await axios.get('/v1/homeowner-profiles/stats');
  return res.data;
}

export const getAttributesForHomeowners = async (): Promise<IApiResponse> => {
  const res = await axios.get('/v1/attributes/for-homeowners');
  return res.data;
}

// Métodos específicos para filtros (usando parámetros en lugar de rutas específicas)
export const getByCountry = async (countryCode: string, params?: IPaginationRequest): Promise<IApiResponse> => {
  const filterParams = { ...params, country_code: countryCode };
  const res = await axios.get('/v1/homeowner-profiles', { params: filterParams });
  return res.data;
}

export const getByState = async (stateCode: string, params?: IPaginationRequest): Promise<IApiResponse> => {
  const filterParams = { ...params, state_code: stateCode };
  const res = await axios.get('/v1/homeowner-profiles', { params: filterParams });
  return res.data;
}

export const getByZip = async (zip: string, params?: IPaginationRequest): Promise<IApiResponse> => {
  const filterParams = { ...params, preferred_zip: zip };
  const res = await axios.get('/v1/homeowner-profiles', { params: filterParams });
  return res.data;
}

export const HomeownerService = {
  getAllPaginated,
  getAll,
  create,
  update,
  get,
  remove,
  getByCountry,
  getByState,
  getByZip,
  getStats,
  getAttributesForHomeowners,
}