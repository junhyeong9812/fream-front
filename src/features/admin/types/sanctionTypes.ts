// 기본 공통 타입
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

// Sanction Status Types
export type SanctionStatus =
  | "ACTIVE"
  | "EXPIRED"
  | "PENDING"
  | "REJECTED"
  | "CANCELED";
export type SanctionStatusFilter = SanctionStatus | "ALL";

// Sanction Types
export type SanctionType =
  | "WARNING"
  | "TEMPORARY_BAN"
  | "PERMANENT_BAN"
  | "FEATURE_RESTRICTION";

// Sanction Search DTO
export interface SanctionSearchDto {
  userId?: number;
  email?: string;
  status?: SanctionStatus;
  type?: SanctionType;
  startDateStart?: string;
  startDateEnd?: string;
  endDateStart?: string;
  endDateEnd?: string;
  createdDateStart?: string;
  createdDateEnd?: string;
  sortOption?: SortOption;
}

// User Sanction Model
export interface UserSanction {
  id: number;
  userId: number;
  userEmail: string;
  userProfileName?: string;
  targetId?: number; // ID of related content if applicable
  targetType?: string; // Type of related content (e.g., "STYLE", "COMMENT")
  reason: string;
  details?: string;
  type: SanctionType;
  status: SanctionStatus;
  startDate: string;
  endDate?: string; // Optional for permanent bans
  approvedBy?: string; // Admin email who approved
  rejectedBy?: string; // Admin email who rejected
  rejectionReason?: string;
  createdBy: string; // Admin email who created
  createdDate: string;
  updatedDate: string;
}

// Sanction Create DTO
export interface SanctionCreateDto {
  userId: number;
  targetId?: number;
  targetType?: string;
  reason: string;
  details?: string;
  type: SanctionType;
  startDate?: string; // Optional, defaults to now
  endDate?: string; // Optional for permanent bans
}

// Sanction Update DTO
export interface SanctionUpdateDto {
  id: number;
  reason?: string;
  details?: string;
  type?: SanctionType;
  status?: SanctionStatus;
  startDate?: string;
  endDate?: string;
}

// Sanction Review DTO
export interface SanctionReviewDto {
  id: number;
  approved: boolean;
  rejectionReason?: string; // Required if approved is false
}

// Sanction Statistics
export interface SanctionStatistics {
  total: number;
  active: number;
  expired: number;
  pending: number;
}
