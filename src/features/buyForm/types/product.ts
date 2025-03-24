export interface ProductDetailDto {
  id: number;
  prid?: string;
  name: string;
  nameEng?: string;
  nameKor?: string;
  price?: number;
  releasePrice: number;
  thumbnailImageUrl?: string;
  imgName?: string;
  brandName?: string;
  colorId?: number;
  colorName?: string;
  content?: string;
  interestCount?: number;
  sizes?: SizeDetailDto[];
}

export interface SizeDetailDto {
  size: string;
  purchasePrice: number;
  salePrice: number;
  quantity: number;
}
