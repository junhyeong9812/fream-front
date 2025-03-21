// src/global/services/accessLogService.ts
import { UserAccessLogDto } from "../types/accessLog";
import apiClient from "./ApiClient";
import { ApiError, ErrorCodes } from "../types/errors";

// 실패한 로그를 저장하는 localStorage 키
const FAILED_LOGS_KEY = "failed_access_logs";

/**
 * 접근 로그 전송 함수
 * @param logData UserAccessLogDto 형태의 로그 데이터
 */
export async function sendAccessLog(logData: UserAccessLogDto): Promise<void> {
  try {
    // 백엔드 URI: /access-log/commands/create
    await apiClient.post("/access-log/commands/create", logData);

    // 성공한 후 실패한 로그가 있다면 재전송 시도 (이 기능 추가 고려)
    // retrySendingFailedLogs();
  } catch (err) {
    // 기본 에러 처리는 인터셉터에서 이미 수행됨
    // 필요한 경우 특정 에러에 대한 추가 처리
    if (err instanceof ApiError) {
      // AccessLog 관련 에러 코드 추가
      if (
        err.code === ErrorCodes.ACCESS_LOG_SAVE_ERROR ||
        err.code === ErrorCodes.KAFKA_SEND_ERROR ||
        err.code === ErrorCodes.INTERNAL_SERVER_ERROR ||
        err.code === ErrorCodes.EXPIRED_TOKEN ||
        err.code === ErrorCodes.EXPIRED_TOKEN_GLOBAL
      ) {
        console.warn("접근 로그 전송에 실패했습니다. 나중에 재시도합니다.");

        // 로컬 스토리지에 저장
        saveLogForRetry(logData);
      }
    } else {
      // 네트워크 오류 등의 경우도 재시도 대상으로 저장
      console.error("접근 로그 전송 중 예상치 못한 오류:", err);
      saveLogForRetry(logData);
    }
  }
}

/**
 * 실패한 로그를 로컬 스토리지에 저장
 * @param logData 저장할 로그 데이터
 */
function saveLogForRetry(logData: UserAccessLogDto): void {
  try {
    // 현재 저장된 실패 로그 가져오기
    const failedLogsStr = localStorage.getItem(FAILED_LOGS_KEY);
    const failedLogs: UserAccessLogDto[] = failedLogsStr
      ? JSON.parse(failedLogsStr)
      : [];

    // 새 로그 추가
    failedLogs.push(logData);

    // 최대 50개까지만 저장 (너무 많은 데이터를 방지)
    if (failedLogs.length > 50) {
      failedLogs.shift(); // 가장 오래된 로그 제거
    }

    // 업데이트된 로그 저장
    localStorage.setItem(FAILED_LOGS_KEY, JSON.stringify(failedLogs));
  } catch (error) {
    console.error("Failed to save log for retry:", error);
  }
}

/**
 * 실패한 로그 재전송 함수
 */
export async function retrySendingFailedLogs(): Promise<void> {
  const failedLogsStr = localStorage.getItem(FAILED_LOGS_KEY);
  if (!failedLogsStr) return;

  const failedLogs: UserAccessLogDto[] = JSON.parse(failedLogsStr);
  if (failedLogs.length === 0) return;

  // 성공적으로 전송된 로그의 인덱스를 저장
  const successfulIndices: number[] = [];

  // 각 로그 항목 재전송 시도
  for (let i = 0; i < failedLogs.length; i++) {
    try {
      await apiClient.post("/access-log/commands/create", failedLogs[i]);
      // 성공한 경우 인덱스 저장
      successfulIndices.push(i);
    } catch (err) {
      console.error("로그 재전송 실패:", err);
      // 에러가 발생해도 다음 로그 처리 계속
    }
  }

  // 성공적으로 전송된 로그 제거 (역순으로 제거해야 인덱스가 꼬이지 않음)
  successfulIndices
    .sort((a, b) => b - a)
    .forEach((index) => {
      failedLogs.splice(index, 1);
    });

  // 업데이트된 실패 로그 저장
  if (failedLogs.length > 0) {
    localStorage.setItem(FAILED_LOGS_KEY, JSON.stringify(failedLogs));
  } else {
    localStorage.removeItem(FAILED_LOGS_KEY);
  }
}
