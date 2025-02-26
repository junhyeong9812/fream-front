// Category related types
export interface CategorySubDto {
  id: number;
  value: string;
  label: string;
  subCategories?: CategorySubDto[] | null;
}

export interface CategoryDto {
  id: number;
  value: string;
  label: string;
  subCategories?: CategorySubDto[] | null;
}

// Category data structure type
export interface CategoryDataItem {
  name: string;
  options: ButtonOption[];
}

// Filter data type
export interface FilterDataType {
  sizes: Record<string, string[]>;
  genders: string[];
  colors: { key: string; name: string }[];
  discounts: { title: string; options: string[] }[];
  priceRanges: { label: string; value: string }[];
  categories: CategoryDto[];
}

export interface FilterModalProps {
  open: boolean;
  onClose: () => void;
  onApplyFilters: (filters: SelectedFiltersPayload) => void;
  categoryList: ButtonOption[];
  outerwearList: ButtonOption[];
  shirtsList: ButtonOption[];
}

// Filter object type
export type SelectedFilters = Record<string, Set<string>>;

// Search parameters interface
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

// Filter count response interface
export interface FilterCountResponseDto {
  totalCount: number;
}

// Product 및 ImageData 인터페이스 - 둘을 통합
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

// Filter state type
export interface ModalFilters {
  categories: string[];
  gender: string | null;
  colors: string[];
  priceRange: string | null;
  sizes: string[];
  brands: string[];
}

// Button type
export interface ButtonOption {
  value: string;
  label: string;
}

// Color type
export interface ColorOption {
  name: string;
  rgb?: string;
  img?: string;
}

// Payload for filter API
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
}
