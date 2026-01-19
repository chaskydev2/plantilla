import axios from '@/core/config/axios';
import type { IApiResponse, IPaginationRequest } from '@/core/types/IApi';
import type {
  IProfessionCreateRequest,
  IProfessionUpdateRequest,
  IProfession,
} from '@/core/types/IProfession';

const mimeToExtension = (mime: string) => {
  if (mime.includes('jpeg')) return 'jpg';
  if (mime.includes('png')) return 'png';
  if (mime.includes('webp')) return 'webp';
  return 'bin';
};

const dataUrlToFile = (dataUrl: string, baseName: string) => {
  const [header, data] = dataUrl.split(',');
  const match = header.match(/data:(.*?);base64/);
  const mime = match?.[1] || 'application/octet-stream';
  const binary = atob(data);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i += 1) bytes[i] = binary.charCodeAt(i);
  const ext = mimeToExtension(mime);
  const fileName = `${baseName}.${ext}`;
  return new File([bytes], fileName, { type: mime });
};

const appendFileField = (formData: FormData, key: 'image', value?: string | File | null) => {
  if (!value) return;
  if (value instanceof File) {
    formData.append(key, value);
    return;
  }
  if (typeof value === 'string' && value.startsWith('data:')) {
    const file = dataUrlToFile(value, key);
    formData.append(key, file);
  }
};

const buildFormData = (
  payload: IProfessionCreateRequest | IProfessionUpdateRequest,
  opts?: { includeRemoveFlags?: boolean }
) => {
  const fd = new FormData();

  if (payload.name !== undefined) fd.append('name', payload.name as string);
  if (payload.slug !== undefined) fd.append('slug', payload.slug as string);
  if (payload.description !== undefined) fd.append('description', payload.description as string);
  // Always forward service_id when provided (create or update)
  if ('service_id' in payload && (payload as any).service_id !== undefined) {
    fd.append('service_id', String((payload as any).service_id));
  }
  if ((payload as IProfessionCreateRequest).icon !== undefined) fd.append('icon', (payload as IProfessionCreateRequest).icon ?? '');

  appendFileField(fd, 'image', (payload as IProfessionCreateRequest).image);

  if (opts?.includeRemoveFlags && (payload as IProfessionUpdateRequest).remove_image) {
    fd.append('remove_image', '1');
  }

  return fd;
};

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
  console.log(request);
  const formData = buildFormData(request);
  const res = await axios.post('/v1/professions', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  console.log(res);
  // Adaptar la respuesta del API Laravel al formato esperado
  return {
    success: true,
    message: res.data.message,
    data: res.data.data
  };
}

export const update = async (id: number, request: IProfessionUpdateRequest): Promise<IApiResponse> => {
  console.log(request);
  const formData = buildFormData(request, { includeRemoveFlags: true });
  
  const res = await axios.post(`/v1/professions/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  
  console.log(res);
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