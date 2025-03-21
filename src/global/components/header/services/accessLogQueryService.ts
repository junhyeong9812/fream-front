// src/global/services/accessLogQueryService.ts
import apiClient from "src/global/services/ApiClient";
import { DailyAccessCountDto } from "src/global/types/accessLog";
import { ApiError, ErrorCodes } from "src/global/types/errors";

/**
 * 오늘 접속자 수 조회
 * @returns 오늘의 고유 방문자 수
 */
export async function fetchTodayAccessCount(): Promise<number> {
  try {
    const response = await apiClient.get<number>("/access-log/queries/today");
    return response.data;
  } catch (err) {
    if (err instanceof ApiError) {
      // 여기서는 특별한 처리 없이 ErrorHandler가 처리하도록 함
      // 접근 통계 조회 에러는 치명적이지 않으므로 기본값 반환
      console.error("오늘 접속자 수 조회 실패:", err);
    } else {
      console.error("오늘 접속자 수 조회 중 예상치 못한 오류:", err);
    }
    return 0; // 에러 발생 시 기본값으로 0 반환
  }
}

/**
 * 최근 7일 일자별 접속자 수 조회
 * @returns 최근 7일간의 일자별 접속자 수 목록
 */
export async function fetchWeekAccessCount(): Promise<DailyAccessCountDto[]> {
  try {
    const response = await apiClient.get<DailyAccessCountDto[]>(
      "/access-log/queries/week"
    );
    return response.data;
  } catch (err) {
    if (err instanceof ApiError) {
      // 특별한 에러 코드에 따른 처리가 필요하면 여기서 수행
      if (err.code === ErrorCodes.INVALID_DATE_RANGE) {
        console.warn("유효하지 않은 날짜 범위:", err.message);
      }
    }
    console.error("주간 접속자 수 조회 실패:", err);
    return []; // 에러 발생 시 빈 배열 반환
  }
}
