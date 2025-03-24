export interface ProductDetailDto {
  id: number;
  name: string;
  englishName: string;
  releasePrice: number;
  thumbnailImageUrl: string;
  brandName: string;
  colorId?: number;
  colorName?: string;
  content?: string;
  interestCount?: number;
  sizes?: SizeDetailDto[];
  otherColors?: ColorDetailDto[];
}

export interface SizeDetailDto {
  size: string;
  purchasePrice: number; // 구매가
  salePrice: number; // 판매가
  quantity: number; // 재고 수량
}

export interface ColorDetailDto {
  colorId: number;
  colorName: string;
  thumbnailImageUrl: string;
  content: string;
}
