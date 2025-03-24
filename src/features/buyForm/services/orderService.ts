import apiClient from "src/global/services/ApiClient";
import {
  OrderBidRequestDto,
  InstantOrderRequestDto,
  PayAndShipmentRequestDto,
} from "../types/order";

export const orderService = {
  // 주문 입찰 생성
  createOrderBid: async (requestData: OrderBidRequestDto): Promise<number> => {
    const response = await apiClient.post<number>("/order-bids", requestData);
    return response.data;
  },

  // 주문 입찰 삭제
  deleteOrderBid: async (orderBidId: number): Promise<void> => {
    await apiClient.delete(`/order-bids/${orderBidId}`);
  },

  // 즉시 구매 생성
  createInstantOrder: async (
    requestData: InstantOrderRequestDto
  ): Promise<number> => {
    const response = await apiClient.post<number>(
      "/order-bids/instant",
      requestData
    );
    return response.data;
  },

  // 결제 및 배송 정보 처리
  processPaymentAndShipment: async (
    orderId: number,
    requestData: PayAndShipmentRequestDto
  ): Promise<void> => {
    await apiClient.post(
      `/orders/${orderId}/process-payment-shipment`,
      requestData
    );
  },
};
