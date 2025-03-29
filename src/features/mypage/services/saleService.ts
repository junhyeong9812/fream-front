import apiClient from "src/global/services/ApiClient";
import {
  SaleBidResponseDto,
  SaleBidStatusCountDto,
  PageResponse,
  BidStatus,
  SaleStatus,
} from "../types/sale";

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

    const response = await apiClient.get<PageResponse<SaleBidResponseDto>>(
      "/sale-bids",
      { params }
    );
    return response.data;
  },

  /**
   * 판매 입찰 상태별 개수 조회
   */
  getSaleBidStatusCounts: async (): Promise<SaleBidStatusCountDto> => {
    const response = await apiClient.get<SaleBidStatusCountDto>(
      "/sale-bids/count"
    );
    return response.data;
  },

  /**
   * 판매 입찰 상세 정보 조회
   * @param saleBidId 판매 입찰 ID
   */
  getSaleBidDetail: async (saleBidId: number): Promise<SaleBidResponseDto> => {
    const response = await apiClient.get<SaleBidResponseDto>(
      `/sale-bids/${saleBidId}`
    );
    return response.data;
  },
};
