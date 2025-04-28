import apiClient from "src/global/services/ApiClient";
import {
  NoticeResponseDto,
  NoticeCreateRequestDto,
  NoticeUpdateRequestDto,
  NoticeCategory,
  PaginatedNoticeResponse,
} from "../types/noticeManagementTypes";

export class NoticeService {
  private static NOTICE_URL = "/notices";

  /**
   * 공지사항 목록 조회
   */
  static async getNotices(
    page: number = 0,
    size: number = 20
  ): Promise<PaginatedNoticeResponse> {
    const response = await apiClient.get(`${this.NOTICE_URL}`, {
      params: { page, size },
    });
    return response.data;
  }

  /**
   * 카테고리별 공지사항 조회
   */
  static async getNoticesByCategory(
    category: NoticeCategory,
    page: number = 0,
    size: number = 20
  ): Promise<PaginatedNoticeResponse> {
    const response = await apiClient.get(`${this.NOTICE_URL}`, {
      params: { category, page, size },
    });
    return response.data;
  }

  /**
   * 공지사항 검색
   */
  static async searchNotices(
    keyword: string,
    page: number = 0,
    size: number = 20
  ): Promise<PaginatedNoticeResponse> {
    const response = await apiClient.get(`${this.NOTICE_URL}/search`, {
      params: { keyword, page, size },
    });
    return response.data;
  }

  /**
   * 카테고리와 키워드로 공지사항 검색 (새로 추가)
   */
  static async searchNoticesByCategoryAndKeyword(
    category: NoticeCategory | null,
    keyword: string,
    page: number = 0,
    size: number = 20
  ): Promise<PaginatedNoticeResponse> {
    const params: any = { page, size };

    if (keyword) {
      params.keyword = keyword;
    }

    if (category) {
      params.category = category;
    }

    const response = await apiClient.get(`${this.NOTICE_URL}/search`, {
      params,
    });
    return response.data;
  }

  /**
   * 단일 공지사항 조회
   */
  static async getNotice(noticeId: number): Promise<NoticeResponseDto> {
    const response = await apiClient.get(`${this.NOTICE_URL}/${noticeId}`);
    return response.data;
  }

  /**
   * 공지사항 생성
   */
  static async createNotice(
    data: NoticeCreateRequestDto
  ): Promise<NoticeResponseDto> {
    // FormData 객체 생성
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("category", data.category);

    // 파일이 있는 경우 추가
    if (data.files && data.files.length > 0) {
      data.files.forEach((file) => {
        formData.append("files", file);
      });
    }

    const response = await apiClient.post(this.NOTICE_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  }

  /**
   * 공지사항 수정
   */
  static async updateNotice(
    noticeId: number,
    data: NoticeUpdateRequestDto
  ): Promise<NoticeResponseDto> {
    // FormData 객체 생성
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("category", data.category);

    // 기존 이미지 URL 추가
    if (data.existingImageUrls && data.existingImageUrls.length > 0) {
      data.existingImageUrls.forEach((url) => {
        formData.append("existingImageUrls", url);
      });
    }

    // 새 파일 추가
    if (data.newFiles && data.newFiles.length > 0) {
      data.newFiles.forEach((file) => {
        formData.append("newFiles", file);
      });
    }

    const response = await apiClient.put(
      `${this.NOTICE_URL}/${noticeId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  }

  /**
   * 공지사항 삭제
   */
  static async deleteNotice(noticeId: number): Promise<void> {
    await apiClient.delete(`${this.NOTICE_URL}/${noticeId}`);
  }
}
