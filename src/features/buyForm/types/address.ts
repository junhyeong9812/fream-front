export interface AddressResponseDto {
  id: number;
  recipientName: string;
  phoneNumber: string;
  zipCode: string;
  address: string;
  detailedAddress: string;
  isDefault: boolean;
}
