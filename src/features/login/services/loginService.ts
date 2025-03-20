import apiClient from "src/global/services/ApiClient";
import { LoginData, LoginResponse, LoginStatus } from "../types/loginTypes";

// 로컬 스토리지 키
const LOGIN_STATUS_KEY = "IsLoggedIn";

/**
 * 로그인 요청 함수
 * @param email 사용자 이메일
 * @param password 사용자 비밀번호
 * @returns 로그인 성공 시 "yes", 실패 시 "no"
 */
export const fetchLoginData = async (
  email: string,
  password: string
): Promise<string> => {
  console.log("Fetching Login Data...");

  try {
    const response = await apiClient.post<string>("/auth/login", {
      email,
      password,
    });

    console.log(response.data);

    // 서버 응답이 성공이면 로그인 상태 저장
    if (
      response.data === "로그인 성공 (JWT 쿠키 발급)" ||
      response.data.includes("성공")
    ) {
      saveLoginStatus();
      return "yes";
    }

    return "no";
  } catch (error) {
    console.error("Error fetching login data with Axios:", error);

    // 에러 상세 정보 출력 (디버깅 목적)
    if (error.response) {
      console.error("Error response:", error.response.data);
      console.error("Status code:", error.response.status);
    }

    return "no";
  }
};

/**
 * 로그인 상태를 로컬 스토리지에 저장
 * @param expiryMinutes 만료 시간(분), 기본값 30분
 */
export const saveLoginStatus = (expiryMinutes: number = 30): void => {
  const now = Date.now();
  const expire = now + expiryMinutes * 60 * 1000; // x분 후 (ms)

  const loginStatus: LoginStatus = {
    value: "true",
    expire,
  };

  localStorage.setItem(LOGIN_STATUS_KEY, JSON.stringify(loginStatus));
};

/**
 * 로그인 상태 확인
 * @returns 로그인 상태 여부 (true/false)
 */
export const checkLoginStatus = (): boolean => {
  const loginDataStr = localStorage.getItem(LOGIN_STATUS_KEY);
  if (!loginDataStr) return false;

  try {
    const loginData = JSON.parse(loginDataStr) as LoginStatus;
    return loginData.expire > Date.now() && loginData.value === "true";
  } catch (e) {
    console.error("로그인 상태 확인 중 오류:", e);
    return false;
  }
};

/**
 * 로그아웃 함수
 * 로컬 스토리지에서 로그인 정보 제거
 */
export const logout = (): void => {
  localStorage.removeItem(LOGIN_STATUS_KEY);
};
