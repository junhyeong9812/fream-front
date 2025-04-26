import apiClient from "src/global/services/ApiClient";
import {
  EventListDto,
  EventDetailDto,
  CreateEventRequestDto,
  UpdateEventRequestDto,
  PaginatedEventResponse,
  EventSearchDto,
  SortOption,
  EventStatus,
} from "../types/eventTypes";

/**
 * 이벤트 관리 API 서비스
 */
export class EventService {
  private static EVENT_URL = "/events";
  private static ADMIN_EVENT_URL = "/admin/events";

  /**
   * 이벤트 목록 조회 (페이징)
   */
  static async getEventsPaging(
    page: number = 0,
    size: number = 10,
    sortOption?: SortOption
  ): Promise<PaginatedEventResponse> {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("size", size.toString());

    if (sortOption) {
      params.append("sort", `${sortOption.field},${sortOption.order}`);
    }

    const response = await apiClient.get(
      `${this.EVENT_URL}/page?${params.toString()}`
    );
    return response.data;
  }

  /**
   * 이벤트 검색 (페이징)
   */
  static async searchEvents(
    searchDto: EventSearchDto,
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedEventResponse> {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("size", size.toString());

    if (searchDto.keyword) {
      params.append("keyword", searchDto.keyword);
    }

    if (searchDto.brandId) {
      params.append("brandId", searchDto.brandId.toString());
    }

    if (searchDto.isActive !== undefined) {
      params.append("isActive", searchDto.isActive.toString());
    }

    // 상태 필드 추가
    if (searchDto.status) {
      params.append("status", searchDto.status);
    }

    if (searchDto.startDate) {
      params.append("startDate", searchDto.startDate);
    }

    if (searchDto.endDate) {
      params.append("endDate", searchDto.endDate);
    }

    if (searchDto.sortOption) {
      params.append(
        "sort",
        `${searchDto.sortOption.field},${searchDto.sortOption.order}`
      );
    }

    const response = await apiClient.get(
      `${this.EVENT_URL}/search?${params.toString()}`
    );
    return response.data;
  }

  /**
   * 활성 이벤트 목록 조회 (페이징)
   */
  static async getActiveEvents(
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedEventResponse> {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("size", size.toString());

    const response = await apiClient.get(
      `${this.EVENT_URL}/active?${params.toString()}`
    );
    return response.data;
  }

  /**
   * 상태별 이벤트 목록 조회
   */
  static async getEventsByStatus(
    status: EventStatus,
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedEventResponse> {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("size", size.toString());

    const response = await apiClient.get(
      `${this.EVENT_URL}/status/${status}?${params.toString()}`
    );
    return response.data;
  }

  /**
   * 특정 브랜드의 이벤트 목록 조회 (페이징)
   */
  static async getEventsByBrand(
    brandId: number,
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedEventResponse> {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("size", size.toString());

    const response = await apiClient.get(
      `${this.EVENT_URL}/brands/${brandId}?${params.toString()}`
    );
    return response.data;
  }

  /**
   * 이벤트 상세 정보 조회
   */
  static async getEventDetail(eventId: number): Promise<EventDetailDto> {
    const response = await apiClient.get(`${this.EVENT_URL}/${eventId}`);
    return response.data;
  }

  /**
   * 이벤트 생성 (FormData 활용)
   */
  static async createEvent(
    data: CreateEventRequestDto,
    thumbnailFile?: File,
    simpleImageFiles?: File[]
  ): Promise<number> {
    const formData = new FormData();

    // JSON 데이터 추가
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("startDate", data.startDate);
    formData.append("endDate", data.endDate);
    formData.append("brandId", data.brandId.toString());

    // 파일 추가
    if (thumbnailFile) {
      formData.append("thumbnailFile", thumbnailFile);
    }

    if (simpleImageFiles && simpleImageFiles.length > 0) {
      simpleImageFiles.forEach((file) => {
        formData.append("simpleImageFiles", file);
      });
    }

    const response = await apiClient.post(this.EVENT_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  }

  /**
   * 이벤트 수정 (FormData 활용)
   * 변경된 이미지만 처리하도록 개선
   */
  static async updateEvent(
    eventId: number,
    data: UpdateEventRequestDto,
    thumbnailFile?: File,
    simpleImageFiles?: File[]
  ): Promise<number> {
    const formData = new FormData();

    // JSON 데이터 추가
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("startDate", data.startDate);
    formData.append("endDate", data.endDate);

    // 유지할 이미지 파일명 추가
    if (data.keepImageFileNames && data.keepImageFileNames.length > 0) {
      data.keepImageFileNames.forEach((fileName) => {
        formData.append("keepImageFileNames", fileName);
      });
    }

    // 파일 추가
    if (thumbnailFile) {
      formData.append("thumbnailFile", thumbnailFile);
    }

    if (simpleImageFiles && simpleImageFiles.length > 0) {
      simpleImageFiles.forEach((file) => {
        formData.append("simpleImageFiles", file);
      });
    }

    const response = await apiClient.patch(
      `${this.EVENT_URL}/${eventId}`,
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
   * 이벤트 삭제
   */
  static async deleteEvent(eventId: number): Promise<void> {
    await apiClient.delete(`${this.EVENT_URL}/${eventId}`);
  }

  /**
   * 이벤트 상태 직접 변경 (관리자용)
   */
  static async updateEventStatus(
    eventId: number,
    status: EventStatus
  ): Promise<EventStatus> {
    const params = new URLSearchParams();
    params.append("status", status);

    const response = await apiClient.patch(
      `${this.EVENT_URL}/${eventId}/status?${params.toString()}`
    );

    return response.data;
  }
}
