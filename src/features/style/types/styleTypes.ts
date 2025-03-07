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
  productId: number;
  productName: string;
  productEnglishName: string;
  colorName: string;
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

// 댓글 응답 DTO
export interface StyleCommentResponseDto {
  id: number;
  profileId: number;
  profileName: string;
  profileImageUrl: string;
  content: string;
  likeCount: number;
  liked?: boolean;
  createdDate: string;
  replies: StyleCommentResponseDto[];
}

// 댓글 목록 응답 DTO
export interface StyleCommentsResponseDto {
  comments: StyleCommentResponseDto[];
  totalComments: number;
  userProfileImageUrl: string | null;
}

// 댓글 추가 요청 DTO
export interface AddCommentRequestDto {
  styleId: number;
  content: string;
  parentCommentId?: number;
}

// 댓글 수정 요청 DTO
export interface UpdateCommentRequestDto {
  updatedContent: string;
}
