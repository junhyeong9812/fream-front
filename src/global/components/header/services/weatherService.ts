import apiClient from "src/global/services/ApiClient";
import { WeatherDataDto } from "src/global/types/weather";

export async function fetchCurrentWeather(): Promise<WeatherDataDto | null> {
  try {
    const response = await apiClient.get<WeatherDataDto>(
      "/weather/query/current"
    );
    return response.data;
  } catch (err) {
    console.error("Failed to fetch current weather:", err);
    return null;
  }
}
