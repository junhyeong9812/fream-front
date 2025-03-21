import apiClient from "src/global/services/ApiClient";
import { WeatherDataDto } from "src/global/types/weather";
import { ApiError, ErrorCodes } from "src/global/types/errors";

/**
 * 현재 날씨 정보를 가져옵니다.
 * @returns 현재 날씨 데이터 또는 null (에러 발생 시)
 */
export async function fetchCurrentWeather(): Promise<WeatherDataDto | null> {
  try {
    const response = await apiClient.get<WeatherDataDto>(
      "/weather/query/current"
    );
    return response.data;
  } catch (err) {
    // ApiError 타입인 경우 (이미 에러 핸들러에서 기본 처리됨)
    if (err instanceof ApiError) {
      // 날씨 데이터를 찾을 수 없는 경우 특별 처리
      if (err.code === ErrorCodes.WEATHER_DATA_NOT_FOUND) {
        // 비즈니스 로직에 필요한 추가 처리
        console.log("현재 시간에 해당하는 날씨 데이터가 없습니다.");
      }
    } else {
      // ApiError가 아닌 경우 (네트워크 오류 등)
      console.error("날씨 정보 조회 중 예상치 못한 오류 발생:", err);
    }
    return null;
  }
}

/**
 * 오늘의 날씨 정보를 시간별로 가져옵니다.
 * @returns 오늘의 시간별 날씨 데이터 배열 또는 빈 배열 (에러 발생 시)
 */
export async function fetchTodayWeather(): Promise<WeatherDataDto[]> {
  try {
    const response = await apiClient.get<WeatherDataDto[]>(
      "/weather/query/today"
    );
    return response.data;
  } catch (err) {
    if (err instanceof ApiError) {
      // 필요한 경우 특정 에러 코드에 대한 추가 처리
      if (err.code === ErrorCodes.WEATHER_DATA_NOT_FOUND) {
        // 예: 빈 데이터를 표시할 UI 상태 업데이트
      }
    } else {
      console.error("오늘의 날씨 정보 조회 중 오류 발생:", err);
    }
    return [];
  }
}
