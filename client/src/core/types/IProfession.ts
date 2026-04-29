export interface IProfessionRequest {
  name: string;
  slug?: string;
  description?: string;
  icon?: string | null;
  image?: string | null;
}

export interface IProfessionCreateRequest {
  name: string;
  slug?: string;
  description?: string;
  icon?: string | null;
  image?: string | null;
  service_id: string;
}

export interface IProfessionUpdateRequest {
  name?: string;
  slug?: string;
  description?: string;
  icon?: string | null;
  image?: string | null;
  service_id: string;
  remove_image?: boolean;
}

export interface IProfession {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string | null;
  image?: string | null;
  contractors_count?: number;
  users_count?: number;
  service_id: string;
  timestamps: {
    created_at: string;
    updated_at: string;
  };
}

export interface IProfessionResponse {
  id: number;
  name: string;
  slug: string;
  description?: string;
  contractors_count?: number;
  users_count?: number;
  service_id: string;
  timestamps: {
    created_at: string;
    updated_at: string;
  };
}