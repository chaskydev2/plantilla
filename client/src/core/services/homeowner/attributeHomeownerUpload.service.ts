import apiClient from '@/core/config/axios';
import type { AxiosProgressEvent } from 'axios';

export class AttributeHomeownerUploadService {
  static async getByHomeowner(homeowner_id: number, token?: string) {
    try {
      let realToken = token || localStorage.getItem('_tkn') || '';
      if (!realToken || realToken === 'undefined' || realToken === 'null') {
        throw new Error('No se encontró un token de autenticación válido (_tkn) en localStorage. Inicia sesión nuevamente.');
      }

      const response = await apiClient.get(`/v1/attribute-homeowners/by-homeowner/${homeowner_id}`, {
        headers: {
          Authorization: `Bearer ${realToken}`,
        },
      });

      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }

      throw error;
    }
  }

  static async upload(
    homeowner_id: number,
    attributes: { attribute_id: number; value: File | null }[],
    token: string,
    options?: { onUploadProgress?: (progressEvent: AxiosProgressEvent) => void }
  ) {
    const realToken = token || localStorage.getItem('_tkn');
    if (!realToken || realToken === 'undefined' || realToken === 'null') {
      throw new Error('No se encontró un token de autenticación válido (_tkn) en localStorage. Inicia sesión nuevamente.');
    }

    const formData = new FormData();
    formData.append('homeowner_id', String(homeowner_id));

    attributes.forEach((attr, idx) => {
      formData.append(`attributes[${idx}][attribute_id]`, String(attr.attribute_id));
      if (attr.value) {
        formData.append(`attributes[${idx}][value]`, attr.value);
      }
    });

    return apiClient.post('/v1/attribute-homeowners', formData, {
      headers: {
        Authorization: `Bearer ${realToken}`,
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: options?.onUploadProgress,
    });
  }

  static async updateDocument(
    id: number,
    homeowner_id: number,
    attribute_id: number,
    file: File,
    token?: string,
    options?: { onUploadProgress?: (progressEvent: AxiosProgressEvent) => void }
  ) {
    const realToken = token || localStorage.getItem('_tkn');
    if (!realToken || realToken === 'undefined' || realToken === 'null') {
      throw new Error('No se encontró un token de autenticación válido (_tkn) en localStorage. Inicia sesión nuevamente.');
    }

    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Solo se permiten archivos PDF o imágenes (JPG, PNG)');
    }

    if (file.size > 10 * 1024 * 1024) {
      throw new Error('El archivo no puede superar los 10MB');
    }

    const formData = new FormData();
    formData.append('homeowner_id', String(homeowner_id));
    formData.append('attribute_id', String(attribute_id));
    formData.append('value', file);

    try {
      const response = await apiClient.post(`/v1/attribute-homeowners/${id}/update-document`, formData, {
        headers: {
          Authorization: `Bearer ${realToken}`,
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: options?.onUploadProgress,
      });

      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }

      throw error;
    }
  }
}
