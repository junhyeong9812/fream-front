export interface MypageData {
  id: string;
  name: string;
  email: string;
}

export interface AddressData {
  id: number; // 고유 식별자 추가
  name: string;
  phoneNumber: string;
  zonecode: string;
  roadAddress: string;
  detailAddress: string;
  isDefaultAddress: boolean;
}

// 컴포넌트 정의
export interface AddAddressModalProps {
  onClose: () => void;
  onSubmit: (data: AddressData) => void;
  initialData?: AddressData | null;
}

export interface AddCardModalProps {
  isOpened: boolean;
  onClose: () => void;
}
export type OrderBidResponseDto = {
  orderBidId: number; // OrderBid ID
  productId: number; // 추가된 필드
  productName: string; // 상품명
  productEnglishName?: string; // 상품 영어명 (옵션)
  size: string; // 상품 사이즈
  colorName?: string; // 색상 이름 (옵션)
  imageUrl: string; // 상품 이미지 URL
  bidPrice: number; // 입찰 가격
  bidStatus?: string; // 입찰 상태 (옵션)
  orderStatus?: string; // 주문 상태 (옵션)
  shipmentStatus: string; // 배송 상태
  createdDate: Date; // 생성일
  modifiedDate?: Date; // 수정일 (옵션)
};

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
  createdDate: Date;
  modifiedDate: Date;
}

export interface SalesBoxProps {
  title: string; // 타이틀 이름 (판매 내역)
  tabs: Array<{
    title: string; // 탭 이름 (판매 입찰, 진행 중, 종료)
    count: number; // 해당 탭의 숫자
    isTotal?: boolean; // 전체인지 여부
    href: string; // 링크
  }>;
}
