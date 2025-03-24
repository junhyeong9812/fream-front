
import apiClient from "src/global/services/ApiClient";
import { AddressResponseDto } from "../types/address";

export const addressService = {
  // 주소 목록 가져오기
  getAddresses: async (): Promise<AddressResponseDto[]> => {
    const response = await apiClient.get<{ addresses: AddressResponseDto[] }>("/addresses");
    return response.data.addresses;
  },

  // 단일 주소 가져오기
  getAddress: async (id: number): Promise<AddressResponseDto> => {
    const response = await apiClient.get<AddressResponseDto>(`/addresses/${id}`);
    return response.data;
  }
};

