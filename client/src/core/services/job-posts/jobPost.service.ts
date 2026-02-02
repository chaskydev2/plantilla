
import axios from '@/core/config/axios';
import type { IApiResponse, IPagination, IPaginationRequest } from '@/core/types/IApi';

type JobPostListResponse = {
  data?: any[];
  current_page?: number;
  last_page?: number;
  per_page?: number | string;
  total?: number;
};

const toApiParams = (params: IPaginationRequest = {}) => {
  const { page, limit, sortBy, ...rest } = params;
  const mapped: Record<string, unknown> = { ...rest };

  if (page !== undefined) mapped.page = page;
  if (limit !== undefined) mapped.per_page = limit;
  if (sortBy?.sort) mapped.sort_by = sortBy.sort;
  if (sortBy?.order) mapped.sort_dir = sortBy.order;

  return mapped;
};

const toPagination = (payload: JobPostListResponse): IPagination => {
  const dataLength = Array.isArray(payload.data) ? payload.data.length : 0;
  const perPageRaw = payload.per_page ?? dataLength;
  const perPage = Number(perPageRaw);
  const normalizedPerPage = Number.isFinite(perPage) && perPage > 0 ? perPage : dataLength;

  return {
    total: payload.total ?? 0,
    count: dataLength,
    per_page: normalizedPerPage,
    current_page: payload.current_page ?? 1,
    total_pages: payload.last_page ?? 1,
  };
};

// --- IMAGE HANDLING HELPERS (copied from ServiceService) ---
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
  for (let i = 0; i < len; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  const ext = mimeToExtension(mime);
  const fileName = `${baseName}.${ext}`;
  return new File([bytes], fileName, { type: mime });
};

const appendFileField = (formData: FormData, key: 'image', value?: string | File | null) => {
  if (value === undefined || value === null || value === '') return;
  if (value instanceof File) {
    formData.append(key, value);
    return;
  }
  if (typeof value === 'string' && value.startsWith('data:')) {
    const file = dataUrlToFile(value, key);
    formData.append(key, file);
    return;
  }
  // If value is a string (URL), do not append (keep existing image)
};

const buildFormData = (request: any, options?: { includeRemoveFlags?: boolean }) => {
  const formData = new FormData();
  Object.entries(request).forEach(([key, value]) => {
    if (key === 'image') {
      // Only append image if it's File or data URL, not empty string or URL string
      appendFileField(formData, 'image', value as string | File | null);
    } else if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });
  if (options?.includeRemoveFlags && request.remove_image) {
    formData.append('remove_image', '1');
  }
  return formData;
};

export const jobPostService = {
  async getPublicJobPosts(): Promise<any[]> {
    const response = await axios.get('/v1/job-posts/public');
    console.log('Public job posts response:', response.data);
    return response.data?.data || [];
  },
  async getAllPaginated(
    params: IPaginationRequest = {},
    config: { signal?: AbortSignal } = {}
  ): Promise<IApiResponse<any[]>> {
    const response = await axios.get('/v1/job-posts', {
      params: toApiParams(params),
      ...config,
    });
    const payload: JobPostListResponse = response.data ?? {};
    const data = Array.isArray(payload.data) ? payload.data : [];
    return {
      success: true,
      data,
      meta: {
        pagination: toPagination(payload),
      },
    };
  },
  async remove(id: number) {
    const url = `/v1/job-posts/${id}`;
    try {
      console.log('DELETE URL:', url);
      const response = await axios.delete(url);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar:', error);
      throw error;
    }
  },
  async create(data: any) {
    // Always use FormData for image upload
    const formData = buildFormData(data);
    const response = await axios.post('/v1/job-posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  async update(id: number, data: any) {
    // Always use FormData for image upload, include remove_image flag
    const formData = buildFormData(data, { includeRemoveFlags: true });
    const response = await axios.put(`/v1/job-posts/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
