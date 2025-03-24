export interface OrderBidRequestDto {
  productSizeId: number;
  bidPrice: number;
}

export interface InstantOrderRequestDto {
  saleBidId: number;
  addressId: number;
  warehouseStorage: boolean;
  paymentRequest: PaymentRequestDto;
}

export interface PayAndShipmentRequestDto {
  paymentRequest: PaymentRequestDto;
  receiverName: string;
  receiverPhone: string;
  postalCode: string;
  address: string;
  warehouseStorage: boolean;
}

export interface PaymentRequestDto {
  userEmail?: string;
  orderId?: number | null;
  paymentMethod: string;
  amount: number;
  merchantUid: string;
  buyerName: string;
  buyerEmail: string;
  buyerTel: string;
  buyerAddr: string;
  buyerPostcode: string;
}
