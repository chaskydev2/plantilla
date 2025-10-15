export interface IProfessionRequest {
  name: string;
  slug?: string;
  description?: string;
}

export interface IProfessionCreateRequest {
  name: string;
  slug?: string;
  description?: string;
}

export interface IProfessionUpdateRequest {
  name?: string;
  slug?: string;
  description?: string;
}

export interface IProfession {
  id: number;
  name: string;
  slug: string;
  description?: string;
  contractors_count?: number;
  users_count?: number;
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
  timestamps: {
    created_at: string;
    updated_at: string;
  };
}