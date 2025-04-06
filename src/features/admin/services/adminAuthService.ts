import apiClient from "src/global/services/ApiClient";
import {
  AdminLoginStatus,
  AdminLoginResponse,
  AdminTokenResponse,
} from "src/features/admin/types/AdminLoginTypes";

// 로컬 스토리지 키 상수
const ADMIN_AUTH_TOKEN_KEY = "adminAuthToken";
const ADMIN_TOKEN_EXPIRY_KEY = "adminTokenExpiry";
const ADMIN_REFRESH_TOKEN_KEY = "adminRefreshToken";
const ADMIN_LOGIN_STATUS_KEY = "isAdminLoggedIn";

/**
 * 관리자 로그인 요청 함수
 * @param email 관리자 이메일
 * @param password 관리자 비밀번호
 * @returns 로그인 성공 시 "yes", 실패 시 "no" 또는 오류 메시지
 */
export const fetchAdminLoginData = async (
  email: string,
  password: string
): Promise<string> => {
  try {
    const response = await apiClient.post<AdminLoginResponse>(
      "/admin/auth/login",
      {
        email,
        password,
      }
    );

    // 서버 응답이 성공이면 토큰 정보 저장
    if (response.data && response.data.accessToken) {
      // 토큰 및 만료 시간 저장
      saveAdminTokenInfo(
        response.data.accessToken,
        response.data.refreshToken,
        response.data.accessTokenExpiry,
        response.data.refreshTokenExpiry
      );
      return "yes";
    }

    return "no";
  } catch (error) {
    console.error("관리자 로그인 중 오류:", error);

    // 에러 상세 정보 확인
    if (error.response) {
      // 관리자 권한 없음
      if (error.response.status === 403) {
        return "not_admin";
      }
      // 로그인 정보 불일치
      else if (error.response.status === 401) {
        return "invalid_credentials";
      }
    }

    return "no";
  }
};

/**
 * 관리자 토큰 정보 저장
 * @param accessToken 액세스 토큰
 * @param refreshToken 리프레시 토큰
 * @param accessTokenExpiry 액세스 토큰 만료 시간(초)
 * @param refreshTokenExpiry 리프레시 토큰 만료 시간(초)
 */
export const saveAdminTokenInfo = (
  accessToken: string,
  refreshToken: string,
  accessTokenExpiry: number,
  refreshTokenExpiry: number
): void => {
  const now = Date.now();

  // 액세스 토큰 저장
  localStorage.setItem(ADMIN_AUTH_TOKEN_KEY, accessToken);
  // 액세스 토큰 만료 시간 저장 (현재 시간 + 만료 시간)
  localStorage.setItem(
    ADMIN_TOKEN_EXPIRY_KEY,
    (now + accessTokenExpiry * 1000).toString()
  );
  // 리프레시 토큰 저장
  localStorage.setItem(ADMIN_REFRESH_TOKEN_KEY, refreshToken);

  // 로그인 상태 저장
  const loginStatus: AdminLoginStatus = {
    value: "true",
    expire: now + refreshTokenExpiry * 1000, // 리프레시 토큰 만료 시간까지 로그인 상태 유지
  };
  localStorage.setItem(ADMIN_LOGIN_STATUS_KEY, JSON.stringify(loginStatus));
};

/**
 * 관리자 로그인 상태 확인
 * @returns 로그인 상태 여부 (true/false) 또는 Promise<boolean>
 */
export const checkAdminLoginStatus = async (): Promise<boolean> => {
  // 1. 로그인 상태 확인
  const loginDataStr = localStorage.getItem(ADMIN_LOGIN_STATUS_KEY);
  if (!loginDataStr) return false;

  try {
    // 이전 방식 (문자열로만 저장된 경우) 처리
    if (loginDataStr === "true") {
      // 이전 방식으로 저장된 경우, 새 방식으로 업데이트
      const accessTokenExpiry = localStorage.getItem(ADMIN_TOKEN_EXPIRY_KEY);
      if (accessTokenExpiry) {
        const loginStatus: AdminLoginStatus = {
          value: "true",
          expire: parseInt(accessTokenExpiry, 10),
        };
        localStorage.setItem(
          ADMIN_LOGIN_STATUS_KEY,
          JSON.stringify(loginStatus)
        );
        return parseInt(accessTokenExpiry, 10) > Date.now();
      }
      return false;
    }

    // 새 방식 (객체로 저장된 경우)
    const loginData = JSON.parse(loginDataStr) as AdminLoginStatus;

    // 만료 시간이 지났는지 확인
    if (loginData.expire <= Date.now() || loginData.value !== "true") {
      // 만료된 경우, 액세스 토큰 만료 시간 확인
      const tokenExpiry = localStorage.getItem(ADMIN_TOKEN_EXPIRY_KEY);

      // 액세스 토큰이 유효하면 그대로 유지
      if (tokenExpiry && parseInt(tokenExpiry, 10) > Date.now()) {
        return true;
      }

      // 액세스 토큰도 만료되었으면 리프레시 시도
      try {
        return await refreshAdminToken();
      } catch (error) {
        console.error("토큰 갱신 중 오류:", error);
        return false;
      }
    }

    return true;
  } catch (e) {
    console.error("관리자 로그인 상태 확인 중 오류:", e);
    return false;
  }
};

/**
 * 관리자 토큰 유효성 확인
 * @returns 토큰 유효 여부
 */
export const isAdminTokenValid = (): boolean => {
  const tokenExpiry = localStorage.getItem(ADMIN_TOKEN_EXPIRY_KEY);
  if (!tokenExpiry) return false;

  // 만료 시간 확인
  return parseInt(tokenExpiry, 10) > Date.now();
};

/**
 * 관리자 토큰 갱신
 * @returns 성공 여부를 포함한 Promise
 */
export const refreshAdminToken = async (): Promise<boolean> => {
  try {
    const response = await apiClient.post<AdminTokenResponse>(
      "/admin/auth/refresh"
    );

    if (response.data && response.data.accessToken) {
      // 새로운 액세스 토큰 저장
      localStorage.setItem(ADMIN_AUTH_TOKEN_KEY, response.data.accessToken);

      // 만료 시간 업데이트
      const now = Date.now();
      const newExpiry = now + response.data.accessTokenExpiry * 1000;
      localStorage.setItem(ADMIN_TOKEN_EXPIRY_KEY, newExpiry.toString());

      // 로그인 상태 업데이트 (리프레시 토큰 만료 시간으로 설정)
      const loginDataStr = localStorage.getItem(ADMIN_LOGIN_STATUS_KEY);
      if (loginDataStr && loginDataStr !== "true") {
        try {
          const loginData = JSON.parse(loginDataStr) as AdminLoginStatus;
          loginData.value = "true";
          localStorage.setItem(
            ADMIN_LOGIN_STATUS_KEY,
            JSON.stringify(loginData)
          );
        } catch (e) {
          console.error("로그인 상태 업데이트 중 오류:", e);
        }
      }

      return true;
    }

    return false;
  } catch (error) {
    console.error("관리자 토큰 갱신 중 오류:", error);

    // 갱신 실패 시 로그아웃 처리 (선택적)
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      adminLogout();
    }

    return false;
  }
};

/**
 * 관리자 로그아웃 함수
 * 서버에 로그아웃 요청 및 로컬 스토리지에서 로그인 정보 제거
 */
export const adminLogout = async (): Promise<boolean> => {
  try {
    await apiClient.post("/admin/auth/logout");
    clearAdminTokens();
    return true;
  } catch (error) {
    console.error("관리자 로그아웃 중 오류:", error);
    // 오류가 발생해도 로컬 스토리지는 초기화
    clearAdminTokens();
    return false;
  }
};

/**
 * 관리자 토큰 및 로그인 상태 제거
 */
export const clearAdminTokens = (): void => {
  localStorage.removeItem(ADMIN_AUTH_TOKEN_KEY);
  localStorage.removeItem(ADMIN_TOKEN_EXPIRY_KEY);
  localStorage.removeItem(ADMIN_REFRESH_TOKEN_KEY);
  localStorage.removeItem(ADMIN_LOGIN_STATUS_KEY);
};

/**
 * 관리자 이메일 찾기
 * @param phone 휴대폰 번호
 * @returns 성공 시 이메일, 실패 시 "no" 또는 오류 메시지
 */
export const fetchAdminFindEmailData = async (
  phone: string
): Promise<string> => {
  try {
    const response = await apiClient.post<string>("/admin/auth/find-email", {
      phoneNumber: formatPhoneNumber(phone),
    });

    if (response.status === 200) {
      return response.data; // 이메일 주소 반환
    }

    return "no";
  } catch (error) {
    console.error("관리자 이메일 찾기 중 오류:", error);

    // 에러 응답에 따른 처리
    if (error.response && error.response.status === 403) {
      return "not_admin"; // 관리자 계정이 아님
    }

    return "no";
  }
};

/**
 * 관리자 비밀번호 찾기
 * @param phone 휴대폰 번호
 * @param email 이메일
 * @returns 성공 시 "yes", 실패 시 "no" 또는 오류 메시지
 */
export const fetchAdminFindPasswordData = async (
  phone: string,
  email: string
): Promise<string> => {
  try {
    const response = await apiClient.post("/admin/auth/find-password", {
      phoneNumber: formatPhoneNumber(phone),
      email,
    });

    if (response.status === 200) {
      return "yes";
    }

    return "no";
  } catch (error) {
    console.error("관리자 비밀번호 찾기 중 오류:", error);

    // 에러 응답에 따른 처리
    if (error.response) {
      if (error.response.status === 403) {
        return "not_admin"; // 관리자 계정이 아님
      } else if (error.response.status === 400) {
        return "invalid_phone"; // 전화번호 불일치
      }
    }

    return "no";
  }
};

/**
 * API 요청에 사용할 인증 헤더 가져오기
 * @returns 인증 헤더 객체 또는 빈 객체
 */
export const getAuthHeaders = (): { Authorization?: string } => {
  const token = localStorage.getItem(ADMIN_AUTH_TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * 전화번호 포맷 변경 함수
 * @param number 전화번호 (숫자만)
 * @returns 포맷된 전화번호 (예: 010-1234-5678)
 */
const formatPhoneNumber = (number: string) => {
  if (number.length === 11) {
    // "01012345678" -> "010-1234-5678"
    return number.replace(/^(\d{3})(\d{4})(\d{4})$/, "$1-$2-$3");
  } else if (number.length === 10) {
    // "0101234567" -> "010-123-4567"
    return number.replace(/^(\d{3})(\d{3})(\d{4})$/, "$1-$2-$3");
  }
  return number;
};
