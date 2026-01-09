import apiClient from '@/core/config/axios';
import type { AxiosProgressEvent } from 'axios';

export class AttributeContractorUploadService {
  /**
   * Obtiene los atributos cargados por un contratista específico
   * @param contractor_id
   * @param token: string (Bearer token)
   */
  static async getByContractor(contractor_id: number, token?: string) {
    try {
      let realToken = token;
      if (!realToken) {
        realToken = localStorage.getItem('_tkn') || '';
      }
      if (!realToken || realToken === 'undefined' || realToken === 'null') {
        throw new Error('No se encontró un token de autenticación válido (_tkn) en localStorage. Inicia sesión nuevamente.');
      }
      const response = await apiClient.get(`/v1/attribute-contractors/by-contractor/${contractor_id}`, {
        headers: {
          'Authorization': `Bearer ${realToken}`,
        },
      });
      // Si la respuesta es exitosa, retorna solo los datos
      return response.data;
    } catch (error: any) {
      // Si es un error de axios, intenta extraer el mensaje
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
      // Si es otro error, lánzalo tal cual
      throw error;
    }
  }

  /**
   * Envía múltiples archivos y atributos en un solo request (FormData)
   * @param contractor_id
   * @param attributes: Array<{ attribute_id: number, value: File|null }>
   * @param token: string (Bearer token)
   * @param options?: { onUploadProgress?: (progressEvent: AxiosProgressEvent) => void }
   */
  static async upload(
    contractor_id: number,
    attributes: { attribute_id: number; value: File | null }[],
    token: string,
    options?: { onUploadProgress?: (progressEvent: AxiosProgressEvent) => void }
  ) {
    // Validar el token
    const realToken = token || localStorage.getItem('_tkn');
    if (!realToken || realToken === 'undefined' || realToken === 'null') {
      throw new Error('No se encontró un token de autenticación válido (_tkn) en localStorage. Inicia sesión nuevamente.');
    }

    const formData = new FormData();
    formData.append('contractor_id', String(contractor_id));

    attributes.forEach((attr, idx) => {
      formData.append(`attributes[${idx}][attribute_id]`, String(attr.attribute_id));
      if (attr.value) {
        formData.append(`attributes[${idx}][value]`, attr.value);
      }
    });

    return apiClient.post('/v1/attribute-contractors', formData, {
      headers: {
        'Authorization': `Bearer ${realToken}`,
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: options?.onUploadProgress,
    });
  }

  /**
   * Actualiza el documento de un attribute_contractor específico
   * @param id - ID del attribute_contractor a actualizar
   * @param contractor_id - ID del contratista
   * @param attribute_id - ID del atributo
   * @param file - Archivo a subir (PDF, JPG, JPEG, PNG)
   * @param token - Bearer token (opcional, se obtiene de localStorage)
   * @param options - Opciones adicionales como onUploadProgress
   */
  static async updateDocument(
    id: number,
    contractor_id: number,
    attribute_id: number,
    file: File,
    token?: string,
    options?: { onUploadProgress?: (progressEvent: AxiosProgressEvent) => void }
  ) {
    // Validar el token
    const realToken = token || localStorage.getItem('_tkn');
    if (!realToken || realToken === 'undefined' || realToken === 'null') {
      throw new Error('No se encontró un token de autenticación válido (_tkn) en localStorage. Inicia sesión nuevamente.');
    }

    // Validar tipo de archivo
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Solo se permiten archivos PDF o imágenes (JPG, PNG)');
    }

    // Validar tamaño (máx 10MB según el backend)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('El archivo no puede superar los 10MB');
    }

    const formData = new FormData();
    formData.append('contractor_id', String(contractor_id));
    formData.append('attribute_id', String(attribute_id));
    formData.append('value', file);

    try {
      const response = await apiClient.post(`/v1/attribute-contractors/${id}/update-document`, formData, {
        headers: {
          'Authorization': `Bearer ${realToken}`,
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: options?.onUploadProgress,
      });

      return response.data;
    } catch (error: any) {
      // Si es un error de axios, intenta extraer el mensaje
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
      // Si es otro error, lánzalo tal cual
      throw error;
    }
  }
}