export interface IService {
  id: number;
  name: string;
  slug: string;
  icon?: string | null;
  image?: string | null;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface IServiceCreateRequest {
  name: string;
  slug?: string | null;
  icon?: string | null;
  image?: string | null;
  description?: string | null;
}

export interface IServiceUpdateRequest {
  name?: string;
  slug?: string | null;
  icon?: string | null;
  remove_icon?: boolean;
  image?: string | null;
  remove_image?: boolean;
  description?: string | null;
}
