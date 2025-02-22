import apiClient from "src/global/services/ApiClient";
import {
  StyleResponseDto,
  StyleDetailResponseDto,
  ProfileStyleResponseDto,
  PageResponse,
} from "../types/styleTypes";

const API_BASE_URL = "https://www.pinjun.xyz/api";

export const styleService = {
  // 스타일 목록 조회
  async getStyles() {
    try {
      const response = await apiClient.get<PageResponse<StyleResponseDto>>(
        "/styles/queries"
      );
      // content 배열만 반환
      return response.data.content.map((style) => ({
        ...style,
        mediaUrl: `${API_BASE_URL}${style.mediaUrl}`,
        profileImageUrl: style.profileImageUrl
          ? `${API_BASE_URL}/profiles/${style.profileId}/image`
          : style.profileImageUrl,
      }));
    } catch (error) {
      console.error("스타일 목록 조회 실패:", error);
      throw error;
    }
  },

  // 스타일 상세 조회
  async getStyleDetail(styleId: number) {
    try {
      const response = await apiClient.get<StyleDetailResponseDto>(
        `/styles/queries/${styleId}`
      );
      // return response.data;
      return {
        ...response.data,
        mediaUrls: response.data.mediaUrls.map(
          (url) => `${API_BASE_URL}${url}`
        ),
        profileImageUrl: response.data.profileImageUrl
          ? `${API_BASE_URL}/profiles/${response.data.profileId}/image`
          : response.data.profileImageUrl,
        productInfos: response.data.productInfos.map((product) => ({
          ...product,
          thumbnailImageUrl: `${API_BASE_URL}${product.thumbnailImageUrl}`,
        })),
      };
    } catch (error) {
      console.error("스타일 상세 조회 실패:", error);
      throw error;
    }
  },

  // 프로필별 스타일 목록 조회
  async getProfileStyles(profileId: number) {
    try {
      const response = await apiClient.get<ProfileStyleResponseDto[]>(
        `/styles/queries/profile/${profileId}`
      );
      // return response.data;
      return response.data.map((style) => ({
        ...style,
        mediaUrl: `${API_BASE_URL}${style.mediaUrl}`,
      }));
    } catch (error) {
      console.error("프로필 스타일 목록 조회 실패:", error);
      throw error;
    }
  },

  // 미디어 파일 URL 조회
  async getStyleMedia(styleId: number, fileName: string) {
    try {
      const response = await apiClient.get<Blob>(
        `/styles/queries/${styleId}/media/${fileName}`,
        {
          responseType: "blob",
        }
      );
      return URL.createObjectURL(response.data);
    } catch (error) {
      console.error("스타일 미디어 조회 실패:", error);
      throw error;
    }
  },
};

export default styleService;
