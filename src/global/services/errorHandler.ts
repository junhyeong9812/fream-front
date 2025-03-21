import { ApiError, ErrorCodes } from "../types/errors";
import { refreshToken, logout } from "./authService";
import { toast } from "react-toastify";

// 에러 처리 서비스
export class ErrorHandler {
  // 에러 처리 메인 함수
  static handleError(error: ApiError): void {
    // 1. 에러 로깅
    console.error(
      `API Error: [${error.code}] ${error.message} (${error.status})`
    );

    // 2. 에러 코드별 처리
    this.handleByErrorCode(error);

    // 3. 상태 코드별 추가 처리
    this.handleByStatusCode(error);
  }

  // 에러 코드별 처리
  private static handleByErrorCode(error: ApiError): void {
    switch (error.code) {
      // 인증 관련 에러
      case ErrorCodes.EXPIRED_TOKEN:
      case ErrorCodes.EXPIRED_TOKEN_GLOBAL:
        this.handleTokenExpiration();
        break;

      case ErrorCodes.INVALID_TOKEN:
      case ErrorCodes.INVALID_TOKEN_GLOBAL:
      case ErrorCodes.TOKEN_NOT_FOUND:
        this.handleInvalidToken();
        break;

      case ErrorCodes.INVALID_REFRESH_TOKEN:
        this.handleInvalidRefreshToken();
        break;

      // 권한 관련 에러
      case ErrorCodes.ACCESS_DENIED:
        toast.error("접근 권한이 없습니다.");
        break;

      // 파일 관련 에러
      case ErrorCodes.UNSUPPORTED_FILE_TYPE:
        toast.error("지원하지 않는 파일 형식입니다.");
        break;

      case ErrorCodes.FILE_UPLOAD_ERROR:
        toast.error("파일 업로드 중 오류가 발생했습니다.");
        break;
        
      // 날씨 관련 에러
      case ErrorCodes.WEATHER_DATA_NOT_FOUND:
        toast.info("요청한 시간대의 날씨 데이터를 찾을 수 없습니다.");
        break;
        
      case ErrorCodes.WEATHER_API_ERROR:
      case ErrorCodes.WEATHER_API_PARSING_ERROR:
        toast.error("날씨 정보를 가져오는 중 오류가 발생했습니다.");
        break;
        
      case ErrorCodes.WEATHER_DATA_SAVE_ERROR:
      case ErrorCodes.WEATHER_DATA_QUERY_ERROR:
        toast.error("날씨 데이터 처리 중 오류가 발생했습니다.");
        break;
        
      case ErrorCodes.WEATHER_INVALID_DATETIME_FORMAT:
      case ErrorCodes.WEATHER_INVALID_TIME_RANGE:
        toast.warning("잘못된 날짜/시간 형식입니다.");
        break;

      // 기타 에러는 기본 메시지 표시
      default:
        toast.error(error.message);
        break;
    }
  }

  // HTTP 상태 코드별 추가 처리
  private static handleByStatusCode(error: ApiError): void {
    switch (error.status) {
      case 404:
        // 리소스를 찾을 수 없는 경우 추가 처리
        break;

      case 500:
        // 서버 에러 추가 처리
        break;
    }
  }

  // 토큰 만료 처리
  private static handleTokenExpiration(): void {
    // 토큰 리프레시 시도
    refreshToken()
      .then(() => {
        toast.info("세션이 갱신되었습니다.");
        // 현재 페이지 리로드 또는 이전 요청 재시도
        window.location.reload();
      })
      .catch(() => {
        toast.error("세션이 만료되었습니다. 다시 로그인해주세요.");
        // 로그아웃 처리 및 로그인 페이지로 리다이렉트
        logout();
        window.location.href = "/login";
      });
  }

  // 유효하지 않은 토큰 처리
  private static handleInvalidToken(): void {
    toast.error("인증 정보가 유효하지 않습니다. 다시 로그인해주세요.");
    logout();
    window.location.href = "/login";
  }

  // 유효하지 않은 리프레시 토큰 처리
  private static handleInvalidRefreshToken(): void {
    toast.error("세션이 만료되었습니다. 다시 로그인해주세요.");
    logout();
    window.location.href = "/login";
  }
}