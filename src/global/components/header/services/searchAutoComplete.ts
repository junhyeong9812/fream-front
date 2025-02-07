import apiClient from "src/global/services/ApiClient";

// 백엔드에서 자동완성 결과를 문자열 배열(List<string>)로 반환한다고 가정
export async function searchAutoComplete(keyword: string): Promise<string[]> {
  try {
    const response = await apiClient.get<string[]>(
      `/es/products/autocomplete?q=${keyword}`
    );
    return response.data;
  } catch (error) {
    console.error("Autocomplete Error:", error);
    return [];
  }
}
