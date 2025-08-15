export interface ICourse {
  id: any;
  name: string;
  instructor_id: string;
  start_date: string;
  end_date: string;
  modality: string;
  location: string;
  cost: number;
  max_capacity: number;
  status: string;
  has_certificate: boolean;
  attendance_tracking: boolean;
}

export interface ICourseCreateRequest {
  name: string;
  instructor_id: string;
  start_date: string;
  end_date: string;
  modality: string;
  location: string;
  cost: number;
  max_capacity: number;
  status: string;
  has_certificate: boolean;
  attendance_tracking: boolean;
}

export interface ICourseUpdateRequest {
  name: string;
  instructor_id: string;
  start_date: string;
  end_date: string;
  modality: string;
  location: string;
  cost: number;
  max_capacity: number;
  status: string;
  has_certificate: boolean;
  attendance_tracking: boolean;
}
