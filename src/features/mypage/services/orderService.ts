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

    // ResponseDto 구조를 처리하기 위해 응답 타입을 변경
    const response = await apiClient.get<{ data: PageResponse<OrderBidResponseDto>, success: boolean, message: string }>(
      "/order-bids",
      { params }
    );
    
    // data 필드에서 실제 페이징 데이터를 추출
    if (response.data && response.data.data) {
      return response.data.data;
    }
    
    // 응답 구조가 예상과 다른 경우 기본값 반환
    return {
      content: [],
      pageable: {
        pageNumber: 0,
        pageSize: 0,
        sort: {
          empty: true,
          sorted: false,
          unsorted: true,
        },
        offset: 0,
        unpaged: false,
        paged: true,
      },
      last: true,
      totalElements: 0,
      totalPages: 0,
      size: 0,
      number: 0,
      sort: {
        empty: true,
        sorted: false,
        unsorted: true,
      },
      first: true,
      numberOfElements: 0,
      empty: true,
    };
  },

  /**
   * 주문 입찰 상태별 개수 조회
   */
  getOrderBidStatusCounts: async (): Promise<OrderBidStatusCountDto> => {
    // ResponseDto 구조를 처리하기 위해 응답 타입을 변경
    const response = await apiClient.get<{ data: OrderBidStatusCountDto, success: boolean, message: string }>(
      "/order-bids/count"
    );
    
    // data 필드에서 실제 카운트 데이터를 추출
    if (response.data && response.data.data) {
      return response.data.data;
    }
    
    // 응답 구조가 예상과 다른 경우 기본값 반환
    return {
      pendingCount: 0,
      matchedCount: 0,
      cancelledOrCompletedCount: 0,
    };
  },

  /**
   * 주문 입찰 상세 정보 조회
   * @param orderBidId 주문 입찰 ID
   */
  getOrderBidDetail: async (
    orderBidId: number
  ): Promise<OrderBidResponseDto | null> => {
    try {
      // ResponseDto 구조를 처리하기 위해 응답 타입을 변경
      const response = await apiClient.get<{ data: OrderBidResponseDto, success: boolean, message: string }>(
        `/order-bids/${orderBidId}`
      );
      
      // data 필드에서 실제 상세 데이터를 추출
      if (response.data && response.data.data) {
        return response.data.data;
      }
      
      return null;
    } catch (error) {
      console.error(`Failed to get order bid detail for ID ${orderBidId}:`, error);
      return null;
    }
  },
};