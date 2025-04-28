// 검수 카테고리 enum (백엔드와 일치)
export enum InspectionCategory {
  SHOES = "SHOES", // 신발
  OUTER = "OUTER", // 아우터
  BAG = "BAG", // 가방
  TECH = "TECH", // 테크
  BEAUTY = "BEAUTY", // 뷰티
  PREMIUM_WATCH = "PREMIUM_WATCH", // 프리미엄 시계
  PREMIUM_BAG = "PREMIUM_BAG", // 프리미엄 가방
}

// 카테고리 한글 표시 매핑 - 백엔드 카테고리와 일치하도록 수정
export const CategoryKoreanMap: Record<InspectionCategory, string> = {
  [InspectionCategory.SHOES]: "신발",
  [InspectionCategory.OUTER]: "아우터 · 상의 · 하의",
  [InspectionCategory.BAG]: "가방 · 시계 · 지갑 · 패션잡화",
  [InspectionCategory.TECH]: "테크",
  [InspectionCategory.BEAUTY]: "뷰티 · 컬렉터블 · 캠핑 · 가구/리빙",
  [InspectionCategory.PREMIUM_WATCH]: "프리미엄 시계",
  [InspectionCategory.PREMIUM_BAG]: "프리미엄 가방",
};

// 검수 기준 응답 DTO 인터페이스 - BaseTimeEntity 필드명과 일치하도록 수정
export interface InspectionStandardResponseDto {
  id: number;
  category: string;
  content: string;
  imageUrls: string[];
  createdDate: string; // 생성일 (BaseTimeEntity와 일치)
  modifiedDate: string; // 수정일 (BaseTimeEntity와 일치)
}

// 검수 기준 생성 DTO 인터페이스
export interface InspectionStandardCreateRequestDto {
  category: InspectionCategory;
  content: string;
  files: File[];
}

// 검수 기준 수정 DTO 인터페이스
export interface InspectionStandardUpdateRequestDto {
  category: InspectionCategory;
  content: string;
  existingImageUrls: string[];
  newFiles: File[];
}

// API 응답 포맷
export interface ResponseDto<T> {
  code: string;
  message: string;
  data: T;
}

// 페이지네이션 응답 포맷
export interface PageResponseDto<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
}
