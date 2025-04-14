import apiClient from "../../../global/services/ApiClient";
import {
  PointResponseDto,
  PointSummaryResponseDto,
  UsePointResponseDto,
  AdminPointRequestDto,
  PointStatisticsResponseDto,
} from "../types/pointManagementTypes";

export class PointManagementService {
  private static ADMIN_POINTS_URL = "/admin/users/points";

  /**
   * 특정 사용자의 모든 포인트 내역 조회
   */
  static async getUserPointHistory(
    userId: number
  ): Promise<PointResponseDto[]> {
    const response = await apiClient.get(
      `${this.ADMIN_POINTS_URL}/user/${userId}`
    );
    return response.data;
  }

  /**
   * 특정 사용자의 사용 가능한 포인트만 조회
   */
  static async getUserAvailablePoints(
    userId: number
  ): Promise<PointResponseDto[]> {
    const response = await apiClient.get(
      `${this.ADMIN_POINTS_URL}/user/${userId}/available`
    );
    return response.data;
  }

  /**
   * 특정 사용자의 포인트 종합 정보 조회
   */
  static async getUserPointSummary(
    userId: number
  ): Promise<PointSummaryResponseDto> {
    const response = await apiClient.get(
      `${this.ADMIN_POINTS_URL}/user/${userId}/summary`
    );
    return response.data;
  }

  /**
   * 특정 포인트 상세 조회
   */
  static async getPointDetail(pointId: number): Promise<PointResponseDto> {
    const response = await apiClient.get(`${this.ADMIN_POINTS_URL}/${pointId}`);
    return response.data;
  }

  /**
   * 포인트 지급 (어드민)
   */
  static async addPointByAdmin(
    userId: number,
    request: AdminPointRequestDto
  ): Promise<PointResponseDto> {
    const response = await apiClient.post(
      `${this.ADMIN_POINTS_URL}/user/${userId}/add`,
      request
    );
    return response.data;
  }

  /**
   * 포인트 차감 (어드민)
   */
  static async deductPointByAdmin(
    userId: number,
    request: AdminPointRequestDto
  ): Promise<UsePointResponseDto> {
    const response = await apiClient.post(
      `${this.ADMIN_POINTS_URL}/user/${userId}/deduct`,
      request
    );
    return response.data;
  }

  /**
   * 포인트 통계 조회
   */
  static async getPointStatistics(
    startDate?: string,
    endDate?: string
  ): Promise<PointStatisticsResponseDto> {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const response = await apiClient.get(
      `${this.ADMIN_POINTS_URL}/statistics?${params.toString()}`
    );
    return response.data;
  }
}
