import apiClient from "src/global/services/ApiClient";
import {
  SaleBidRequestDto,
  InstantSaleRequestDto,
  SaleResponseDto,
  OrderBidDto,
} from "../types/sell";

export const sellService = {
  // 판매 입찰 생성하기
  createSaleBid: async (requestData: SaleBidRequestDto): Promise<number> => {
    const response = await apiClient.post<number>("/sale-bids", requestData);
    return response.data;
  },

  // 판매 입찰 삭제하기
  deleteSaleBid: async (saleBidId: number): Promise<void> => {
    await apiClient.delete(`/sale-bids/${saleBidId}`);
  },

  // 즉시 판매 생성하기
  createInstantSale: async (
    requestData: InstantSaleRequestDto
  ): Promise<number> => {
    const response = await apiClient.post<number>(
      "/sale-bids/instant",
      requestData
    );
    return response.data;
  },

  // 판매 가능한 구매 입찰 정보 가져오기 (실제 구현 시 필요한 경우)
  getAvailableOrderBids: async (
    productId: number,
    size: string
  ): Promise<OrderBidDto[]> => {
    // 백엔드 API 경로에 맞게 수정 필요
    const response = await apiClient.get<OrderBidDto[]>(
      `/order-bids/available?productId=${productId}&size=${size}`
    );
    return response.data;
  },
};
