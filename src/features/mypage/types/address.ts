export interface AddressCreateDto {
  recipientName: string;
  phoneNumber: string;
  zipCode: string;
  address: string;
  detailedAddress: string;
  isDefault: boolean;
}

export interface AddressUpdateDto extends AddressCreateDto {
  addressId: number;
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

// Props types for components
export interface AddressCardProps {
  address: AddressResponseDto;
  onEdit: (address: AddressResponseDto) => void;
  onDelete: (addressId: number) => void;
}

export interface AddAddressModalProps {
  onClose: () => void;
  onSubmit: (data: AddressCreateDto | AddressUpdateDto) => void;
  initialData: AddressResponseDto | null;
}
