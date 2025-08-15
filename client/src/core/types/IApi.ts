export interface IApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  errors?: Record<string, string[]> | string[];
  meta?: {
    pagination: IPagination;
  };
}

export interface ISortBy {
  sort: string;
  order: "asc" | "desc";
}

export interface IPaginationRequest {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: ISortBy;
  [key: string]: any;
}

export interface IPagination {
  total: number;
  count: number;
  per_page: number;
  current_page: number;
  total_pages: number;
}
