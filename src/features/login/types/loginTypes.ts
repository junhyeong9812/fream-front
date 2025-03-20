// 로그인 요청 데이터 타입
export interface LoginData {
  email: string;
  password: string;
}

// 로그인 응답 타입
export interface LoginResponse {
  success: boolean;
  message: string;
  // 기타 서버에서 반환하는 정보가 있다면 추가
}

// 로컬 스토리지에 저장할 로그인 상태 타입
export interface LoginStatus {
  value: string;
  expire: number;
}