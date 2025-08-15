export interface IUserCreateRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role_id: any;
  edit_profile: boolean;
}

export interface IUserUpdateRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role_id: any;
  edit_profile: boolean;
}

export interface IUserResponse {
  id: any;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  deleted_id: null | string;
  role_id: any;
  role_name: any;
  edit_profile: boolean;
}
