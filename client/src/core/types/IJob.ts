export interface IJob {
  id: number;
  id_creator: number;
  id_homeowner: number | null;
  title: string;
  description: string | null;
  location: string;
  service_type: string;
  image_url: string | null;
  url: string | null;
  amount_paid: number | null;
  status?: string;
  is_active?: boolean;
  comment?: string | null;
  job_date: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface IJobCreateRequest {
  id_creator: number;
  id_homeowner?: number | null;
  title: string;
  description?: string | null;
  location: string;
  service_type: string;
  image_url?: string | null;
  url?: string | null;
  amount_paid?: number | null;
  status?: string;
  is_active?: boolean;
  comment?: string | null;
  job_date?: string | null;
}

export interface IJobUpdateRequest extends Partial<IJobCreateRequest> {}
