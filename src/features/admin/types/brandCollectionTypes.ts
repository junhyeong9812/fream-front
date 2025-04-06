// 정렬 옵션 타입
export interface SortOption {
  field: string;
  order: "asc" | "desc";
}

// 브랜드 요청 DTO
export interface BrandRequestDto {
  name: string;
}

// 브랜드 응답 DTO
export interface BrandResponseDto {
  id: number;
  name: string;
}

// 페이지네이션 브랜드 응답
export interface PaginatedBrandResponse {
  content: BrandResponseDto[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

// 컬렉션 요청 DTO
export interface CollectionRequestDto {
  name: string;
}

// 컬렉션 응답 DTO
export interface CollectionResponseDto {
  id: number;
  name: string;
}

// 페이지네이션 컬렉션 응답
export interface PaginatedCollectionResponse {
  content: CollectionResponseDto[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
