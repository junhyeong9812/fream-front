import apiClient from "src/global/services/ApiClient";
import {
  OrderBidResponseDto,
  OrderBidStatusCountDto,
  PageResponse,
  BidStatus,
  OrderStatus,
} from "../types/order";

/**
 * 주문 입찰 관련 API 서비스
 */
export const orderBidService = {
  /**
   * 주문 입찰 목록 조회
   * @param bidStatus 입찰 상태 필터
   * @param orderStatus 주문 상태 필터
   * @param page 페이지 번호 (0부터 시작)
   * @param size 페이지 크기
   */
  getOrderBids: async (
    bidStatus?: BidStatus,
    orderStatus?: OrderStatus,
    page = 0,
    size = 10
  ): Promise<PageResponse<OrderBidResponseDto>> => {
    const params: Record<string, any> = { page, size };

    if (bidStatus) params.bidStatus = bidStatus;
    if (orderStatus) params.orderStatus = orderStatus;

    const response = await apiClient.get<PageResponse<OrderBidResponseDto>>(
      "/order-bids",
      { params }
    );
    return response.data;
  },

  /**
   * 주문 입찰 상태별 개수 조회
   */
  getOrderBidStatusCounts: async (): Promise<OrderBidStatusCountDto> => {
    const response = await apiClient.get<OrderBidStatusCountDto>(
      "/order-bids/count"
    );
    return response.data;
  },

  /**
   * 주문 입찰 상세 정보 조회
   * @param orderBidId 주문 입찰 ID
   */
  getOrderBidDetail: async (
    orderBidId: number
  ): Promise<OrderBidResponseDto> => {
    const response = await apiClient.get<OrderBidResponseDto>(
      `/order-bids/${orderBidId}`
    );
    return response.data;
  },
};
