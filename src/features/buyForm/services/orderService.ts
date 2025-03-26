import apiClient from "src/global/services/ApiClient";
import { OrderBidRequestDto, PayAndShipmentRequestDto } from "../types/order";

export const orderService = {
  // 주문 입찰 생성
  createOrderBid: async (orderBid: OrderBidRequestDto): Promise<number> => {
    const response = await apiClient.post<number>("/order-bids", orderBid);
    return response.data;
  },

  // 주문 입찰 삭제
  deleteOrderBid: async (orderBidId: number): Promise<void> => {
    await apiClient.delete(`/order-bids/${orderBidId}`);
  },

  // 즉시 구매 입찰 생성
  createInstantOrderBid: async (
    saleBidId: number,
    addressId: number,
    warehouseStorage: boolean,
    paymentRequest: any
  ): Promise<number> => {
    const response = await apiClient.post<number>("/order-bids/instant", {
      saleBidId,
      addressId,
      warehouseStorage,
      paymentRequest,
    });
    return response.data;
  },

  // 결제 및 배송 정보 처리
  processPaymentAndShipment: async (
    orderId: number,
    payAndShipmentRequest: PayAndShipmentRequestDto
  ): Promise<void> => {
    await apiClient.post(
      `/orders/${orderId}/process-payment-shipment`,
      payAndShipmentRequest
    );
  },

  // 사용자 주문 내역 조회
  getUserOrders: async (): Promise<any[]> => {
    const response = await apiClient.get<any[]>("/orders/user");
    return response.data;
  },

  // 주문 상세 정보 조회
  getOrderDetail: async (orderId: number): Promise<any> => {
    const response = await apiClient.get<any>(`/orders/${orderId}`);
    return response.data;
  },
  getUserEmail: async (): Promise<string> => {
    try {
      const response = await apiClient.get<string>("/auth/email");
      return response.data;
    } catch (error) {
      console.error("사용자 이메일 가져오기 실패:", error);
      return "user@example.com"; // 실패 시 기본값 반환
    }
  },
};
