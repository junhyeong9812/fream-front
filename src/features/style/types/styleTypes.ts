export interface HashtagResponseDto {
  id: number;
  name: string;
  count: number;
}

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
  interested?: boolean; // 관심 상태 추가
  hashtags: HashtagResponseDto[]; // 해시태그 목록 추가
  createdDate?: string;
  modifiedDate?: string;
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
  interestCount?: number; // 관심 수 추가
  liked?: boolean;
  interested?: boolean;
  productInfos: ProductInfoDto[];
  hashtags: HashtagResponseDto[]; // 해시태그 목록 추가
  createdDate: string;
  modifiedDate?: string;
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
  liked?: boolean;
  hashtags: HashtagResponseDto[]; // 해시태그 목록 추가
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

// 해시태그 요청/응답 관련 인터페이스
export interface HashtagCreateRequestDto {
  name: string;
}

export interface HashtagUpdateRequestDto {
  name: string;
}
