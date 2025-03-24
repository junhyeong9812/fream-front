export interface AddressCreateDto {
  recipientName: string;
  phoneNumber: string;
  zipCode: string;
  address: string;
  detailedAddress: string;
  isDefault?: boolean;
}

export interface AddressUpdateDto {
  addressId: number;
  recipientName: string;
  phoneNumber: string;
  zipCode: string;
  address: string;
  detailedAddress: string;
  isDefault?: boolean;
}

export interface AddressResponseDto {
  id: number;
  recipientName: string;
  phoneNumber: string;
  zipCode: string;
  address: string;
  detailedAddress: string;
  isDefault: boolean;
}

export interface AddressListResponseDto {
  addresses: AddressResponseDto[];
}
