// 판매 입찰 요청 DTO
export interface SaleBidRequestDto {
  productSizeId: number; // 상품 사이즈 ID (실제로는 추가 정보 필요)
  bidPrice: number; // 입찰 가격
  returnAddress: string; // 반송 주소
  postalCode: string; // 우편번호
  receiverPhone: string; // 수령인 전화번호
  warehouseStorage: boolean; // 창고 보관 여부
}

// 즉시 판매 요청 DTO
export interface InstantSaleRequestDto {
  orderBidId: number; // 구매 입찰 ID
  returnAddress: string; // 반송 주소
  postalCode: string; // 우편번호
  receiverPhone: string; // 수령인 전화번호
}

// 판매 응답 타입
export interface SaleResponseDto {
  id: number; // 판매 ID
  price: number; // 가격
  status: string; // 상태
  createdAt: string; // 생성일
}

// 주문 입찰 정보
export interface OrderBidDto {
  id: number; // 주문 입찰 ID
  price: number; // 가격
  createdAt: string; // 생성일
}
