// 하위 카테고리 DTO 인터페이스
export interface CategorySubDto {
  id: number;
  value: string;
  label: string;
  subCategories?: CategorySubDto[] | null;
}

// 카테고리 DTO 인터페이스
export interface CategoryDto {
  id: number;
  value: string;
  label: string;
  subCategories?: CategorySubDto[] | null;
}

// 카테고리 데이터 구조 타입
export interface CategoryDataItem {
  name: string;
  options: ButtonOption[];
}

// 필터 데이터 타입
export interface FilterDataType {
  sizes: Record<string, string[]>;
  genders: { value: string; label: string }[];
  colors: { key: string; name: string }[];
  discounts: { title: string; options: string[] }[];
  priceRanges: { label: string; value: string }[];
  categories: CategoryDto[];
  brands: { id: number; value: string; label: string }[];
  collections: { id: number; value: string; label: string }[];
}

// 필터 모달 속성
export interface FilterModalProps {
  open: boolean;
  onClose: () => void;
  onApplyFilters: (filters: SelectedFiltersPayload) => void;
  categoryList: ButtonOption[];
  outerwearList: ButtonOption[];
  shirtsList: ButtonOption[];
}

// 필터 객체 타입
export type SelectedFilters = Record<string, Set<string>>;

// 검색 매개변수 인터페이스
export interface SearchParams {
  keyword: string | null;
  categoryIds: number[];
  genders: string[];
  brandIds: number[];
  collectionIds: number[];
  colors: string[];
  sizes: string[];
  minPrice: number | null;
  maxPrice: number | null;
  sortOption: { field: string; order: string } | null;
}

// 필터 카운트 응답 인터페이스
export interface FilterCountResponseDto {
  totalCount: number;
}

// 제품 인터페이스
export interface Product {
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
  styleCount: number;
  tradeCount: number;
  // 아래는 ImageData 인터페이스가 추가로 가지고 있던 필드들 (중복 필드는 제외)
  imgUrl?: string; // 일부 API에서 thumbnailImageUrl 대신 imgUrl을 사용할 수 있음
  productName?: string; // name과 동일한 필드지만 일부 컴포넌트에서 다른 이름으로 참조할 수 있음
  productPrice?: string; // price를 포맷팅한 문자열(예: "100,000원")
}

// 기존 ImageData 타입을 Product 타입의 별칭으로 유지 (기존 코드 호환성)
export type ImageData = Product;

// 필터 상태 타입
export interface ModalFilters {
  categories: string[];
  gender: string | null;
  colors: string[];
  priceRange: string | null;
  sizes: string[];
  brands: string[];
}

// 버튼 타입
export interface ButtonOption {
  value: string;
  label: string;
}

// 색상 타입
export interface ColorOption {
  name: string;
  rgb?: string;
  img?: string;
}

// 필터 API용 페이로드
export interface SelectedFiltersPayload {
  categoryIds?: number[];
  genders?: string[];
  brandIds?: number[];
  collectionIds?: number[];
  colors?: string[];
  sizes?: string[];
  minPrice?: number;
  maxPrice?: number;
  keyword?: string;
  sortOption?: string;
  deliveryOption?: string;
  isBelowOriginalPrice?: boolean;
  isExcludeSoldOut?: boolean;
}

// 브랜드 그룹화에 사용되는 타입
export interface GroupedBrands {
  [key: string]: { id: number; value: string; label: string }[];
}

// 다국어 지원을 위한 헬퍼 타입들
export interface LocalizedLabel {
  [locale: string]: string;
}

export interface BrandItem {
  id: number;
  value: string;
  label: string;
}

// 페이징 응답을 위한 인터페이스
export interface PaginatedResponse<T> {
  content: T[];
  pageable?: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    unpaged: boolean;
    paged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  size?: number;
  number?: number;
  sort?: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first?: boolean;
  numberOfElements?: number;
  empty?: boolean;
}

