// 로그인 요청 데이터 타입
export interface AdminLoginData {
  email: string;
  password: string;
}

export interface AdminFindEmailData {
  phone: string;
}

export interface AdminFindPasswordData {
  phone: string;
  email: string;
}

// 로그인 응답 타입
export interface AdminLoginResponse {
  success: boolean;
  message: string;
  // 기타 서버에서 반환하는 정보가 있다면 추가
}

// 로컬 스토리지에 저장할 로그인 상태 타입
export interface AdminLoginStatus {
  value: string;
  expire: number;
}
