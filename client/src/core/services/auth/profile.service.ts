import axios from '@/core/config/axios';
import type { IApiResponse } from '@/core/types/IApi';
import type { IPersonalInformationRequest, IProfileRequest } from '@/core/types/IProfile';

const profile = async (): Promise<IApiResponse> => {
  const response = await axios.post('/v1/profile');
  return response.data;
}

const update = async (id: any, request: IProfileRequest): Promise<IApiResponse> => {
  const response = await axios.put(`/v1/profile/${id}`, request);
  return response.data;
}

const updatePersonalInformation = async (id: any, request: IPersonalInformationRequest): Promise<IApiResponse> => {
  const response = await axios.put(`/v1/profile/${id}/personal_information`, request);
  return response.data;
}

export const ProfileService = {
  profile,
  update,
  updatePersonalInformation,
}
