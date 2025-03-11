// src/services/paymentService.ts
import apiClient from "src/global/services/ApiClient";
import {
  PaymentInfoCreateDto,
  PaymentInfoDto,
} from "../types/paymentInfoTypes";

// 결제 정보 생성
export const createPaymentInfo = async (
  data: PaymentInfoCreateDto
): Promise<string> => {
  try {
    const response = await apiClient.post("/payment-info", data);
    return response.data;
  } catch (error) {
    console.error("결제 정보 생성 오류:", error);
    throw error;
  }
};

// 결제 정보 삭제
export const deletePaymentInfo = async (id: number): Promise<string> => {
  try {
    const response = await apiClient.delete(`/payment-info/${id}`);
    return response.data;
  } catch (error) {
    console.error("결제 정보 삭제 오류:", error);
    throw error;
  }
};

// 결제 정보 목록 조회
export const getPaymentInfos = async (): Promise<PaymentInfoDto[]> => {
  try {
    const response = await apiClient.get("/payment-info");
    return response.data;
  } catch (error) {
    console.error("결제 정보 목록 조회 오류:", error);
    throw error;
  }
};

// 결제 정보 단일 조회
export const getPaymentInfo = async (id: number): Promise<PaymentInfoDto> => {
  try {
    const response = await apiClient.get(`/payment-info/${id}`);
    return response.data;
  } catch (error) {
    console.error("결제 정보 조회 오류:", error);
    throw error;
  }
};
