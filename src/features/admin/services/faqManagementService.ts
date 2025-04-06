import apiClient from "src/global/services/ApiClient";
import {
  FAQResponseDto,
  FAQCreateRequestDto,
  FAQUpdateRequestDto,
  FAQCategory,
  PaginatedFAQResponse,
} from "../types/faqManagementTypes";

export class FAQService {
  private static FAQ_URL = "/faq";

  /**
   * FAQ 목록 조회
   */
  static async getFAQs(
    page: number = 0,
    size: number = 20
  ): Promise<PaginatedFAQResponse> {
    const response = await apiClient.get(this.FAQ_URL, {
      params: { page, size },
    });
    return response.data.data;
  }

  /**
   * 카테고리별 FAQ 조회
   */
  static async getFAQsByCategory(
    category: FAQCategory,
    page: number = 0,
    size: number = 20
  ): Promise<PaginatedFAQResponse> {
    const response = await apiClient.get(this.FAQ_URL, {
      params: { category, page, size },
    });
    return response.data.data;
  }

  /**
   * FAQ 검색
   */
  static async searchFAQs(
    keyword: string,
    page: number = 0,
    size: number = 20
  ): Promise<PaginatedFAQResponse> {
    const response = await apiClient.get(`${this.FAQ_URL}/search`, {
      params: { keyword, page, size },
    });
    return response.data.data;
  }

  /**
   * 단일 FAQ 조회
   */
  static async getFAQ(faqId: number): Promise<FAQResponseDto> {
    const response = await apiClient.get(`${this.FAQ_URL}/${faqId}`);
    return response.data.data;
  }

  /**
   * FAQ 생성
   */
  static async createFAQ(data: FAQCreateRequestDto): Promise<FAQResponseDto> {
    // FormData 객체 생성
    const formData = new FormData();
    formData.append("category", data.category);
    formData.append("question", data.question);
    formData.append("answer", data.answer);

    // 파일이 있는 경우 추가
    if (data.files && data.files.length > 0) {
      data.files.forEach((file) => {
        formData.append("files", file);
      });
    }

    const response = await apiClient.post(this.FAQ_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.data;
  }

  /**
   * FAQ 수정
   */
  static async updateFAQ(
    faqId: number,
    data: FAQUpdateRequestDto
  ): Promise<FAQResponseDto> {
    // FormData 객체 생성
    const formData = new FormData();
    formData.append("category", data.category);
    formData.append("question", data.question);
    formData.append("answer", data.answer);

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

    const response = await apiClient.put(`${this.FAQ_URL}/${faqId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.data;
  }

  /**
   * FAQ 삭제
   */
  static async deleteFAQ(faqId: number): Promise<void> {
    await apiClient.delete(`${this.FAQ_URL}/${faqId}`);
  }
}
