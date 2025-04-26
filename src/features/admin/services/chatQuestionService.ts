import apiClient from "src/global/services/ApiClient";
import {
  PaginatedChatHistoryResponse,
  ChatHistoryDto,
  GPTUsageStatsDto,
  PaginatedGPTUsageLogResponse,
  GPTSearchParams,
} from "../types/chatQuestionTypes";

/**
 * 채팅 질문 관리 API 서비스
 */
export class ChatQuestionService {
  private static CHAT_URL = "/chat";
  private static ADMIN_GPT_URL = "/admin/gpt";

  /**
   * 채팅 기록 조회 (페이징)
   *
   * @param page 페이지 번호 (0부터 시작)
   * @param size 페이지 크기
   * @returns 페이지네이션된 채팅 기록
   */
  static async getChatHistoryPaging(
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedChatHistoryResponse> {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("size", size.toString());

    const response = await apiClient.get(
      `${this.CHAT_URL}/history?${params.toString()}`
    );
    return response.data;
  }

  /**
   * 채팅 기록 총 페이지 수 조회
   *
   * @param size 페이지 크기
   * @returns 총 페이지 수
   */
  static async getChatHistoryPageCount(size: number = 10): Promise<number> {
    const params = new URLSearchParams();
    params.append("size", size.toString());

    const response = await apiClient.get(
      `${this.CHAT_URL}/history/count?${params.toString()}`
    );
    return response.data;
  }

  /**
   * 최근 질문 목록 조회
   *
   * @param limit 최대 항목 수
   * @returns 최근 질문 목록
   */
  static async getRecentQuestions(
    limit: number = 5
  ): Promise<ChatHistoryDto[]> {
    const params = new URLSearchParams();
    params.append("limit", limit.toString());

    const response = await apiClient.get(
      `${this.CHAT_URL}/recent?${params.toString()}`
    );
    return response.data;
  }

  /**
   * GPT 사용량 통계 조회 (관리자용)
   *
   * @param startDate 시작 날짜 (ISO 형식: yyyy-MM-dd)
   * @param endDate 종료 날짜 (ISO 형식: yyyy-MM-dd)
   * @returns GPT 사용량 통계
   */
  static async getGPTUsageStats(
    startDate: string,
    endDate: string
  ): Promise<GPTUsageStatsDto> {
    const params = new URLSearchParams();
    params.append("startDate", startDate);
    params.append("endDate", endDate);

    const response = await apiClient.get(
      `${this.ADMIN_GPT_URL}/stats?${params.toString()}`
    );
    return response.data.data;
  }

  /**
   * GPT 사용량 로그 조회 (관리자용, 페이징)
   *
   * @param page 페이지 번호 (0부터 시작)
   * @param size 페이지 크기
   * @returns 페이지네이션된 GPT 사용량 로그
   */
  static async getGPTUsageLogs(
    page: number = 0,
    size: number = 20
  ): Promise<PaginatedGPTUsageLogResponse> {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("size", size.toString());

    const response = await apiClient.get(
      `${this.ADMIN_GPT_URL}/logs?${params.toString()}`
    );
    return response.data.data;
  }

  /**
   * 총 누적 토큰 사용량 조회 (관리자용)
   *
   * @returns 총 토큰 사용량
   */
  static async getTotalTokensUsed(): Promise<number> {
    const response = await apiClient.get(`${this.ADMIN_GPT_URL}/total-tokens`);
    return response.data.data;
  }

  /**
   * GPT 사용량 로그 검색 (관리자용, 페이징)
   *
   * @param searchParams 검색 파라미터
   * @returns 페이지네이션된 GPT 사용량 로그
   */
  static async searchGPTUsageLogs(
    searchParams: GPTSearchParams
  ): Promise<PaginatedGPTUsageLogResponse> {
    const params = new URLSearchParams();

    if (searchParams.startDate) {
      params.append("startDate", searchParams.startDate);
    }

    if (searchParams.endDate) {
      params.append("endDate", searchParams.endDate);
    }

    if (searchParams.modelName) {
      params.append("modelName", searchParams.modelName);
    }

    if (searchParams.requestType) {
      params.append("requestType", searchParams.requestType);
    }

    if (searchParams.userName) {
      params.append("userName", searchParams.userName);
    }

    params.append("page", (searchParams.page || 0).toString());
    params.append("size", (searchParams.size || 20).toString());

    const response = await apiClient.get(
      `${this.ADMIN_GPT_URL}/logs/search?${params.toString()}`
    );
    return response.data.data;
  }
}
