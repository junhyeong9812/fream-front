// 정렬 옵션 타입
export interface SortOption {
  field: string;
  order: "asc" | "desc";
}

// 이벤트 상태 열거형
export enum EventStatus {
  UPCOMING = "UPCOMING",
  ACTIVE = "ACTIVE",
  ENDED = "ENDED",
}

// 이벤트 목록 항목 DTO
export interface EventListDto {
  id: number;
  title: string;
  startDate: string; // ISO 문자열 형식으로 받음
  endDate: string; // ISO 문자열 형식으로 받음
  thumbnailUrl: string;
  brandId: number;
  brandName: string;
  isActive: boolean;
  status: EventStatus; // 상태 필드 추가
  statusDisplayName: string; // 상태 표시명 추가 ("예정", "진행 중", "종료")
}

// 이벤트 상세 정보 DTO
export interface EventDetailDto {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  thumbnailUrl: string;
  simpleImageUrls: string[];
  brandId: number;
  brandName: string;
  isActive: boolean;
  status: EventStatus; // 상태 필드 추가
  statusDisplayName: string; // 상태 표시명 추가
  createdDate: string;
  modifiedDate: string;
}

// 이벤트 생성 요청 DTO
export interface CreateEventRequestDto {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  brandId: number;
}

// 이벤트 수정 요청 DTO
export interface UpdateEventRequestDto {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  keepImageFileNames: string[];
}

// 페이지네이션 이벤트 응답
export interface PaginatedEventResponse {
  content: EventListDto[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

// 이벤트 검색 요청 DTO
export interface EventSearchDto {
  keyword?: string;
  brandId?: number;
  isActive?: boolean;
  status?: EventStatus; // 상태 필드 추가
  startDate?: string;
  endDate?: string;
  sortOption?: SortOption;
}
