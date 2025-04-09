// 상품 성별 타입
export enum GenderType {
  MALE = "MALE",
  FEMALE = "FEMALE",
  KIDS = "KIDS",
  UNISEX = "UNISEX",
}

// 성별 한글 매핑
export const GenderKoreanMap: Record<GenderType, string> = {
  [GenderType.MALE]: "남성",
  [GenderType.FEMALE]: "여성",
  [GenderType.KIDS]: "키즈",
  [GenderType.UNISEX]: "유니섹스",
};

// 정렬 옵션 타입
export interface SortOption {
  field: string;
  order: "asc" | "desc";
}

// 상품 검색 요청 DTO
export interface ProductSearchDto {
  keyword?: string;
  categoryIds?: number[];
  genders?: GenderType[];
  brandIds?: number[];
  collectionIds?: number[];
  colors?: string[];
  sizes?: string[];
  minPrice?: number;
  maxPrice?: number;
  sortOption?: SortOption;
}

// 상품 검색 응답 DTO
export interface ProductSearchResponseDto {
  id: number;
  name: string;
  englishName: string;
  brandName: string;
  releasePrice: number;
  thumbnailImageUrl: string;
  price: number;
  colorName: string;
  colorId: number;
  interestCount: number;
  styleCount?: number;
  tradeCount?: number;
}

// 페이지네이션 상품 응답 타입
export interface PaginatedProductResponse {
  content: ProductSearchResponseDto[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

// 브랜드 응답 DTO
export interface BrandResponseDto {
  id: number;
  name: string;
}

// 카테고리 응답 DTO
export interface CategoryResponseDto {
  id: number;
  name: string;
  parentCategoryId: number | null;
}

// 컬렉션 응답 DTO
export interface CollectionResponseDto {
  id: number;
  name: string;
}

// 상품 생성 요청 DTO
export interface ProductCreateRequestDto {
  name: string;
  englishName: string;
  releasePrice: number;
  modelNumber: string;
  releaseDate: string;
  brandName: string;
  mainCategoryName: string;
  categoryName: string;
  collectionName?: string;
  gender: GenderType;
}

// 상품 생성 응답 DTO
export interface ProductCreateResponseDto {
  id: number;
  name: string;
}

// 상품 업데이트 요청 DTO
export interface ProductUpdateRequestDto {
  name?: string;
  englishName?: string;
  releasePrice?: number;
  modelNumber?: string;
  releaseDate?: string;
  brandName?: string;
  categoryName?: string;
  mainCategoryName?: string;
  collectionName?: string;
  gender?: GenderType;
}

// 상품 업데이트 응답 DTO
export interface ProductUpdateResponseDto {
  id: number;
  name: string;
}

// 상품 색상 생성 요청 DTO
export interface ProductColorCreateRequestDto {
  colorName: string; // 색상명
  content: string; // 상세 설명 (HTML)
  sizes: string[]; // 사이즈 배열 (문자열만 포함)
}

// 상품 색상 수정 요청 DTO
export interface ProductColorUpdateRequestDto {
  colorName: string; // 색상명
  content: string; // 상세 설명
  existingImages: string[]; // 유지할 기존 이미지 URL 목록
  existingDetailImages: string[]; // 유지할 기존 상세 이미지 URL 목록
  sizes: string[]; // 사이즈 배열 (문자열만 포함)
}

// 필터 데이터 응답 DTO
export interface FilterDataResponseDto {
  brands: BrandResponseDto[];
  mainCategories: CategoryResponseDto[];
  collections: CollectionResponseDto[];
  colors: string[];
  sizes: string[];
}

// 상품 색상 상세 응답 DTO
export interface ProductColorDetailResponseDto {
  id: number;
  colorName: string;
  content: string;
  thumbnailImageUrl: string;
  images: ProductImageDto[];
  detailImages: ProductDetailImageDto[];
  sizes: string[]; // 사이즈 배열 (문자열만 포함)
}

// 상품 이미지 DTO
export interface ProductImageDto {
  id: number;
  imageUrl: string;
}

// 상품 상세 이미지 DTO
export interface ProductDetailImageDto {
  id: number;
  imageUrl: string;
}

// 상품 상세 응답 DTO
export interface ProductDetailResponseDto {
  id: number;
  name: string;
  englishName: string;
  brandName: string;
  categoryName: string;
  mainCategoryName: string;
  collectionName?: string;
  releasePrice: number;
  releaseDate: string;
  modelNumber: string;
  gender: GenderType;
  colors: ProductColorDetailResponseDto[];
}
