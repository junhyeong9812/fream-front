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
} as const;

export type ErrorCodeType = (typeof ErrorCodes)[keyof typeof ErrorCodes];
