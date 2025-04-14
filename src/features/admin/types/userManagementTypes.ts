// Common types
export interface SortOption {
  field: string;
  order: "asc" | "desc";
}

export interface PageInfo {
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface PageResponse<T> {
  content: T[];
  pageable: any;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// User Types
export interface UserSearchDto {
  keyword?: string;
  email?: string;
  phoneNumber?: string;
  ageStart?: number;
  ageEnd?: number;
  gender?: string;
  registrationDateStart?: string;
  registrationDateEnd?: string;
  isVerified?: boolean;
  sellerGrade?: number;
  shoeSize?: string;
  role?: string;
  sortOption?: SortOption;
}

export interface UserSearchResponseDto {
  id: number;
  email: string;
  phoneNumber: string;
  age?: number;
  gender?: string;
  isVerified: boolean;
  isActive: boolean;
  role: string;
  sellerGrade?: number;
  profileName?: string;
  profileImageUrl?: string;
  totalPurchaseAmount?: number;
  totalPoints?: number;
  createdDate: string;
  updatedDate: string;
}

export interface UserDetailDto {
  id: number;
  email: string;
  phoneNumber: string;
  age?: number;
  gender?: string;
  shoeSize?: string;
  isVerified: boolean;
  isActive: boolean;
  ci?: string;
  di?: string;
  role: string;
  termsAgreement: boolean;
  phoneNotificationConsent: boolean;
  emailNotificationConsent: boolean;
  optionalPrivacyAgreement: boolean;
  sellerGrade?: number;
  profile?: ProfileDto;
  addresses?: AddressDto[];
  bankAccount?: BankAccountDto;
  sanctions?: SanctionBriefDto[];
  interests?: InterestBriefDto[];
  totalPoints: number;
  availablePoints: number;
  createdDate: string;
  updatedDate: string;
}

export interface ProfileDto {
  id: number;
  profileName: string;
  name?: string;
  bio?: string;
  isPublic: boolean;
  profileImageUrl?: string;
  followersCount: number;
  followingCount: number;
  stylesCount: number;
}

export interface AddressDto {
  id: number;
  name: string;
  recipientName: string;
  recipientPhone: string;
  zipCode: string;
  address1: string;
  address2: string;
  isDefault: boolean;
}

export interface BankAccountDto {
  id: number;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}

export interface SanctionBriefDto {
  id: number;
  reason: string;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
}

export interface InterestBriefDto {
  id: number;
  productId: number;
  productName: string;
  productImageUrl: string;
}

// User Grade Types
export interface UserGrade {
  id: number;
  level: number;
  name: string;
  description: string;
  minPurchaseAmount?: number;
  pointRate: number;
  benefits: string;
  userCount?: number;
  createdDate?: string;
  updatedDate?: string;
}

// Advanced User Management Types
export interface UserStatusUpdateDto {
  userId: number;
  status: boolean;
  reason?: string;
}

export interface UserGradeUpdateDto {
  userId: number;
  gradeId: number;
  reason?: string;
}

export interface UserRoleUpdateDto {
  userId: number;
  role: string;
  reason?: string;
}

export interface UserPointDto {
  userId: number;
  amount: number;
  reason: string;
  expirationDate?: string;
}
