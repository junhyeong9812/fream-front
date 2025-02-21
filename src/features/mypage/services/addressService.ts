import apiClient from "src/global/services/ApiClient";
import {
  AddressCreateDto,
  AddressUpdateDto,
  AddressResponseDto,
  AddressListResponseDto,
} from "../types/address";

export const addressService = {
  // 주소 목록 조회
  getAddresses: async (): Promise<AddressResponseDto[]> => {
    try {
      const response = await apiClient.get<AddressListResponseDto>(
        "/addresses"
      );
      return response.data.addresses;
    } catch (error) {
      throw new Error("Failed to fetch addresses");
    }
  },

  // 특정 주소 조회
  getAddress: async (addressId: number): Promise<AddressResponseDto> => {
    try {
      const response = await apiClient.get<AddressResponseDto>(
        `/addresses/${addressId}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch address");
    }
  },

  // 주소 생성
  createAddress: async (addressData: AddressCreateDto): Promise<string> => {
    try {
      const response = await apiClient.post<string>("/addresses", addressData);
      return response.data;
    } catch (error) {
      throw new Error("Failed to create address");
    }
  },

  // 주소 수정
  updateAddress: async (addressData: AddressUpdateDto): Promise<string> => {
    try {
      const response = await apiClient.put<string>("/addresses", addressData);
      return response.data;
    } catch (error) {
      throw new Error("Failed to update address");
    }
  },

  // 주소 삭제
  deleteAddress: async (addressId: number): Promise<string> => {
    try {
      const response = await apiClient.delete<string>(
        `/addresses/${addressId}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to delete address");
    }
  },
};
