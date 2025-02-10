import axios from "axios";
import apiClient from "src/global/services/ApiClient";

export const fetchOutdoorData = async () => {
  try {
    const response = await apiClient.get("/products/query");

    // API 응답을 프론트엔드 포맷으로 변환
    return response.data.content.map((item: any) => ({
      transaction: item.viewCount || "0",
      img: item.thumbnailUrl,
      backgroundcolor: "#f4f4f4",
      brand: item.brandName,
      name: item.productName,
      price: item.salePrice.toLocaleString(),
      buy: item.buyAvailable,
      coupon: item.hasCoupon,
      earn: item.hasPoints,
    }));
  } catch (error) {
    console.error("상품 조회 실패:", error);
    return "no";
  }
};
