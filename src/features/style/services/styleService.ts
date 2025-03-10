import apiClient from "src/global/services/ApiClient";
import {
  StyleResponseDto,
  StyleDetailResponseDto,
  ProfileStyleResponseDto,
  PageResponse,
} from "../types/styleTypes";

const API_BASE_URL = "https://www.pinjun.xyz/api";

// 스타일 필터링 파라미터 인터페이스
interface StyleFilterParams {
  page?: number;
  size?: number;
  sortBy?: string;
  brandName?: string;
  collectionName?: string;
  categoryId?: number;
  isMainCategory?: boolean;
  profileName?: string;
}

export const styleService = {
  async getStyles(
    page = 0,
    size = 10,
    filterParams: Partial<StyleFilterParams> = {}
  ) {
    try {
      // 모든 필터 파라미터를 포함
      const params: StyleFilterParams = {
        page,
        size,
        ...filterParams,
      };

      const response = await apiClient.get<PageResponse<StyleResponseDto>>(
        "/styles/queries",
        { params }
      );

      return {
        content: response.data.content.map((style) => ({
          ...style,
          mediaUrl: `${API_BASE_URL}${style.mediaUrl}`,
          profileImageUrl: style.profileImageUrl
            ? `${API_BASE_URL}/profiles/${style.profileId}/image`
            : style.profileImageUrl,
        })),
        last: response.data.last, // 마지막 페이지 여부
        totalPages: response.data.totalPages,
        totalElements: response.data.totalElements,
      };
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
          thumbnailImageUrl: `${product.thumbnailImageUrl}`,
          // ${API_BASE_URL}
        })),
      };
    } catch (error) {
      console.error("스타일 상세 조회 실패:", error);
      throw error;
    }
  },

  // 뷰 카운트 증가
  async incrementViewCount(styleId: number) {
    try {
      await apiClient.post(`/styles/commands/${styleId}/view`);
    } catch (error) {
      console.error("뷰 카운트 증가 실패:", error);
      // 에러가 발생해도 상세 조회는 계속 진행하기 위해 throw하지 않음
    }
  },

  // 프로필별 스타일 목록 조회
  async getProfileStyles(profileId: number) {
    try {
      const response = await apiClient.get<
        PageResponse<ProfileStyleResponseDto>
      >(`/styles/queries/profile/${profileId}`);

      // content 배열에 접근하고 각 아이템의 mediaUrl을 변환
      return response.data.content.map((style) => ({
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
