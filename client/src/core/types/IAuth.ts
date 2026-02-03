import type { IPermission } from "./IPermission";

export interface IAuth {
  id: string;
  name: string;
  email: string;
  role_name?: string | null;
  role_id?: string | null;
}

export interface IAuthRequest {
  email: string;
  password: string;
}

export interface IRegisterHomeownerRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  preferred_zip: string;
  password: string;
}

export interface IAuthResponse {
  data: {
    access_token: string;
    expires_at: string;
    user: IAuth;
    permissions: IPermission[];
    roles: string[];
  }; 
}

export interface IMeResponse {
  data: {
    user: IAuth;
    permissions: IPermission[];
    roles: string[];
  };
}
