import axios from '@/core/config/axios';
import type { IAuthRequest, IRegisterHomeownerRequest, IAuthResponse, IMeResponse } from '@/core/types/IAuth';

const login = async (data: IAuthRequest): Promise<IAuthResponse> => {
  const response = await axios.post('/v1/login', data);
  return response.data;
};

const me = async (): Promise<IMeResponse> => {
  const response = await axios.post('/v1/me');
  return response.data;
};

const logout = async (): Promise<void> => {
  await axios.post('/v1/logout');
};

const registerHomeowner = async (data: IRegisterHomeownerRequest): Promise<IAuthResponse> => {
  const response = await axios.post('/v1/register/homeowner', data);
  return response.data;
};

const registerContractor = async (data: any): Promise<IAuthResponse> => {
  const response = await axios.post('/v1/register/contractor', data);
  return response.data;
};

export const AuthService = {
  login,
  me,
  logout,
  registerHomeowner,
  registerContractor
}
