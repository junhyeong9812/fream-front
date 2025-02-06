import apiClient from "src/global/services/ApiClient";
import api from "src/global/services/axios";
import { DailyAccessCountDto } from "src/global/types/accessLog";

/**
 * 오늘 접속자 수 (long)
 */
export async function fetchTodayAccessCount(): Promise<number> {
  try {
    const response = await apiClient.get<number>("/access-log/queries/today");
    return response.data;
  } catch (err) {
    console.error("Failed to fetch today's access count:", err);
    return 0;
  }
}

/**
 * 최근 7일 일자별 접속자 수
 */
export async function fetchWeekAccessCount(): Promise<DailyAccessCountDto[]> {
  try {
    const response = await apiClient.get<DailyAccessCountDto[]>(
      "/access-log/queries/week"
    );
    return response.data;
  } catch (err) {
    console.error("Failed to fetch week access counts:", err);
    return [];
  }
}
