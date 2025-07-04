import axios, { AxiosError } from "axios";
import { ApiError, ApiErrorResponse } from "../types/errors";
import { ErrorHandler } from "./errorHandler";

// const apiClient = axios.create({
//   baseURL: "https://www.pinjun.xyz/api",
//   withCredentials: true,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });
const getBaseURL = () => {
  const { hostname } = window.location;
  
  // 로컬 개발 환경 (localhost 또는 내부 IP)
  if (hostname === 'localhost' || hostname.startsWith('192.168.') || hostname.startsWith('10.')) {
    return `https://${hostname}/api`;
  }
  
  // 프로덕션 환경
  return "https://www.pinjun.xyz/api";
};

const apiClient = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      const errorData = error.response.data as ApiErrorResponse;
      const apiError = new ApiError(errorData);

      // 중앙 에러 핸들러로 처리
      ErrorHandler.handleError(apiError);

      return Promise.reject(apiError);
    }

    // 네트워크 에러 등
    console.error("API Request Failed:", error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
