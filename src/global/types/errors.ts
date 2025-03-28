// src/types/errors.ts
export interface ApiErrorResponse {
  code: string;
  message: string;
  status: number;
  timestamp: string;
  path: string;
}

export class ApiError extends Error {
  code: string;
  status: number;
  timestamp: string;
  path: string;

  constructor(errorResponse: ApiErrorResponse) {
    super(errorResponse.message);
    this.name = "ApiError";
    this.code = errorResponse.code;
    this.status = errorResponse.status;
    this.timestamp = errorResponse.timestamp;
    this.path = errorResponse.path;
  }
}

// 에러 코드 상수
export const ErrorCodes = {
  // 글로벌 에러 코드
  INTERNAL_SERVER_ERROR: "G001",
  INVALID_INPUT_VALUE: "G002",
  INVALID_TYPE_VALUE: "G003",
  RESOURCE_NOT_FOUND: "G004",
  METHOD_NOT_ALLOWED: "G005",
  UNAUTHORIZED: "G006",
  ACCESS_DENIED: "G007",
  INVALID_TOKEN_GLOBAL: "G008",
  EXPIRED_TOKEN_GLOBAL: "G009",
  SECURITY_CONTEXT_NOT_FOUND: "G010",

  // 파일 관련 에러 코드
  FILE_UPLOAD_ERROR: "F001",
  FILE_DOWNLOAD_ERROR: "F002",
  UNSUPPORTED_FILE_TYPE: "F003",
  FILE_NOT_FOUND: "F004",
  DIRECTORY_CREATION_ERROR: "F005",

  // 보안 관련 에러 코드
  INVALID_TOKEN: "S001",
  EXPIRED_TOKEN: "S002",
  TOKEN_NOT_FOUND: "S003",
  INVALID_REFRESH_TOKEN: "S004",
  USER_NOT_FOUND: "S005",
  TOKEN_CREATION_ERROR: "S006",

  // 웹소켓 관련 에러 코드
  WS_CONNECTION_ERROR: "W001",
  WS_AUTHENTICATION_ERROR: "W002",
  WS_MESSAGE_SEND_ERROR: "W003",
  WS_INVALID_DESTINATION: "W004",
  WS_SESSION_NOT_FOUND: "W005",

  // 날씨 관련 에러 코드 - 'WE' 접두사 사용 (Weather)
  // API 관련 에러
  WEATHER_API_ERROR: "WE001",
  WEATHER_API_PARSING_ERROR: "WE002",

  // 데이터 관련 에러
  WEATHER_DATA_NOT_FOUND: "WE101",
  WEATHER_DATA_SAVE_ERROR: "WE102",
  WEATHER_DATA_QUERY_ERROR: "WE103",

  // 파라미터 관련 에러
  WEATHER_INVALID_DATETIME_FORMAT: "WE201",
  WEATHER_INVALID_TIME_RANGE: "WE202",

  // 접근 로그 관련 에러 코드 - 'AL' 접두사 사용 (AccessLog)
  // API 관련 에러
  ACCESS_LOG_SAVE_ERROR: "AL001",
  KAFKA_SEND_ERROR: "AL002",
  KAFKA_RECEIVE_ERROR: "AL003",

  // 조회 관련 에러
  ACCESS_LOG_QUERY_ERROR: "AL101",
  STATISTICS_QUERY_ERROR: "AL102",

  // 지리정보 관련 에러
  GEO_IP_LOOKUP_ERROR: "AL201",
  GEO_IP_DATABASE_ERROR: "AL202",

  // 파라미터 관련 에러
  INVALID_ACCESS_LOG_DATA: "AL301",
  INVALID_IP_ADDRESS: "AL302",
  INVALID_DATE_RANGE: "AL303",

  // 채팅 질문 관련 에러 코드 - 'CQ' 접두사 사용 (ChatQuestion)
  // API 관련 에러
  GPT_API_ERROR: "CQ001",
  GPT_RESPONSE_PROCESSING_ERROR: "CQ002",
  GPT_USAGE_LOG_ERROR: "CQ003",

  // 데이터 관련 에러
  CHAT_QUESTION_SAVE_ERROR: "CQ101",
  CHAT_HISTORY_QUERY_ERROR: "CQ102",
  USAGE_STATS_QUERY_ERROR: "CQ103",

  // 권한 관련 에러
  ADMIN_PERMISSION_REQUIRED: "CQ201",
  QUESTION_PERMISSION_DENIED: "CQ202",

  // 파라미터 관련 에러
  INVALID_QUESTION_DATA: "CQ301",
  CQ_INVALID_DATE_RANGE: "CQ302",
  QUESTION_LENGTH_EXCEEDED: "CQ303",
  GPT_USAGE_LIMIT_EXCEEDED: "CQ304",

  // FAQ 관련 에러 코드 - 'FAQ' 접두사 사용
  // 데이터 조회 관련 에러
  FAQ_NOT_FOUND: "FAQ001",
  FAQ_QUERY_ERROR: "FAQ002",

  // 데이터 수정 관련 에러
  FAQ_SAVE_ERROR: "FAQ003",
  FAQ_DELETE_ERROR: "FAQ004",
  FAQ_UPDATE_ERROR: "FAQ005",

  // 파일 관련 에러
  FAQ_FILE_SAVE_ERROR: "FAQ101",
  FAQ_FILE_DELETE_ERROR: "FAQ102",
  FAQ_FILE_NOT_FOUND: "FAQ103",
  FAQ_UNSUPPORTED_FILE_TYPE: "FAQ104",

  // 권한 관련 에러
  FAQ_ADMIN_PERMISSION_REQUIRED: "FAQ201",

  // 요청 데이터 관련 에러
  FAQ_INVALID_CATEGORY: "FAQ301",
  FAQ_INVALID_REQUEST_DATA: "FAQ302",

  // 검수 기준 관련 에러 코드 - 'INS' 접두사 사용
  // 데이터 조회 관련 에러
  INSPECTION_NOT_FOUND: "INS001",
  INSPECTION_QUERY_ERROR: "INS002",

  // 데이터 수정 관련 에러
  INSPECTION_SAVE_ERROR: "INS003",
  INSPECTION_DELETE_ERROR: "INS004",
  INSPECTION_UPDATE_ERROR: "INS005",

  // 파일 관련 에러
  INSPECTION_FILE_SAVE_ERROR: "INS101",
  INSPECTION_FILE_DELETE_ERROR: "INS102",
  INSPECTION_FILE_NOT_FOUND: "INS103",
  INSPECTION_UNSUPPORTED_FILE_TYPE: "INS104",

  // 권한 관련 에러
  INSPECTION_ADMIN_PERMISSION_REQUIRED: "INS201",

  // 요청 데이터 관련 에러
  INSPECTION_INVALID_CATEGORY: "INS301",
  INSPECTION_INVALID_REQUEST_DATA: "INS302",

  // 공지사항 관련 에러 코드 - 'NOT' 접두사 사용
  // 데이터 조회 관련 에러
  NOTICE_NOT_FOUND: "NOT001",
  NOTICE_QUERY_ERROR: "NOT002",

  // 데이터 수정 관련 에러
  NOTICE_SAVE_ERROR: "NOT003",
  NOTICE_DELETE_ERROR: "NOT004",
  NOTICE_UPDATE_ERROR: "NOT005",

  // 파일 관련 에러
  NOTICE_FILE_SAVE_ERROR: "NOT101",
  NOTICE_FILE_DELETE_ERROR: "NOT102",
  NOTICE_FILE_NOT_FOUND: "NOT103",
  NOTICE_UNSUPPORTED_FILE_TYPE: "NOT104",

  // 권한 관련 에러
  NOTICE_ADMIN_PERMISSION_REQUIRED: "NOT201",

  // 요청 데이터 관련 에러
  NOTICE_INVALID_CATEGORY: "NOT301",
  NOTICE_INVALID_REQUEST_DATA: "NOT302",

  // 알림 관련 에러
  NOTICE_NOTIFICATION_ERROR: "NOT401",
} as const;

export type ErrorCodeType = (typeof ErrorCodes)[keyof typeof ErrorCodes];
