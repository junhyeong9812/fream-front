import apiClient from "src/global/services/ApiClient";
import { AdminProfileInfo } from "../types/sidebarTypes";

/**
 * 관리자 프로필 정보 가져오기
 * @returns 관리자 프로필 정보
 */
export const fetchAdminProfileInfo = async (): Promise<AdminProfileInfo> => {
  try {
    const response = await apiClient.get<AdminProfileInfo>("/profiles");

    // 프로필 이미지 URL 처리 - getProfileImageUrl 함수 사용
    response.data.profileImage = getProfileImageUrl(response.data.profileId);

    return response.data;
  } catch (error) {
    console.error("관리자 프로필 정보 조회 중 오류:", error);

    // 오류 발생 시 기본 프로필 정보 반환
    return {
      profileId: 0,
      profileImage: null,
      profileName: "관리자",
      realName: "관리자",
      email: "admin@fream.co.kr",
      bio: "",
      isPublic: false,
    };
  }
};

/**
 * 프로필 이미지 URL 생성
 * @param profileId 프로필 ID
 * @returns 프로필 이미지 URL
 */
export const getProfileImageUrl = (profileId: number | null): string => {
  if (!profileId) {
    return "https://via.placeholder.com/150";
  }
  return `https://www.pinjun.xyz/api/profiles/${profileId}/image`;
};
