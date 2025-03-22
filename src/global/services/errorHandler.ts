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

      // 접근 로그 관련 에러
      case ErrorCodes.ACCESS_LOG_SAVE_ERROR:
      case ErrorCodes.KAFKA_SEND_ERROR:
      case ErrorCodes.KAFKA_RECEIVE_ERROR:
        toast.error("접근 정보를 기록하는 중 오류가 발생했습니다.");
        break;

      case ErrorCodes.ACCESS_LOG_QUERY_ERROR:
      case ErrorCodes.STATISTICS_QUERY_ERROR:
        toast.error("접근 통계를 조회하는 중 오류가 발생했습니다.");
        break;

      case ErrorCodes.GEO_IP_LOOKUP_ERROR:
      case ErrorCodes.GEO_IP_DATABASE_ERROR:
        // 위치 정보 에러는 사용자에게 표시하지 않고 로깅만 처리
        console.error(`위치정보 처리 오류: ${error.message}`);
        break;

      case ErrorCodes.INVALID_ACCESS_LOG_DATA:
      case ErrorCodes.INVALID_IP_ADDRESS:
      case ErrorCodes.INVALID_DATE_RANGE:
        toast.warning("잘못된 접근 정보가 제공되었습니다.");
        break;

      // 채팅 질문 관련 에러
      case ErrorCodes.GPT_API_ERROR:
      case ErrorCodes.GPT_RESPONSE_PROCESSING_ERROR:
        toast.error(
          "AI 서비스 연결에 문제가 발생했습니다. 잠시 후 다시 시도해주세요."
        );
        break;

      case ErrorCodes.GPT_USAGE_LOG_ERROR:
      case ErrorCodes.USAGE_STATS_QUERY_ERROR:
        toast.error("사용량 기록 중 오류가 발생했습니다.");
        break;

      case ErrorCodes.CHAT_QUESTION_SAVE_ERROR:
      case ErrorCodes.CHAT_HISTORY_QUERY_ERROR:
        toast.error("채팅 데이터 처리 중 오류가 발생했습니다.");
        break;

      case ErrorCodes.ADMIN_PERMISSION_REQUIRED:
        toast.warning("관리자 권한이 필요한 기능입니다.");
        break;

      case ErrorCodes.QUESTION_PERMISSION_DENIED:
        toast.warning("질문 및 채팅 기록 조회는 로그인 후 이용 가능합니다.");
        break;

      case ErrorCodes.INVALID_QUESTION_DATA:
        toast.warning("질문 내용을 입력해주세요.");
        break;

      case ErrorCodes.CQ_INVALID_DATE_RANGE:
        toast.warning("유효하지 않은 날짜 범위입니다.");
        break;

      case ErrorCodes.QUESTION_LENGTH_EXCEEDED:
        toast.warning("질문 길이가 너무 깁니다. 2000자 이내로 작성해주세요.");
        break;

      case ErrorCodes.GPT_USAGE_LIMIT_EXCEEDED:
        toast.warning(
          "GPT 사용량 한도를 초과했습니다. 잠시 후 다시 시도해주세요."
        );
        break;

      
        // FAQ 관련 에러 처리
    case ErrorCodes.FAQ_NOT_FOUND:
      toast.warning("요청하신 FAQ를 찾을 수 없습니다.");
      break;

    case ErrorCodes.FAQ_QUERY_ERROR:
      toast.error("FAQ 정보를 불러오는 중 오류가 발생했습니다.");
      break;

    case ErrorCodes.FAQ_SAVE_ERROR:
    case ErrorCodes.FAQ_UPDATE_ERROR:
      toast.error("FAQ를 저장하는 중 오류가 발생했습니다.");
      break;

    case ErrorCodes.FAQ_DELETE_ERROR:
      toast.error("FAQ를 삭제하는 중 오류가 발생했습니다.");
      break;

    case ErrorCodes.FAQ_FILE_SAVE_ERROR:
      toast.error("FAQ 이미지를 저장하는 중 오류가 발생했습니다.");
      break;

    case ErrorCodes.FAQ_FILE_DELETE_ERROR:
      toast.error("FAQ 이미지를 삭제하는 중 오류가 발생했습니다.");
      break;

    case ErrorCodes.FAQ_FILE_NOT_FOUND:
      toast.warning("요청하신 FAQ 이미지를 찾을 수 없습니다.");
      break;

    case ErrorCodes.FAQ_UNSUPPORTED_FILE_TYPE:
      toast.warning("지원하지 않는 이미지 형식입니다. (지원: jpg, jpeg, png, gif)");
      break;

    case ErrorCodes.FAQ_ADMIN_PERMISSION_REQUIRED:
      toast.warning("FAQ 관리는 관리자만 가능합니다.");
      break;

    case ErrorCodes.FAQ_INVALID_CATEGORY:
      toast.warning("유효하지 않은 FAQ 카테고리입니다.");
      break;

    case ErrorCodes.FAQ_INVALID_REQUEST_DATA:
      toast.warning("FAQ 정보가 올바르지 않습니다. 필수 항목을 모두 입력해주세요.");
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
