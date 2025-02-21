import apiClient from "src/global/services/ApiClient";
import {
  StyleResponseDto,
  StyleDetailResponseDto,
  ProfileStyleResponseDto,
} from "../types/styleTypes";

export const styleService = {
  // 스타일 목록 조회
  async getStyles() {
    try {
      const response = await apiClient.get<StyleResponseDto[]>(
        "/styles/queries"
      );
      return response.data;
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
      return response.data;
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
      return response.data;
    } catch (error) {
      console.error("프로필 스타일 목록 조회 실패:", error);
      throw error;
    }
  },

  // 미디어 파일 URL 조회
  async getStyleMedia(styleId: number, fileName: string) {
    try {
      const response = await apiClient.get<Blob>(
        `/styles/queries/${styleId}/media`,
        {
          params: { fileName },
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
