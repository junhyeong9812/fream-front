import apiClient from "src/global/services/ApiClient";
import {
  categoryMapping,
  NoticeResponseDto,
  PageResponse,
} from "../types/supportTypes";
import { AxiosResponse } from "axios";

interface NoticeService {
  // 공지사항 목록 조회 (페이지네이션)
  getNotices: (
    page: number,
    size: number
  ) => Promise<AxiosResponse<PageResponse<NoticeResponseDto>>>;

  // 단일 공지사항 조회
  getNotice: (id: number) => Promise<AxiosResponse<NoticeResponseDto>>;

  // 공지사항 검색
  searchNotices: (
    keyword: string,
    page: number,
    size: number
  ) => Promise<AxiosResponse<PageResponse<NoticeResponseDto>>>;

  // 카테고리별 공지사항 조회
  getNoticesByCategory: (
    category: string,
    page: number,
    size: number
  ) => Promise<AxiosResponse<PageResponse<NoticeResponseDto>>>;

  // 카테고리와 키워드로 공지사항 검색 (새 메서드)
  searchNoticesByCategoryAndKeyword: (
    category: string,
    keyword: string,
    page: number,
    size: number
  ) => Promise<AxiosResponse<PageResponse<NoticeResponseDto>>>;
}

const noticeService: NoticeService = {
  // 공지사항 목록 조회
  getNotices: (page, size) =>
    apiClient.get<PageResponse<NoticeResponseDto>>(`/notices`, {
      params: { page, size },
    }),

  // 단일 공지사항 조회
  getNotice: (id) => apiClient.get<NoticeResponseDto>(`/notices/${id}`),

  // 공지사항 검색
  searchNotices: (keyword, page, size) =>
    apiClient.get<PageResponse<NoticeResponseDto>>(`/notices/search`, {
      params: { keyword, page, size },
    }),

  // 카테고리별 공지사항 조회
  getNoticesByCategory: (category, page, size) => {
    // 한글 카테고리를 Enum 값으로 변환
    const mappedCategory = categoryMapping[category] || "ALL";

    // ALL인 경우 카테고리 파라미터 제거
    const params =
      mappedCategory === "ALL"
        ? { page, size }
        : { category: mappedCategory, page, size };

    return apiClient.get<PageResponse<NoticeResponseDto>>(`/notices`, {
      params,
    });
  },

  // 카테고리와 키워드로 공지사항 검색
  searchNoticesByCategoryAndKeyword: (category, keyword, page, size) => {
    // 한글 카테고리를 Enum 값으로 변환
    const mappedCategory = categoryMapping[category] || "ALL";

    // ALL인 경우 카테고리 파라미터 제거
    const params =
      mappedCategory === "ALL"
        ? { keyword, page, size }
        : { category: mappedCategory, keyword, page, size };

    return apiClient.get<PageResponse<NoticeResponseDto>>(`/notices/search`, {
      params,
    });
  },
};

export default noticeService;
