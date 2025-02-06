import apiClient from "src/services/ApiClient";
import { AxiosResponse } from "axios";
import {
  InspectionPageResponse,
  InspectionResponseDto,
  PageResponse,
  inspectionCategoryMapping,
} from "../types/supportTypes";

// InspectionService 인터페이스 정의 및 구현
const inspectionService = {
  // 검수 기준 목록 조회
  getInspections: (
    page: number,
    size: number
  ): Promise<AxiosResponse<InspectionPageResponse>> => {
    return apiClient.get<InspectionPageResponse>("/inspections", {
      params: { page, size },
    });
  },

  // 단일 검수 기준 조회
  getInspection: (
    id: number
  ): Promise<AxiosResponse<InspectionResponseDto>> => {
    return apiClient.get<InspectionResponseDto>(`/inspections/${id}`);
  },

  // 카테고리별 검수 기준 조회
  getInspectionsByCategory: (
    category: string,
    page: number,
    size: number
  ): Promise<AxiosResponse<InspectionPageResponse>> => {
    // 한글 카테고리를 백엔드 Enum 값으로 변환

    return apiClient.get<InspectionPageResponse>("/inspections", {
      params: { category: category, page, size },
    });
  },
};

// `inspectionService` 타입 지정 (인터페이스 선언 포함)
interface InspectionService {
  getInspections: (
    page: number,
    size: number
  ) => Promise<AxiosResponse<InspectionPageResponse>>;

  getInspection: (id: number) => Promise<AxiosResponse<InspectionResponseDto>>;

  getInspectionsByCategory: (
    category: string,
    page: number,
    size: number
  ) => Promise<AxiosResponse<InspectionPageResponse>>;
}

// 타입 단언으로 InspectionService의 타입 지정
const inspectionServiceWithType: InspectionService = inspectionService;

export default inspectionServiceWithType;
