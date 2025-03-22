import apiClient from "src/global/services/ApiClient";
import { AxiosError, AxiosResponse } from "axios";
import { FAQPageResponse, FAQResponseDto } from "../types/supportTypes";
import { ApiError } from "src/global/types/errors";
import { ErrorHandler } from "src/global/services//errorHandler";
import { toast } from "react-toastify";

// FAQ 서비스 응답 타입
type FAQServiceResponse<T> = {
  data: T;
  success: boolean;
  error?: ApiError;
};

// FAQ 응답 데이터 추출 함수
const extractResponseData = <T>(response: AxiosResponse): T => {
  // API 응답 구조가 { data: { data: 실제데이터 } } 형태라면 그에 맞게 처리
  return response.data.data;
};

// 에러 처리 함수
const handleFAQError = (error: any, fallbackMessage: string): ApiError => {
  console.error("FAQ API 오류:", error);

  // ApiError로 변환
  if (error.response?.data) {
    const apiError = new ApiError({
      code: error.response.data.code || "FAQ_QUERY_ERROR",
      message: error.response.data.message || fallbackMessage,
      status: error.response.status || 500,
      timestamp: error.response.data.timestamp || new Date().toISOString(),
      path: error.response.data.path || error.config?.url || "",
    });

    // 글로벌 에러 핸들러에 전달
    ErrorHandler.handleError(apiError);
    return apiError;
  }

  // 네트워크 오류 등 기타 예외 처리
  toast.error(fallbackMessage);
  return new ApiError({
    code: "FAQ_QUERY_ERROR",
    message: fallbackMessage,
    status: 500,
    timestamp: new Date().toISOString(),
    path: "",
  });
};

// FAQService 인터페이스 정의
interface FAQService {
  // FAQ 목록 조회 (페이지네이션)
  getFAQs: (
    page: number,
    size: number
  ) => Promise<FAQServiceResponse<FAQPageResponse>>;

  // 단일 FAQ 조회
  getFAQ: (id: number) => Promise<FAQServiceResponse<FAQResponseDto>>;

  // FAQ 검색
  searchFAQs: (
    keyword: string,
    page: number,
    size: number
  ) => Promise<FAQServiceResponse<FAQPageResponse>>;

  // 카테고리별 FAQ 조회
  getFAQsByCategory: (
    category: string,
    page: number,
    size: number
  ) => Promise<FAQServiceResponse<FAQPageResponse>>;
}

// FAQService 구현
const faqService: FAQService = {
  // FAQ 목록 조회
  getFAQs: async (page, size) => {
    try {
      const response = await apiClient.get<FAQPageResponse>("/faq", {
        params: { page, size },
      });
      return {
        data: extractResponseData<FAQPageResponse>(response),
        success: true,
      };
    } catch (error) {
      const apiError = handleFAQError(
        error,
        "FAQ 목록을 불러오는 중 오류가 발생했습니다."
      );
      return {
        data: {} as FAQPageResponse,
        success: false,
        error: apiError,
      };
    }
  },

  // 단일 FAQ 조회
  getFAQ: async (id) => {
    try {
      const response = await apiClient.get<FAQResponseDto>(`/faq/${id}`);
      return {
        data: extractResponseData<FAQResponseDto>(response),
        success: true,
      };
    } catch (error) {
      const apiError = handleFAQError(
        error,
        `FAQ 정보를 불러오는 중 오류가 발생했습니다. (ID: ${id})`
      );
      return {
        data: {} as FAQResponseDto,
        success: false,
        error: apiError,
      };
    }
  },

  // FAQ 검색
  searchFAQs: async (keyword, page, size) => {
    try {
      const response = await apiClient.get<FAQPageResponse>("/faq/search", {
        params: { keyword, page, size },
      });
      return {
        data: extractResponseData<FAQPageResponse>(response),
        success: true,
      };
    } catch (error) {
      const apiError = handleFAQError(
        error,
        `FAQ 검색 중 오류가 발생했습니다. (키워드: ${keyword || "전체"})`
      );
      return {
        data: {} as FAQPageResponse,
        success: false,
        error: apiError,
      };
    }
  },

  // 카테고리별 FAQ 조회
  getFAQsByCategory: async (category, page, size) => {
    try {
      const response = await apiClient.get<FAQPageResponse>("/faq", {
        params: { category, page, size },
      });
      return {
        data: extractResponseData<FAQPageResponse>(response),
        success: true,
      };
    } catch (error) {
      const apiError = handleFAQError(
        error,
        `카테고리별 FAQ 조회 중 오류가 발생했습니다. (카테고리: ${category})`
      );
      return {
        data: {} as FAQPageResponse,
        success: false,
        error: apiError,
      };
    }
  },
};

export default faqService;
