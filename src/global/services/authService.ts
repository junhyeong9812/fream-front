import apiClient from "./ApiClient";

// 로그인 상태 저장 키
const LOGIN_STATUS_KEY = "IsLoggedIn";

/**
 * 토큰 리프레시 함수
 * 만료된 액세스 토큰을 리프레시 토큰을 이용해 갱신
 */
export async function refreshToken(): Promise<void> {
  try {
    // 백엔드 URI: /auth/refresh
    await apiClient.post("/auth/refresh");
    // 리프레시 성공 시 로그인 상태 유효 기간 갱신
    updateLoginExpirationTime();
    return Promise.resolve();
  } catch (error) {
    console.error("Token refresh failed:", error);
    // 리프레시 실패 시 로그인 상태 제거
    removeLoginStatus();
    return Promise.reject(error);
  }
}

/**
 * 로그아웃 함수
 * 서버에서 토큰을 무효화하고 쿠키 삭제
 */
export async function logout(): Promise<void> {
  try {
    // 백엔드 URI: /auth/logout
    await apiClient.post("/auth/logout");
    // 로컬 스토리지에서 로그인 상태 제거
    removeLoginStatus();
    return Promise.resolve();
  } catch (error) {
    console.error("Logout failed:", error);
    // 로그아웃 실패해도 로컬에서는 세션 정리
    removeLoginStatus();
    return Promise.resolve();
  }
}

/**
 * 사용자 이메일 조회 함수
 * 현재 로그인된 사용자의 이메일을 가져옴
 */
export async function getUserEmail(): Promise<string> {
  try {
    // 백엔드 URI: /auth/email
    const response = await apiClient.get<string>("/auth/email");
    return response.data;
  } catch (error) {
    console.error("Failed to get user email:", error);
    return Promise.reject(error);
  }
}

/**
 * 로그인 상태인지 확인
 * @returns 로그인 상태이면 true, 아니면 false
 */
export function isLoggedIn(): boolean {
  const loginStatusStr = localStorage.getItem(LOGIN_STATUS_KEY);
  if (!loginStatusStr) return false;

  try {
    const loginStatus = JSON.parse(loginStatusStr);
    // 만료 시간 체크
    if (loginStatus.expire && loginStatus.expire > Date.now()) {
      return loginStatus.value === "true";
    } else {
      // 만료되었으면 로그인 상태 제거
      removeLoginStatus();
      return false;
    }
  } catch (error) {
    console.error("Failed to parse login status:", error);
    return false;
  }
}

/**
 * 로그인 상태 설정 (다른 서비스에서 호출할 수 있도록 export)
 */
export function setLoginStatus(): void {
  const now = Date.now();
  const expire = now + 30 * 60 * 1000; // 30분 후 (ms)

  const loginData = {
    value: "true",
    expire,
  };

  localStorage.setItem(LOGIN_STATUS_KEY, JSON.stringify(loginData));
}

/**
 * 로그인 상태 유효 기간 갱신
 */
function updateLoginExpirationTime(): void {
  const loginStatusStr = localStorage.getItem(LOGIN_STATUS_KEY);
  if (!loginStatusStr) return;

  try {
    const loginStatus = JSON.parse(loginStatusStr);
    const now = Date.now();
    const expire = now + 30 * 60 * 1000; // 30분 후 (ms)

    loginStatus.expire = expire;
    localStorage.setItem(LOGIN_STATUS_KEY, JSON.stringify(loginStatus));
  } catch (error) {
    console.error("Failed to update login expiration:", error);
  }
}

/**
 * 로그인 상태 제거
 */
export function removeLoginStatus(): void {
  localStorage.removeItem(LOGIN_STATUS_KEY);
}
