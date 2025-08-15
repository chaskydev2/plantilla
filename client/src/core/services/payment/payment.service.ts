import axios from "@/core/config/axios";
import type { IApiResponse, IPaginationRequest } from "@/core/types/IApi";
import type {
  IPaymentCreateRequest,
  IPaymentUpdateRequest,
} from "@/core/types/IPayment";

export const getAllPaginated = async (
  params?: IPaginationRequest,
  config: { signal?: AbortSignal } = {}
): Promise<IApiResponse> => {
  const res = await axios.get("/v1/payment", { params, ...config });
  return res.data;
};

export const create = async (
  request: IPaymentCreateRequest
): Promise<IApiResponse> => {
  const res = await axios.post("/v1/payment", request);
  return res.data;
};

export const getAll = async (): Promise<IApiResponse> => {
  const res = await axios.get("/v1/payment/all");
  return res.data;
};

export const update = async (
  id: any,
  request: IPaymentUpdateRequest
): Promise<IApiResponse> => {
  const res = await axios.put(`/v1/payment/${id}`, request);
  return res.data;
};

export const get = async (id: any): Promise<IApiResponse> => {
  const res = await axios.get(`/v1/payment/${id}`);
  return res.data;
};

export const remove = async (id: any): Promise<IApiResponse> => {
  const response = await axios.delete(`/v1/payment/${id}`);
  return response.data;
};

export const printVoucher = async (id: any): Promise<Blob> => {
  const response = await axios.get(`/v1/payment/printvoucher/${id}`, {
    responseType: "blob",
  });
  return response.data;
};

export const exportReport = async (filters: any): Promise<Blob> => {
  const params = new URLSearchParams();

  if (filters.user_id) params.append("user_id", filters.user_id.toString());
  if (filters.year) params.append("year", filters.year.toString());
  if (filters.month) params.append("month", filters.month.toString());
  if (filters.payment_type) params.append("payment_type", filters.payment_type);
  if (filters.payment_method)
    params.append("payment_method", filters.payment_method);

  const queryString = params.toString();
  const url = `/v1/payment/monthlyreportpdf${
    queryString ? `?${queryString}` : ""
  }`;

  const response = await axios.get(url, {
    responseType: "blob",
  });

  return response.data;
};

export const restore = async (id: any): Promise<IApiResponse> => {
  const response = await axios.post(`/v1/payment/${id}/restore`);
  return response.data;
};

export const PaymentService = {
  getAllPaginated,
  create,
  update,
  get,
  remove,
  printVoucher,
  exportReport,
  restore,
  getAll,
};
