// 공지사항 카테고리 enum (백엔드 enum과 일치)
export enum NoticeCategory {
  ANNOUNCEMENT = "ANNOUNCEMENT", // 공지
  EVENT = "EVENT", // 이벤트
  SERVICE = "SERVICE", // 서비스 안내
  OTHERS = "OTHERS", // 기타
}

// 카테고리 한글화 맵
export const CategoryKoreanMap: Record<NoticeCategory, string> = {
  [NoticeCategory.ANNOUNCEMENT]: "공지",
  [NoticeCategory.EVENT]: "이벤트",
  [NoticeCategory.SERVICE]: "서비스 안내",
  [NoticeCategory.OTHERS]: "기타",
};

// 단일 공지사항 응답 DTO
export interface NoticeResponseDto {
  id: number;
  title: string;
  content: string;
  category: string;
  createdDate: string;
  modifiedDate?: string; // updatedDate에서 modifiedDate로 변경
  imageUrls: string[];
}

// 페이징된 공지사항 응답
export interface PaginatedNoticeResponse {
  content: NoticeResponseDto[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

// 공지사항 생성 요청 DTO
export interface NoticeCreateRequestDto {
  title: string;
  content: string;
  category: NoticeCategory;
  files?: File[];
}

// 공지사항 수정 요청 DTO
export interface NoticeUpdateRequestDto {
  title: string;
  content: string;
  category: NoticeCategory;
  existingImageUrls?: string[];
  newFiles?: File[];
}
