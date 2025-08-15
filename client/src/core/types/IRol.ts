import type { IPermissionResponse } from "./IPermission";

export interface IRolCreateRequest {
  name: string;
}

export interface IRolUpdateRequest {
  name: string;
}

export interface IRolResponse {
  id: any;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface IRolPermissionResponse {
  role: IRolResponse;
  permissions: IPermissionResponse[];
}

export interface IRolPermissionRequest {
  permissions: any[];
}
