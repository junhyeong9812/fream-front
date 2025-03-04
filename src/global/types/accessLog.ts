/**
 * UserAccessLog를 전송할 때 사용하는 DTO 타입
 */
export interface UserAccessLogDto {
  refererUrl?: string; // 참조 URL
  userAgent?: string; // 브라우저 및 OS 정보
  os?: string; // 운영체제 정보
  browser?: string; // 브라우저 정보
  deviceType?: string; // 디바이스 타입

  ipAddress?: string; // 사용자 IP 주소
  country?: string; // 위치 정보 - 나라
  region?: string; // 위치 정보 - 지역
  city?: string; // 위치 정보 - 도시

  pageUrl?: string; // 방문한 페이지 URL
  email?: string; // 사용자 이메일
  isAnonymous?: boolean; // 익명 사용자 여부

  networkType?: string; // 네트워크 타입
  browserLanguage?: string; // 브라우저 언어
  screenWidth?: number; // 전체 화면 너비
  screenHeight?: number; // 전체 화면 높이
  devicePixelRatio?: number; // 픽셀 밀도
}
// 날짜별 카운트
export interface DailyAccessCountDto {
  dateString: string; // "2025-01-26"
  count: number;
}
