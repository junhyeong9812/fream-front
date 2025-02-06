import apiClient from "src/global/services/ApiClient";

export const logoutService = async () => {
  // /auth/logout 엔드포인트 호출 → 쿠키 만료
  const response = await apiClient.post("/auth/logout");
  return response.data; // "로그아웃 성공" 등
};
