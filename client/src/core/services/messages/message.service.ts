import axios from '@/core/config/axios';
import type { IApiResponse } from '@/core/types/IApi';

export interface ISendMessageRequest {
  message: string;
}

export interface IChatMessage {
  id: number;
  chat_thread_id: number;
  sender_type: string;
  sender_id: number;
  message: string;
  created_at: string;
  updated_at: string;
  read_at: string | null;
  sender?: any;
}

export interface IChatThread {
  id: number;
  contractor_id: number;
  homeowner_profile_id: number;
  last_message_at: string;
  created_at: string;
  updated_at: string;
  messages?: IChatMessage[];
  contractor?: any;
  homeownerProfile?: any;
}

/**
 * Enviar un mensaje al contractor
 * @param contractorId ID del contractor
 * @param request Objeto con el mensaje
 */
export const sendMessage = async (
  contractorId: number | string,
  request: ISendMessageRequest
): Promise<IApiResponse> => {

  console.log(contractorId);
  const res = await axios.post(`/v1/chat/contractor/${contractorId}/message`, request);
  return res.data;
};

/**
 * Obtener la conversación con un contractor específico
 * @param contractorId ID del contractor
 */
export const getConversation = async (
  contractorId: number | string,
  config: { signal?: AbortSignal } = {}
): Promise<IApiResponse> => {
  const res = await axios.get(`/v1/chat/contractor/${contractorId}`, { ...config });
  return res.data;
};

/**
 * Obtener todas las conversaciones del usuario actual (homeowner)
 */
export const getThreads = async (
  config: { signal?: AbortSignal } = {}
): Promise<IApiResponse> => {
  const res = await axios.get('/chat/threads', { ...config });
  return res.data;
};

/**
 * Obtener el conteo de mensajes no leídos
 */
export const getUnreadCount = async (
  config: { signal?: AbortSignal } = {}
): Promise<IApiResponse> => {
  const res = await axios.get('/chat/unread-count', { ...config });
  return res.data;
};

/**
 * Responder desde el Contractor a un homeowner (para dashboard de contractor)
 * @param threadId ID del thread de conversación
 * @param request Objeto con el mensaje
 */
export const contractorReply = async (
  threadId: number | string,
  request: ISendMessageRequest
): Promise<IApiResponse> => {
  const res = await axios.post(`/chat/contractor/thread/${threadId}/reply`, request);
  return res.data;
};

/**
 * Responder como Contractor (nueva ruta con contractorId y threadId)
 * @param contractorId ID del contractor
 * @param threadId ID del thread de conversación
 * @param request Objeto con el mensaje
 */
export const contractorReplyToThread = async (
  contractorId: number | string,
  threadId: number | string,
  request: ISendMessageRequest
): Promise<IApiResponse> => {
  const res = await axios.post(`/v1/chat/contractor/${contractorId}/thread/${threadId}/reply`, request);
  return res.data;
};

/**
 * Obtener todas las conversaciones del contractor actual
 */
export const getContractorThreads = async (
  config: { signal?: AbortSignal } = {}
): Promise<IApiResponse> => {
  const res = await axios.get('/chat/contractor/threads', { ...config });
  return res.data;
};

/**
 * Obtener conversación específica para el contractor
 * @param threadId ID del thread
 */
export const getContractorConversation = async (
  threadId: number | string,
  config: { signal?: AbortSignal } = {}
): Promise<IApiResponse> => {
  const res = await axios.get(`/v1/chat/contractor/thread/${threadId}`, { ...config });
  return res.data;
};

/**
 * Delete a single message inside a thread
 * DELETE /v1/chat/threads/{threadId}/messages/{messageId}
 */
export const deleteMessage = async (
  threadId: number | string,
  messageId: number | string
): Promise<IApiResponse> => {
  const res = await axios.delete(`/v1/chat/threads/${threadId}/messages/${messageId}`);
  return res.data;
};

/**
 * Delete an entire thread
 * DELETE /v1/chat/threads/{threadId}
 */
export const deleteThread = async (
  threadId: number | string
): Promise<IApiResponse> => {
  const res = await axios.delete(`/v1/chat/threads/${threadId}`);
  return res.data;
};

/**
 * Obtener conteo de mensajes no leídos para el contractor
 */
export const getContractorUnreadCount = async (
  config: { signal?: AbortSignal } = {}
): Promise<IApiResponse> => {
  const res = await axios.get('/chat/contractor/unread-count', { ...config });
  return res.data;
};

/**
 * Obtener todos los threads del contractor con paginación
 * @param contractorId ID del contractor
 * @param page Número de página (default: 1)
 * @param perPage Items por página (default: 15)
 * @param config Configuración adicional (signal, etc)
 */
export const getContractorAllThreads = async (
  contractorId: number | string,
  page: number = 1,
  perPage: number = 15,
  config: { signal?: AbortSignal } = {}
): Promise<IApiResponse> => {
  const res = await axios.get(`/v1/chat/contractor/${contractorId}/all-threads`, {
    params: {
      page,
      per_page: perPage,
    },
    ...config,
  });
  return res.data;
};

/**
 * Obtener todos los threads del homeowner con paginación
 * @param homeownerId ID del homeowner
 * @param page Número de página (default: 1)
 * @param perPage Items por página (default: 15)
 * @param config Configuración adicional (signal, etc)
 */
export const getHomeownerAllThreads = async (
  homeownerId: number | string,
  page: number = 1,
  perPage: number = 15,
  config: { signal?: AbortSignal } = {}
): Promise<IApiResponse> => {
  const res = await axios.get(`/v1/chat/homeowner/${homeownerId}/all-threads`, {
    params: {
      page,
      per_page: perPage,
    },
    ...config,
  });
  return res.data;
};

export const MessageService = {
  sendMessage,
  getConversation,
  getThreads,
  getUnreadCount,
  contractorReply,
  contractorReplyToThread,
  getContractorThreads,
  getContractorConversation,
  getContractorUnreadCount,
  getContractorAllThreads,
  getHomeownerAllThreads,
  deleteMessage,
  deleteThread,
};
