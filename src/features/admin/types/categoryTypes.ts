export interface CategoryRequestDto {
    mainCategoryName: string;
    subCategoryName?: string;
  }
  
  export interface CategoryResponseDto {
    id: number;
    name: string;
    parentCategoryId: number | null;
  }
  
  export interface SortOption {
    field: string;
    order: 'asc' | 'desc';
  }