// 주문 입찰 요청 DTO
export interface OrderBidRequestDto {
  productSizeId: number;
  bidPrice: number;
}

// 결제 요청 DTO
export interface PaymentRequestDto {
  paymentMethod: string;
  amount: number;
  orderId: number;
  impUid: string;
  merchantUid: string;
  userEmail?: string;
}

// 결제 및 배송 요청 DTO
export interface PayAndShipmentRequestDto {
  paymentRequest: PaymentRequestDto;
  receiverName: string;
  receiverPhone: string;
  postalCode: string;
  address: string;
  warehouseStorage: boolean;
}

// 즉시 구매 요청 DTO
export interface InstantOrderRequestDto {
  saleBidId: number;
  addressId: number;
  warehouseStorage: boolean;
  paymentRequest: PaymentRequestDto;
}

// 주문 상태 열거형
export enum OrderStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
}

// 주문 응답 DTO
export interface OrderResponseDto {
  id: number;
  status: OrderStatus;
  orderDate: string;
  totalAmount: number;
  productName: string;
  productSize: string;
  thumbnailImageUrl: string;
  deliveryStatus: string;
}
