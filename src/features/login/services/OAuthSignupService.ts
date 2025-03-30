import apiClient from "src/global/services/ApiClient";
import {
  OAuthCompleteSignupData,
  OAuthCompleteSignupResponse,
} from "../types/OAuthSignupTypes";
import { saveLoginStatus } from "./loginService";

/**
 * OAuth 회원가입 완료 요청 함수
 * @param data 회원가입 완료 데이터
 * @returns 성공 여부와 메시지
 */
export const completeOAuthSignup = async (
  data: OAuthCompleteSignupData
): Promise<OAuthCompleteSignupResponse> => {
  try {
    // 데이터 복사본 생성
    const processedData = { ...data };
    
    // 신발 사이즈 형식 변환 (예: "240" -> "SIZE_240")
    if (processedData.shoeSize) {
      processedData.shoeSize = `SIZE_${processedData.shoeSize}`;
    }
    
    const response = await apiClient.post<OAuthCompleteSignupResponse>(
      "/oauth/complete-signup",
      processedData
    );

    // 회원가입 성공 시 자동 로그인 상태 설정
    if (response.data.success) {
      saveLoginStatus(); // 로그인 상태 저장 (기존 함수 재사용)
    }

    return response.data;
  } catch (error) {
    console.error("OAuth 회원가입 완료 중 오류:", error);

    // 에러 상세 정보 출력
    if (error.response) {
      console.error("Error response:", error.response.data);
      console.error("Status code:", error.response.status);
    }

    return {
      success: false,
      message: "회원가입 처리 중 오류가 발생했습니다.",
    };
  }
};
// export const completeOAuthSignup = async (
//   data: OAuthCompleteSignupData
// ): Promise<OAuthCompleteSignupResponse> => {
//   try {
//     const response = await apiClient.post<OAuthCompleteSignupResponse>(
//       "/oauth/complete-signup",
//       data
//     );

//     // 회원가입 성공 시 자동 로그인 상태 설정
//     if (response.data.success) {
//       saveLoginStatus(); // 로그인 상태 저장 (기존 함수 재사용)
//     }

//     return response.data;
//   } catch (error) {
//     console.error("OAuth 회원가입 완료 중 오류:", error);

//     // 에러 상세 정보 출력
//     if (error.response) {
//       console.error("Error response:", error.response.data);
//       console.error("Status code:", error.response.status);
//     }

//     return {
//       success: false,
//       message: "회원가입 처리 중 오류가 발생했습니다.",
//     };
//   }
// };


/**
 * 임시 토큰 URL 파라미터에서 추출
 * @returns 추출된 토큰 또는 null
 */
export const extractTokenFromUrl = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("token");
};
