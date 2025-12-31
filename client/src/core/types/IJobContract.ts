export interface IJobContract {
  id: number;
  job_post_id: number;
  contractor_id: number;
  start_date: string;
  end_date: string;
  status: string;
  jobPost?: any; // Puedes tipar mejor si tienes el modelo
  contractor?: any; // Puedes tipar mejor si tienes el modelo
}
