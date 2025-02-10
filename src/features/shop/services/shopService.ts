import apiClient from "src/global/services/ApiClient";

export const fetchShopData = async () => {
  try {
    const response = await apiClient.get("/products/query");
    return response.data.content; // 변환 없이 바로 content 반환
  } catch (error) {
    console.error("상품 조회 실패:", error);
    return "no";
  }
};