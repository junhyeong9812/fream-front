import apiClient from "../../../global/services/ApiClient";
import {
  SanctionSearchDto,
  UserSanction,
  SanctionCreateDto,
  SanctionUpdateDto,
  SanctionReviewDto,
  SanctionStatistics,
  PageResponse,
} from "../types/sanctionTypes";

export class SanctionService {
  private static ADMIN_SANCTIONS_URL = "/admin/users/sanctions";

  /**
   * 제재 검색 (페이징)
   */
  static async searchSanctions(
    searchDto: SanctionSearchDto,
    page: number = 0,
    size: number = 20
  ): Promise<PageResponse<UserSanction>> {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("size", size.toString());

    // Add search parameters if provided
    if (searchDto.userId) {
      params.append("userId", searchDto.userId.toString());
    }
    if (searchDto.email) {
      params.append("email", searchDto.email);
    }
    if (searchDto.status) {
      params.append("status", searchDto.status);
    }
    if (searchDto.type) {
      params.append("type", searchDto.type);
    }
    if (searchDto.startDateStart) {
      params.append("startDateStart", searchDto.startDateStart);
    }
    if (searchDto.startDateEnd) {
      params.append("startDateEnd", searchDto.startDateEnd);
    }
    if (searchDto.endDateStart) {
      params.append("endDateStart", searchDto.endDateStart);
    }
    if (searchDto.endDateEnd) {
      params.append("endDateEnd", searchDto.endDateEnd);
    }
    if (searchDto.createdDateStart) {
      params.append("createdDateStart", searchDto.createdDateStart);
    }
    if (searchDto.createdDateEnd) {
      params.append("createdDateEnd", searchDto.createdDateEnd);
    }

    // Add sort option if provided
    if (searchDto.sortOption) {
      params.append("sort", searchDto.sortOption.field);
      params.append("direction", searchDto.sortOption.order);
    }

    const response = await apiClient.get(
      `${this.ADMIN_SANCTIONS_URL}/search?${params.toString()}`
    );
    return response.data.data;
  }

  /**
   * 제재 상세 조회
   */
  static async getSanctionById(sanctionId: number): Promise<UserSanction> {
    const response = await apiClient.get(
      `${this.ADMIN_SANCTIONS_URL}/${sanctionId}`
    );
    return response.data.data;
  }

  /**
   * 제재 생성
   */
  static async createSanction(
    sanctionDto: SanctionCreateDto
  ): Promise<UserSanction> {
    const response = await apiClient.post(
      this.ADMIN_SANCTIONS_URL,
      sanctionDto
    );
    return response.data.data;
  }

  /**
   * 제재 수정
   */
  static async updateSanction(
    sanctionDto: SanctionUpdateDto
  ): Promise<UserSanction> {
    const response = await apiClient.put(
      `${this.ADMIN_SANCTIONS_URL}/${sanctionDto.id}`,
      sanctionDto
    );
    return response.data.data;
  }

  /**
   * 제재 승인
   */
  static async approveSanction(sanctionId: number): Promise<UserSanction> {
    const reviewDto: SanctionReviewDto = {
      id: sanctionId,
      approved: true,
    };
    const response = await apiClient.patch(
      `${this.ADMIN_SANCTIONS_URL}/${sanctionId}/review`,
      reviewDto
    );
    return response.data.data;
  }

  /**
   * 제재 거부
   */
  static async rejectSanction(
    sanctionId: number,
    rejectionReason: string
  ): Promise<UserSanction> {
    const reviewDto: SanctionReviewDto = {
      id: sanctionId,
      approved: false,
      rejectionReason,
    };
    const response = await apiClient.patch(
      `${this.ADMIN_SANCTIONS_URL}/${sanctionId}/review`,
      reviewDto
    );
    return response.data.data;
  }

  /**
   * 제재 취소
   */
  static async cancelSanction(sanctionId: number): Promise<UserSanction> {
    const response = await apiClient.patch(
      `${this.ADMIN_SANCTIONS_URL}/${sanctionId}/cancel`,
      {}
    );
    return response.data.data;
  }

  /**
   * 제재 통계 조회
   */
  static async getSanctionStatistics(): Promise<SanctionStatistics> {
    const response = await apiClient.get(
      `${this.ADMIN_SANCTIONS_URL}/statistics`
    );
    return response.data.data;
  }

  /**
   * 특정 사용자의 제재 내역 조회
   */
  static async getUserSanctions(userId: number): Promise<UserSanction[]> {
    const response = await apiClient.get(
      `${this.ADMIN_SANCTIONS_URL}/user/${userId}`
    );
    return response.data.data;
  }
}
