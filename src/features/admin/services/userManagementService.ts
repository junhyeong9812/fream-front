import apiClient from "../../../global/services/ApiClient";
import {
  UserSearchDto,
  UserSearchResponseDto,
  UserDetailDto,
  PageResponse,
  UserStatusUpdateDto,
  UserGradeUpdateDto,
  UserRoleUpdateDto,
  UserPointDto,
} from "../types/userManagementTypes";

export class UserService {
  private static ADMIN_USERS_URL = "/admin/users";

  /**
   * 사용자 검색 (페이징)
   */
  static async searchUsers(
    searchDto: UserSearchDto,
    page: number = 0,
    size: number = 20
  ): Promise<PageResponse<UserSearchResponseDto>> {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("size", size.toString());

    // Add search parameters if provided
    if (searchDto.keyword) {
      params.append("keyword", searchDto.keyword);
    }
    if (searchDto.email) {
      params.append("email", searchDto.email);
    }
    if (searchDto.phoneNumber) {
      params.append("phoneNumber", searchDto.phoneNumber);
    }
    if (searchDto.ageStart) {
      params.append("ageStart", searchDto.ageStart.toString());
    }
    if (searchDto.ageEnd) {
      params.append("ageEnd", searchDto.ageEnd.toString());
    }
    if (searchDto.gender) {
      params.append("gender", searchDto.gender);
    }
    if (searchDto.registrationDateStart) {
      params.append("registrationDateStart", searchDto.registrationDateStart);
    }
    if (searchDto.registrationDateEnd) {
      params.append("registrationDateEnd", searchDto.registrationDateEnd);
    }
    if (searchDto.isVerified !== undefined) {
      params.append("isVerified", searchDto.isVerified.toString());
    }
    if (searchDto.sellerGrade) {
      params.append("sellerGrade", searchDto.sellerGrade.toString());
    }
    if (searchDto.shoeSize) {
      params.append("shoeSize", searchDto.shoeSize);
    }
    if (searchDto.role) {
      params.append("role", searchDto.role);
    }

    // Add sort option if provided
    if (searchDto.sortOption) {
      params.append("sort", searchDto.sortOption.field);
      params.append("direction", searchDto.sortOption.order);
    }

    const response = await apiClient.get(
      `${this.ADMIN_USERS_URL}/search?${params.toString()}`
    );
    return response.data;
  }

  /**
   * 사용자 상세 정보 조회
   */
  static async getUserById(userId: number): Promise<UserDetailDto> {
    const response = await apiClient.get(`${this.ADMIN_USERS_URL}/${userId}`);
    return response.data;
  }

  /**
   * 사용자 상태 업데이트 (활성/비활성)
   */
  static async updateUserStatus(
    request: UserStatusUpdateDto
  ): Promise<UserDetailDto> {
    const response = await apiClient.patch(
      `${this.ADMIN_USERS_URL}/${request.userId}/status`,
      request
    );
    return response.data;
  }

  /**
   * 사용자 등급 업데이트
   */
  static async updateUserGrade(
    request: UserGradeUpdateDto
  ): Promise<UserDetailDto> {
    const response = await apiClient.patch(
      `${this.ADMIN_USERS_URL}/${request.userId}/grade`,
      request
    );
    return response.data;
  }

  /**
   * 사용자 역할 업데이트
   */
  static async updateUserRole(
    request: UserRoleUpdateDto
  ): Promise<UserDetailDto> {
    const response = await apiClient.patch(
      `${this.ADMIN_USERS_URL}/${request.userId}/role`,
      request
    );
    return response.data;
  }

  /**
   * 사용자 포인트 지급/차감
   */
  static async manageUserPoints(request: UserPointDto): Promise<void> {
    await apiClient.post(
      `${this.ADMIN_USERS_URL}/${request.userId}/points`,
      request
    );
  }

  /**
   * 사용자 데이터 CSV 내보내기
   */
  static async exportUsers(searchDto?: UserSearchDto): Promise<string> {
    const params = new URLSearchParams();

    // Add search parameters if provided
    if (searchDto?.keyword) {
      params.append("keyword", searchDto.keyword);
    }
    if (searchDto?.email) {
      params.append("email", searchDto.email);
    }
    if (searchDto?.phoneNumber) {
      params.append("phoneNumber", searchDto.phoneNumber);
    }
    // Add other search parameters as needed...

    const response = await apiClient.get(
      `${this.ADMIN_USERS_URL}/export?${params.toString()}`,
      {
        responseType: "blob",
      }
    );

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(response.data);
    });
  }
}
