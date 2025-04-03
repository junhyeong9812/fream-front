import apiClient from "src/global/services/ApiClient";
import {
  InspectionCategory,
  InspectionStandardResponseDto,
  InspectionStandardCreateRequestDto,
  InspectionStandardUpdateRequestDto,
  ResponseDto,
  PageResponseDto,
} from "../types/inspectionStandardsTypes";

const API_URL = "/inspections";

export const InspectionStandardService = {
  /**
   * 모든 검수 기준 목록 조회
   */
  async getAll(
    page: number = 0,
    size: number = 10
  ): Promise<PageResponseDto<InspectionStandardResponseDto>> {
    const response = await apiClient.get<
      ResponseDto<PageResponseDto<InspectionStandardResponseDto>>
    >(`${API_URL}?page=${page}&size=${size}`);
    return response.data.data;
  },

  /**
   * 카테고리별 검수 기준 목록 조회
   */
  async getByCategory(
    category: InspectionCategory,
    page: number = 0,
    size: number = 10
  ): Promise<PageResponseDto<InspectionStandardResponseDto>> {
    const response = await apiClient.get<
      ResponseDto<PageResponseDto<InspectionStandardResponseDto>>
    >(`${API_URL}?category=${category}&page=${page}&size=${size}`);
    return response.data.data;
  },

  /**
   * 검수 기준 단일 조회
   */
  async getById(id: number): Promise<InspectionStandardResponseDto> {
    const response = await apiClient.get<
      ResponseDto<InspectionStandardResponseDto>
    >(`${API_URL}/${id}`);
    return response.data.data;
  },

  /**
   * 검수 기준 생성
   */
  async create(
    data: InspectionStandardCreateRequestDto
  ): Promise<InspectionStandardResponseDto> {
    // FormData로 변환하여 전송
    const formData = new FormData();
    formData.append("category", data.category);
    formData.append("content", data.content);

    if (data.files && data.files.length > 0) {
      data.files.forEach((file) => {
        formData.append("files", file);
      });
    }

    const response = await apiClient.post<
      ResponseDto<InspectionStandardResponseDto>
    >(API_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  },

  /**
   * 검수 기준 수정
   */
  async update(
    id: number,
    data: InspectionStandardUpdateRequestDto
  ): Promise<InspectionStandardResponseDto> {
    // FormData로 변환하여 전송
    const formData = new FormData();
    formData.append("category", data.category);
    formData.append("content", data.content);

    if (data.existingImageUrls && data.existingImageUrls.length > 0) {
      data.existingImageUrls.forEach((url) => {
        formData.append("existingImageUrls", url);
      });
    }

    if (data.newFiles && data.newFiles.length > 0) {
      data.newFiles.forEach((file) => {
        formData.append("newFiles", file);
      });
    }

    const response = await apiClient.put<
      ResponseDto<InspectionStandardResponseDto>
    >(`${API_URL}/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  },

  /**
   * 검수 기준 삭제
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete<ResponseDto<void>>(`${API_URL}/${id}`);
  },

  /**
   * 이미지 URL을 실제 다운로드 URL로 변환
   */
  getImageDownloadUrl(inspectionId: number, fileName: string): string {
    // baseURL이 apiClient에 이미 설정되어 있으므로 상대 경로만 반환
    return `${API_URL}/files/${inspectionId}/${fileName}`;
  },
};
