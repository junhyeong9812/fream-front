export interface StyleResponseDto {
  id: number;
  profileName: string;
  profileImageUrl: string;
  content: string;
  mediaUrl: string;
  viewCount: number;
  likeCount: number;
}

export interface StyleDetailResponseDto {
  id: number;
  profileId: number;
  profileName: string;
  profileImageUrl: string;
  content: string;
  mediaUrls: string[];
  likeCount: number;
  commentCount: number;
  productInfos: ProductInfoDto[];
  createdDate: string;
}

export interface ProductInfoDto {
  productName: string;
  productEnglishName: string;
  thumbnailImageUrl: string;
  minSalePrice: number;
}

export interface ProfileStyleResponseDto {
  id: number;
  mediaUrl: string;
  likeCount: number;
  commentCount: number;
}
