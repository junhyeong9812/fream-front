import apiClient from "src/global/services/ApiClient";

// PortOne 모듈 타입 정의
declare global {
  interface Window {
    PortOne: {
      requestIdentityVerification: (config: {
        identityVerificationId?: string;
        channelKey: string;
        storeId: string;
        customer?: {
          fullName?: string;
          phoneNumber?: string;
          birthday?: string;
          isForeigner?: boolean;
        };
        bypass?: {
          inicisUnified?: {
            flgFixedUser: "Y" | "N";
            directAgency?: string;
            logoUrl?: string;
          };
        };
        redirectUrl?: string;
      }) => Promise<{
        identityVerificationId?: string;
        code?: string;
        message?: string;
      }>;
    };
  }
}

/**
 * PortOne 본인인증 요청 함수
 */
export const requestIdentityVerification = async () => {
  try {
    // KG이니시스 본인인증 요청
    const response = await window.PortOne.requestIdentityVerification({
      channelKey: process.env.REACT_APP_INICIS_CHANNEL_KEY || "imp_channel_key", // 환경변수에서 채널 키 가져오기
      identityVerificationId: `identity-verification-${crypto.randomUUID()}`,
      storeId: process.env.REACT_APP_IMP_STOREID || "your_store_id",
      bypass: {
        inicisUnified: {
          flgFixedUser: "N", // 사용자 직접 입력 모드
          directAgency: "PASS", // PASS 앱 인증 사용 (다른 옵션 가능)
        },
      },
    });

    // 본인인증 요청 실패한 경우
    if (response.code !== undefined) {
      console.error("Identity verification failed:", response.message);
      return { success: false, message: response.message };
    }

    // 성공 시 인증 ID 반환
    return {
      success: true,
      identityVerificationId: response.identityVerificationId,
    };
  } catch (error) {
    console.error("Error during identity verification:", error);
    return {
      success: false,
      message: "본인인증 중 오류가 발생했습니다.",
    };
  }
};

/**
 * 본인인증 ID로 회원가입 요청 함수
 */
export const fetchJoinData = async (
  email: string,
  password: string,
  shoeSize: string,
  code: string,
  isOver14: boolean,
  termsAgreement: boolean,
  privacyAgreement: boolean,
  optionalPrivacyAgreement: boolean,
  adConsent: boolean
) => {
  console.log("회원가입 프로세스 시작...");

  try {
    // 1. 본인인증 요청
    const verificationResult = await requestIdentityVerification();

    if (!verificationResult.success) {
      return {
        success: false,
        message: "본인인증에 실패했습니다: " + verificationResult.message,
      };
    }

    console.log(
      "본인인증 성공, ID:",
      verificationResult.identityVerificationId
    );

    // 2. 본인인증 정보와 함께 회원가입 요청
    const response = await apiClient.post("/users/register", {
      email: email,
      password: password,
      identityVerificationId: verificationResult.identityVerificationId,
      referralCode: code, // 추천인 코드
      shoeSize: "SIZE_" + shoeSize,
      isOver14: isOver14,
      termsAgreement: termsAgreement,
      privacyAgreement: privacyAgreement,
      optionalPrivacyAgreement: optionalPrivacyAgreement,
      adConsent: adConsent,
    });

    console.log("회원가입 응답:", response.data);

    if (response.data.success) {
      return {
        success: true,
        message: "회원가입이 완료되었습니다.",
        data: response.data,
      };
    } else {
      return {
        success: false,
        message: response.data.message || "회원가입에 실패했습니다.",
      };
    }
  } catch (error: any) {
    console.error("회원가입 처리 중 오류 발생:", error);

    // 에러 응답 형태 처리
    const errorMessage =
      error.response?.data?.message || "회원가입 처리 중 오류가 발생했습니다.";
    return {
      success: false,
      message: errorMessage,
    };
  }
};
