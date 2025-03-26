import apiClient from "src/global/services/ApiClient";
import {
  AdminLoginData,
  AdminFindEmailData,
  AdminFindPasswordData,
  AdminLoginStatus,
} from "../types/AdminloginTypes";

// 로컬 스토리지 키
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
    const response = await apiClient.post<string>("/admin/auth/login", {
      email,
      password,
    });

    // 서버 응답이 성공이면 로그인 상태 저장
    if (response.data.includes("성공")) {
      saveAdminLoginStatus();
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
 * 관리자 로그인 상태를 로컬 스토리지에 저장
 * @param expiryMinutes 만료 시간(분), 기본값 30분
 */
export const saveAdminLoginStatus = (expiryMinutes: number = 30): void => {
  const now = Date.now();
  const expire = now + expiryMinutes * 60 * 1000; // x분 후 (ms)

  const loginStatus: AdminLoginStatus = {
    value: "true",
    expire,
  };

  localStorage.setItem(ADMIN_LOGIN_STATUS_KEY, JSON.stringify(loginStatus));
};

/**
 * 관리자 로그인 상태 확인
 * @returns 로그인 상태 여부 (true/false)
 */
export const checkAdminLoginStatus = (): boolean => {
  const loginDataStr = localStorage.getItem(ADMIN_LOGIN_STATUS_KEY);
  if (!loginDataStr) return false;

  try {
    // 기존 방식 (문자열로만 저장된 경우)
    if (loginDataStr === "true") {
      // 이전 방식으로 저장된 경우, 새 방식으로 업데이트
      saveAdminLoginStatus();
      return true;
    }

    // 새 방식 (객체로 저장된 경우)
    const loginData = JSON.parse(loginDataStr) as AdminLoginStatus;
    return loginData.expire > Date.now() && loginData.value === "true";
  } catch (e) {
    console.error("관리자 로그인 상태 확인 중 오류:", e);
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
    localStorage.removeItem(ADMIN_LOGIN_STATUS_KEY);
    return true;
  } catch (error) {
    console.error("관리자 로그아웃 중 오류:", error);
    // 오류가 발생해도 로컬 스토리지는 초기화
    localStorage.removeItem(ADMIN_LOGIN_STATUS_KEY);
    return false;
  }
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
