export interface IJobApplication {
  id: number;
  job_post_id: number;
  contractor_id: number;
  cover_letter?: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}
