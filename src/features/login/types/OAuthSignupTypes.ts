// 성별 타입
export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

// 신발 사이즈 타입
export enum ShoeSize {
  SIZE_220 = "SIZE_220",
  SIZE_225 = "SIZE_225",
  SIZE_230 = "SIZE_230",
  SIZE_235 = "SIZE_235",
  SIZE_240 = "SIZE_240",
  SIZE_245 = "SIZE_245",
  SIZE_250 = "SIZE_250",
  SIZE_255 = "SIZE_255",
  SIZE_260 = "SIZE_260",
  SIZE_265 = "SIZE_265",
  SIZE_270 = "SIZE_270",
  SIZE_275 = "SIZE_275",
  SIZE_280 = "SIZE_280",
  SIZE_285 = "SIZE_285",
  SIZE_290 = "SIZE_290",
  SIZE_295 = "SIZE_295",
  SIZE_300 = "SIZE_300",
  SIZE_305 = "SIZE_305",
  SIZE_310 = "SIZE_310",
}

// OAuth 회원가입 완료 요청 데이터 타입
export interface OAuthCompleteSignupData {
  token: string; // 임시 토큰
  phoneNumber: string; // 전화번호
  age: number; // 나이
  gender: Gender; // 성별
  shoeSize: string; // 신발 사이즈

  termsAgreement: boolean; // 이용약관 동의
  privacyAgreement: boolean; // 개인정보 수집 동의
  optionalPrivacyAgreement: boolean; // 선택적 개인정보 동의
  adConsent: boolean; // 광고성 정보 수신 동의

  referralCode: string; // 추천인 코드 (선택)
}

// 서버 응답 타입
export interface OAuthCompleteSignupResponse {
  success: boolean;
  message: string;
}
