import apiClient from "src/global/services/ApiClient";
import {
  AddressCreateDto,
  AddressUpdateDto,
  AddressResponseDto,
  AddressListResponseDto,
} from "../types/address";

export const addressService = {
  // 주소 목록 가져오기
  getAddresses: async (): Promise<AddressResponseDto[]> => {
    const response = await apiClient.get<AddressListResponseDto>("/addresses");
    return response.data.addresses;
  },

  // 단일 주소 가져오기
  getAddress: async (id: number): Promise<AddressResponseDto> => {
    const response = await apiClient.get<AddressResponseDto>(
      `/addresses/${id}`
    );
    return response.data;
  },

  // 주소 생성하기
  createAddress: async (address: AddressCreateDto): Promise<string> => {
    const response = await apiClient.post<string>("/addresses", address);
    return response.data;
  },

  // 주소 수정하기
  updateAddress: async (address: AddressUpdateDto): Promise<string> => {
    const response = await apiClient.put<string>("/addresses", address);
    return response.data;
  },

  // 주소 삭제하기
  deleteAddress: async (id: number): Promise<string> => {
    const response = await apiClient.delete<string>(`/addresses/${id}`);
    return response.data;
  },
};
