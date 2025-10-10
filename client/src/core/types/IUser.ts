export interface IUserCreateRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role_ids: number[]; // Cambiar de role_id a role_ids array
  edit_profile: boolean;
}

export interface IUserUpdateRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role_ids: number[]; // Cambiar de role_id a role_ids array
  edit_profile: boolean;
}

export interface IUserResponse {
  id: any;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  deleted_id: null | string;
  role_id: any; // Mantener para compatibilidad
  role_name: any; // Mantener para compatibilidad
  roles: Array<{ id: number; name: string }>; // Agregar array de roles
  edit_profile: boolean;
}
