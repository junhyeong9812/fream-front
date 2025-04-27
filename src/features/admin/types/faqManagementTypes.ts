// FAQ 카테고리 enum
export enum FAQCategory {
  POLICY = "POLICY", // 이용 정책
  GENERAL = "GENERAL", // 공통
  BUYING = "BUYING", // 구매
  SELLING = "SELLING", // 판매
}

// FAQ 카테고리 한글 매핑
export const CategoryKoreanMap: Record<FAQCategory, string> = {
  [FAQCategory.POLICY]: "이용 정책",
  [FAQCategory.GENERAL]: "공통",
  [FAQCategory.BUYING]: "구매",
  [FAQCategory.SELLING]: "판매",
};

// FAQ 응답 DTO
export interface FAQResponseDto {
  id: number;
  category: string;
  question: string;
  answer: string;
  imageUrls: string[];
  createdDate: string;
  modifiedDate: string;
}

// FAQ 생성 요청 DTO
export interface FAQCreateRequestDto {
  category: FAQCategory;
  question: string;
  answer: string;
  files?: File[];
}

// FAQ 수정 요청 DTO
export interface FAQUpdateRequestDto {
  category: FAQCategory;
  question: string;
  answer: string;
  retainedImageUrls?: string[];
  newFiles?: File[];
}

// 페이지네이션된 FAQ 응답
export interface PaginatedFAQResponse {
  content: FAQResponseDto[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: {
    offset: number;
    pageNumber: number;
    pageSize: number;
  };
  size: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  totalElements: number;
  totalPages: number;
}
