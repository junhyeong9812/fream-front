// 입찰 상태 타입
export enum BidStatus {
  PENDING = "PENDING", // 입찰 대기 중
  MATCHED = "MATCHED", // 매칭 완료
  CANCELLED = "CANCELLED", // 입찰 취소
  COMPLETED = "COMPLETED", // 거래 완료
}

// 판매 상태 타입
export enum SaleStatus {
  PENDING_SHIPMENT = "PENDING_SHIPMENT", // 판매자 발송 대기
  IN_TRANSIT = "IN_TRANSIT", // 배송 중
  IN_INSPECTION = "IN_INSPECTION", // 검수 중
  FAILED_INSPECTION = "FAILED_INSPECTION", // 검수 불합격
  IN_STORAGE = "IN_STORAGE", // 창고 보관 중
  ON_AUCTION = "ON_AUCTION", // 판매 입찰 중
  SOLD = "SOLD", // 판매 완료
  AUCTION_EXPIRED = "AUCTION_EXPIRED", // 입찰 기한 만료
}

// 상태별 한글 표시
export const BidStatusKorean: Record<BidStatus, string> = {
  [BidStatus.PENDING]: "입찰 대기 중",
  [BidStatus.MATCHED]: "매칭 완료",
  [BidStatus.CANCELLED]: "입찰 취소",
  [BidStatus.COMPLETED]: "거래 완료",
};

export const SaleStatusKorean: Record<SaleStatus, string> = {
  [SaleStatus.PENDING_SHIPMENT]: "판매자 발송 대기",
  [SaleStatus.IN_TRANSIT]: "배송 중",
  [SaleStatus.IN_INSPECTION]: "검수 중",
  [SaleStatus.FAILED_INSPECTION]: "검수 불합격",
  [SaleStatus.IN_STORAGE]: "창고 보관 중",
  [SaleStatus.ON_AUCTION]: "판매 입찰 중",
  [SaleStatus.SOLD]: "판매 완료",
  [SaleStatus.AUCTION_EXPIRED]: "입찰 기한 만료",
};

// 필터 표시용 상태 목록
export const statusFilters = [
  "전체",
  "판매자 발송 대기",
  "배송 중",
  "검수 중",
  "검수 불합격",
  "창고 보관 중",
  "판매 입찰 중",
  "판매 완료",
  "입찰 기한 만료",
];

// 백엔드 API 요청에 사용할 매핑
export const statusFilterMapping: Record<
  string,
  { saleBidStatus?: BidStatus; saleStatus?: SaleStatus }
> = {
  전체: {},
  "판매자 발송 대기": { saleStatus: SaleStatus.PENDING_SHIPMENT },
  "배송 중": { saleStatus: SaleStatus.IN_TRANSIT },
  "검수 중": { saleStatus: SaleStatus.IN_INSPECTION },
  "검수 불합격": { saleStatus: SaleStatus.FAILED_INSPECTION },
  "창고 보관 중": { saleStatus: SaleStatus.IN_STORAGE },
  "판매 입찰 중": { saleStatus: SaleStatus.ON_AUCTION },
  "판매 완료": { saleStatus: SaleStatus.SOLD },
  "입찰 기한 만료": { saleStatus: SaleStatus.AUCTION_EXPIRED },
  "입찰 대기 중": { saleBidStatus: BidStatus.PENDING },
  "매칭 완료": { saleBidStatus: BidStatus.MATCHED },
  "입찰 취소": { saleBidStatus: BidStatus.CANCELLED },
  "거래 완료": { saleBidStatus: BidStatus.COMPLETED },
};

// 판매 입찰 응답 DTO 타입
export interface SaleBidResponseDto {
  saleBidId: number;
  productId: number;
  productName: string;
  productEnglishName: string;
  size: string;
  colorName: string;
  thumbnailImageUrl: string;
  bidPrice: number;
  saleBidStatus: string;
  saleStatus: string;
  shipmentStatus: string;
  createdDate: string;
  modifiedDate: string;
}

// 판매 입찰 상태별 카운트 DTO 타입
export interface SaleBidStatusCountDto {
  pendingCount: number; // 대기 중
  matchedCount: number; // 매칭 완료
  cancelledOrCompletedCount: number; // 취소 및 완료
}

// 페이지 응답 타입
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
    unpaged: boolean;
    paged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

// SalesBox 컴포넌트의 Props 타입
export interface SalesBoxProps {
  title: string; // 타이틀 이름 (구매 내역, 판매 내역 등)
  tabs: Array<{
    title: string; // 탭 이름 (전체, 입찰 중 등)
    count: number; // 해당 탭의 숫자
    isTotal?: boolean; // 전체인지 여부
    href: string; // 링크
  }>;
  onTabClick?: (href: string) => void; // 탭 클릭 핸들러
}
