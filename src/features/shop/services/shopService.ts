import apiClient from "src/global/services/ApiClient";

export const fetchShopData = async (keyword?: string) => {
  try {
    const params = new URLSearchParams();
    if (keyword) {
      params.append("keyword", keyword);
    }
    const queryString = params.toString();
    const url = `/products/query${queryString ? `?${queryString}` : ""}`;

    const response = await apiClient.get(url);
    return response.data.content;

    // const response = await apiClient.get(
    //   `/products/query?${params.toString()}`
    // );
    // return response.data.content;
  } catch (error) {
    console.error("상품 조회 실패:", error);
    return "no";
  }
};
