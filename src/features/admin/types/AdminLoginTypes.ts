// 관리자 로그인 요청 데이터 타입
export interface AdminLoginData {
  email: string;
  password: string;
}

// 관리자 로그인 상태 정보 타입
export interface AdminLoginStatus {
  value: string;
  expire: number;
}

// 관리자 토큰 정보 타입
export interface AdminTokenInfo {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiry: number; // 초 단위
  refreshTokenExpiry: number; // 초 단위
}

// 관리자 토큰 응답 타입
export interface AdminTokenResponse {
  message: string;
  accessToken: string;
  refreshToken?: string;
  accessTokenExpiry: number;
  refreshTokenExpiry?: number;
}

// 관리자 로그인 응답 타입
export interface AdminLoginResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiry: number;
  refreshTokenExpiry: number;
}

// 관리자 이메일 찾기 요청 타입
export interface AdminFindEmailRequest {
  phoneNumber: string;
}

// 관리자 비밀번호 찾기 요청 타입
export interface AdminFindPasswordRequest {
  email: string;
  phoneNumber: string;
}
