// src/services/saleService.ts
import apiClient from "src/global/services/ApiClient";
import {
  SaleBidResponseDto,
  SaleBidStatusCountDto,
  PageResponse,
  BidStatus,
  SaleStatus,
} from "../types/sale";

// ResponseDto 타입 정의
interface ResponseDto<T> {
  data: T;
  success: boolean;
  message: string;
}

/**
 * 판매 입찰 관련 API 서비스
 */
export const saleBidService = {
  /**
   * 판매 입찰 목록 조회
   * @param saleBidStatus 입찰 상태 필터
   * @param saleStatus 판매 상태 필터
   * @param page 페이지 번호 (0부터 시작)
   * @param size 페이지 크기
   */
  getSaleBids: async (
    saleBidStatus?: BidStatus,
    saleStatus?: SaleStatus,
    page = 0,
    size = 10
  ): Promise<PageResponse<SaleBidResponseDto>> => {
    const params: Record<string, any> = { page, size };

    if (saleBidStatus) params.saleBidStatus = saleBidStatus;
    if (saleStatus) params.saleStatus = saleStatus;

    // ResponseDto로 래핑된 응답 처리
    const response = await apiClient.get<
      ResponseDto<PageResponse<SaleBidResponseDto>>
    >("/sale-bids", { params });

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
   * 판매 입찰 상태별 개수 조회
   */
  getSaleBidStatusCounts: async (): Promise<SaleBidStatusCountDto> => {
    // ResponseDto로 래핑된 응답 처리
    const response = await apiClient.get<ResponseDto<SaleBidStatusCountDto>>(
      "/sale-bids/count"
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
   * 판매 입찰 상세 정보 조회
   * @param saleBidId 판매 입찰 ID
   */
  getSaleBidDetail: async (
    saleBidId: number
  ): Promise<SaleBidResponseDto | null> => {
    try {
      // ResponseDto로 래핑된 응답 처리
      const response = await apiClient.get<ResponseDto<SaleBidResponseDto>>(
        `/sale-bids/${saleBidId}`
      );

      // data 필드에서 실제 상세 데이터를 추출
      if (response.data && response.data.data) {
        return response.data.data;
      }

      return null;
    } catch (error) {
      console.error(
        `Failed to get sale bid detail for ID ${saleBidId}:`,
        error
      );
      return null;
    }
  },
};
