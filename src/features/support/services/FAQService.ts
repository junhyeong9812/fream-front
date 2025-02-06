import apiClient from "src/services/ApiClient";
import { AxiosResponse } from "axios";
import {
  FAQPageResponse,
  FAQResponseDto,
  faqCategoryMapping,
} from "../types/supportTypes";

// FAQService 인터페이스 정의
interface FAQService {
  // FAQ 목록 조회 (페이지네이션)
  getFAQs: (
    page: number,
    size: number
  ) => Promise<AxiosResponse<FAQPageResponse>>;

  // 단일 FAQ 조회
  getFAQ: (id: number) => Promise<AxiosResponse<FAQResponseDto>>;

  // FAQ 검색
  searchFAQs: (
    keyword: string,
    page: number,
    size: number
  ) => Promise<AxiosResponse<FAQPageResponse>>;

  // 카테고리별 FAQ 조회
  getFAQsByCategory: (
    category: string,
    page: number,
    size: number
  ) => Promise<AxiosResponse<FAQPageResponse>>;
}

// FAQService 구현
const faqService: FAQService = {
  // FAQ 목록 조회
  getFAQs: (page, size) =>
    apiClient.get<FAQPageResponse>("/faq", {
      params: { page, size },
    }),

  // 단일 FAQ 조회
  getFAQ: (id) => apiClient.get<FAQResponseDto>(`/faq/${id}`),

  // FAQ 검색
  searchFAQs: (keyword, page, size) =>
    apiClient.get<FAQPageResponse>("/faq/search", {
      params: { keyword, page, size },
    }),

  // 카테고리별 FAQ 조회
  getFAQsByCategory: (category, page, size) => {
    return apiClient.get<FAQPageResponse>("/faq", {
      params: { category: category, page, size },
    });
  },
};

export default faqService;
