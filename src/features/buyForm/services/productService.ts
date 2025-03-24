import apiClient from "src/global/services/ApiClient";
import { ProductDetailDto } from "../types/product";

export const productService = {
  // 상품 상세 정보 가져오기
  getProductDetail: async (id: string): Promise<ProductDetailDto> => {
    const response = await apiClient.get<ProductDetailDto>(`/products/${id}`);
    return response.data;
  },
};
