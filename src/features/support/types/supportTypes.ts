export interface SupportItem {
  id: string;
  title: string;
  content: string;
}

export interface Notice {
  id: number;
  category: string;
  title: string;
  content: string;
  createdDate: string; // BaseTimeEntity와 일치하도록 변경: createdAt → createdDate
  modifiedDate: string; // BaseTimeEntity와 일치하도록 변경: updatedAt → modifiedDate
  files?: string[]; // 첨부 파일 URL 배열 (옵션)
}

// API 응답에서 사용될 공지사항 데이터 형식
export interface NoticeResponseDto {
  id: number;
  title: string;
  content: string;
  category: string;
  createdDate: string; // BaseTimeEntity와 일치하도록 변경: createdAt → createdDate
  modifiedDate: string; // BaseTimeEntity와 일치하도록 변경: updatedAt → modifiedDate
  files?: string[]; // 첨부 파일 URL 배열 (옵션)
}

// 공통 페이징 응답 형식
export interface PageResponse<T> {
  content: T[]; // 현재 페이지의 데이터 배열
  totalElements: number; // 전체 데이터 개수
  totalPages: number; // 전체 페이지 수
  size: number; // 페이지당 데이터 개수
  number: number; // 현재 페이지 (0부터 시작)
  first: boolean; // 첫 번째 페이지 여부
  last: boolean; // 마지막 페이지 여부
}

// 공지사항 페이징 응답 형식
export type NoticePageResponse = PageResponse<NoticeResponseDto>;

export interface DummyData {
  totalElements: number;
  totalPages: number;
  size: number;
  content: Notice[];
}

export const categoryMapping: Record<string, string> = {
  전체: "ALL",
  공지: "ANNOUNCEMENT",
  이벤트: "EVENT",
  "서비스 안내": "SERVICE",
  기타: "OTHERS",
};

// Inspection 관련 타입
export interface Inspection {
  id: number;
  category: string; // 검수 기준 카테고리
  content: string; // 검수 기준 내용
  imageUrls: string[]; // 이미지 URL 배열
  createdDate: string; // BaseTimeEntity와 일치하도록 변경: createdAt → createdDate
  modifiedDate: string; // BaseTimeEntity와 일치하도록 변경: updatedAt → modifiedDate
}

// Inspection 응답 DTO 형식
export interface InspectionResponseDto {
  id: number;
  category: string;
  content: string;
  imageUrls: string[];
  createdDate: string; // BaseTimeEntity와 일치하도록 변경: createdAt → createdDate
  modifiedDate: string; // BaseTimeEntity와 일치하도록 변경: updatedAt → modifiedDate
}

// 공통 페이징 응답 형식에 Inspection 추가
export type InspectionPageResponse = PageResponse<InspectionResponseDto>;

// InspectionCategory Enum과 매핑 - 백엔드와 정확히 일치하도록 수정
export const inspectionCategoryMapping: Record<string, string> = {
  신발: "SHOES",
  "아우터 · 상의 · 하의": "OUTER", // 통합된 카테고리로 수정
  "가방 · 시계 · 지갑 · 패션잡화": "BAG", // 통합된 카테고리로 수정
  테크: "TECH",
  "뷰티 · 컬렉터블 · 캠핑 · 가구/리빙": "BEAUTY", // 통합된 카테고리로 수정
  "프리미엄 시계": "PREMIUM_WATCH",
  "프리미엄 가방": "PREMIUM_BAG",
};

// FAQ 응답 DTO 형식 - 백엔드 API와 일치
export interface FAQResponseDto {
  id: number;
  category: string; // FAQ 카테고리
  question: string; // 질문
  answer: string; // 답변
  imageUrls: string[]; // 이미지 URL 배열
  createdDate: string; // 생성 날짜 (ISO 8601 형식)
  modifiedDate: string; // 수정 날짜 (ISO 8601 형식)
}

// FAQ 페이징 응답 형식
export type FAQPageResponse = PageResponse<FAQResponseDto>;

// FAQ 카테고리 Enum과 매핑
export const faqCategoryMapping: Record<string, string> = {
  전체: "ALL",
  이용정책: "POLICY",
  공통: "GENERAL",
  구매: "BUYING",
  판매: "SELLING",
};
