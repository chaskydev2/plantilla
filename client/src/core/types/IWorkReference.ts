export interface IWorkReference {
  id: any;
  user_id: any;
  reference_name: string;
  company: string;
  position: string;
  phone: string;
  email: string;
  additional_notes: string;
}

export interface IWorkReferenceCreateRequest {
  reference_name: string;
  company: string;
  position: string;
  phone: string;
  email: string;
  additional_notes: string;
}

export interface IWorkReferenceUpdateRequest {
  reference_name: string;
  company: string;
  position: string;
  phone: string;
  email: string;
  additional_notes: string;
}
