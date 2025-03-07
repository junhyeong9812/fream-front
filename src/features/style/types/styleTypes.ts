export interface StyleResponseDto {
  id: number;
  profileId: number;
  profileName: string;
  profileImageUrl: string;
  content: string;
  mediaUrl: string;
  viewCount: number;
  likeCount: number;
  liked?: boolean;
}

export interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
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
  liked?: boolean;
  interested?: boolean;
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
  liked?: boolean;
}
