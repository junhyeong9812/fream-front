import apiClient from "src/global/services/ApiClient";

// 백엔드 응답 타입 정의
interface BackendLoginInfoResponse {
  email: string;
  phoneNumber: string;
  shoeSize: string;
  optionalPrivacyAgreement: boolean;
  smsConsent: boolean;
  emailConsent: boolean;
}

// 프론트엔드에서 사용할 타입 정의
export interface LoginInfoResponse {
  email: string;
  phoneNumber: string;
  shoeSize: string;
  optionalPrivacyAgreement: boolean;
  smsConsent: boolean;
  emailConsent: boolean;
}

export interface LoginInfoUpdateDto {
  newEmail?: string;
  password?: string;
  newPassword?: string;
  newPhoneNumber?: string;
  newShoeSize?: string;
  adConsent?: boolean;
  privacyConsent?: boolean;
  smsConsent?: boolean;
  emailConsent?: boolean;
}

// 백엔드 응답을 프론트엔드 타입으로 매핑하는 함수
const mapLoginInfo = (
  backendResponse: BackendLoginInfoResponse
): LoginInfoResponse => {
  return {
    email: backendResponse.email,
    phoneNumber: backendResponse.phoneNumber,
    shoeSize: backendResponse.shoeSize,
    optionalPrivacyAgreement: backendResponse.optionalPrivacyAgreement,
    smsConsent: backendResponse.smsConsent,
    emailConsent: backendResponse.emailConsent,
  };
};

// 로그인 정보 조회
export const getLoginInfo = async (): Promise<LoginInfoResponse> => {
  try {
    const response = await apiClient.get<BackendLoginInfoResponse>(
      "/users/login-info"
    );
    return mapLoginInfo(response.data);
  } catch (error) {
    console.error("로그인 정보 조회 실패:", error);
    throw error;
  }
};

// 로그인 정보 업데이트1
export const updateLoginInfo = async (
  data: LoginInfoUpdateDto
): Promise<LoginInfoResponse> => {
  try {
    const response = await apiClient.put<{
      userInfo: BackendLoginInfoResponse;
    }>("/users/update", data);
    return mapLoginInfo(response.data.userInfo);
  } catch (error) {
    console.error("로그인 정보 수정 실패:", error);
    throw error;
  }
};
