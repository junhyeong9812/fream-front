// 입찰 상태 타입
export enum BidStatus {
  PENDING = "PENDING", // 입찰 대기 중
  MATCHED = "MATCHED", // 매칭 완료
  CANCELLED = "CANCELLED", // 입찰 취소
  COMPLETED = "COMPLETED", // 거래 완료
}

// 주문 상태 타입
export enum OrderStatus {
  PENDING_PAYMENT = "PENDING_PAYMENT", // 결제 대기
  PAYMENT_COMPLETED = "PAYMENT_COMPLETED", // 결제 완료
  PREPARING = "PREPARING", // 상품 준비 중
  IN_WAREHOUSE = "IN_WAREHOUSE", // 창고 보관 중
  SHIPMENT_STARTED = "SHIPMENT_STARTED", // 배송 시작
  IN_TRANSIT = "IN_TRANSIT", // 배송 중
  COMPLETED = "COMPLETED", // 배송 완료
  REFUND_REQUESTED = "REFUND_REQUESTED", // 환불 대기
  REFUNDED = "REFUNDED", // 환불 완료
}

// 상태별 한글 표시
export const BidStatusKorean: Record<BidStatus, string> = {
  [BidStatus.PENDING]: "입찰 대기 중",
  [BidStatus.MATCHED]: "매칭 완료",
  [BidStatus.CANCELLED]: "입찰 취소",
  [BidStatus.COMPLETED]: "거래 완료",
};

export const OrderStatusKorean: Record<OrderStatus, string> = {
  [OrderStatus.PENDING_PAYMENT]: "결제 대기",
  [OrderStatus.PAYMENT_COMPLETED]: "결제 완료",
  [OrderStatus.PREPARING]: "상품 준비 중",
  [OrderStatus.IN_WAREHOUSE]: "창고 보관 중",
  [OrderStatus.SHIPMENT_STARTED]: "배송 시작",
  [OrderStatus.IN_TRANSIT]: "배송 중",
  [OrderStatus.COMPLETED]: "배송 완료",
  [OrderStatus.REFUND_REQUESTED]: "환불 대기",
  [OrderStatus.REFUNDED]: "환불 완료",
};

// 필터 표시용 상태 목록
export const statusFilters = [
  "전체",
  "대기 중",
  "발송완료",
  "입고대기",
  "입고완료",
  "검수 중",
  "검수보류",
  "검수합격",
  "배송 중",
  "거래실패",
  "상품준비 중",
  "반품신청",
  "접수완료",
  "회수 중",
  "회수완료",
  "교환신청",
  "교환 중",
];

// 백엔드 API 요청에 사용할 매핑
export const statusFilterMapping: Record<
  string,
  { bidStatus?: BidStatus; orderStatus?: OrderStatus }
> = {
  전체: {},
  "대기 중": { orderStatus: OrderStatus.PENDING_PAYMENT },
  발송완료: { orderStatus: OrderStatus.SHIPMENT_STARTED },
  입고대기: { orderStatus: OrderStatus.PAYMENT_COMPLETED },
  입고완료: { orderStatus: OrderStatus.IN_WAREHOUSE },
  "검수 중": { orderStatus: OrderStatus.PREPARING },
  검수보류: { orderStatus: OrderStatus.PREPARING },
  검수합격: { orderStatus: OrderStatus.PREPARING },
  "배송 중": { orderStatus: OrderStatus.IN_TRANSIT },
  거래실패: { bidStatus: BidStatus.CANCELLED },
  "상품준비 중": { orderStatus: OrderStatus.PREPARING },
  반품신청: { orderStatus: OrderStatus.REFUND_REQUESTED },
  접수완료: { orderStatus: OrderStatus.REFUND_REQUESTED },
  "회수 중": { orderStatus: OrderStatus.REFUND_REQUESTED },
  회수완료: { orderStatus: OrderStatus.REFUNDED },
  교환신청: { orderStatus: OrderStatus.PREPARING },
  "교환 중": { orderStatus: OrderStatus.PREPARING },
};

// 주문 입찰 응답 DTO 타입
export interface OrderBidResponseDto {
  orderBidId: number;
  productId: number;
  productName: string;
  productEnglishName: string;
  size: string;
  colorName: string;
  imageUrl: string;
  bidPrice: number;
  bidStatus: string; // 백엔드에서 문자열로 반환될 수 있어 string 타입 유지
  orderStatus: string; // 백엔드에서 문자열로 반환될 수 있어 string 타입 유지
  shipmentStatus: string;
  createdDate: string;
  modifiedDate: string;
}

// 주문 입찰 상태별 카운트 DTO 타입
export interface OrderBidStatusCountDto {
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
