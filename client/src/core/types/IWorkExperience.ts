export interface IWorkExperience {
  id: any;
  company_name: string;
  company_location: string;
  start_date: string;
  end_date: string;
  position: string;
  responsibilities: string;
}

export interface IWorkExperienceCreateRequest {
  company_name: string;
  company_location: string;
  start_date: string;
  end_date: string;
  position: string;
  responsibilities: string;
}

export interface IWorkExperienceUpdateRequest {
  company_name: string;
  company_location: string;
  start_date: string;
  end_date: string;
  position: string;
  responsibilities: string;
}
