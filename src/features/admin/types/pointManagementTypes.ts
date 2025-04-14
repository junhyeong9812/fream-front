// 포인트 상태 타입
export enum PointStatus {
  AVAILABLE = "AVAILABLE",
  USED = "USED",
  EXPIRED = "EXPIRED",
}

// 포인트 상세 조회 응답 타입
export interface PointResponseDto {
  id: number;
  amount: number;
  remainingAmount: number;
  reason: string;
  expirationDate?: string;
  status: PointStatus;
  createdDate: string;
}

// 포인트 요약 정보 응답 타입
export interface PointSummaryResponseDto {
  totalAvailablePoints: number;
  pointDetails: PointResponseDto[];
  expiringPoints: PointResponseDto[]; // 만료 예정 포인트 (30일 이내)
}

// 포인트 사용 응답 타입
export interface UsePointResponseDto {
  usedPoints: number;
  remainingTotalPoints: number;
  message: string;
}

// 어드민 포인트 요청 타입
export interface AdminPointRequestDto {
  amount: number;
  reason: string;
  expirationDate?: string;
}

// 포인트 통계 응답 타입
export interface PointStatisticsResponseDto {
  totalIssuedPoints: number;
  totalUsedPoints: number;
  totalExpiredPoints: number;
  period: string;
}
