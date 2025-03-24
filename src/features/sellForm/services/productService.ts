import apiClient from "src/global/services/ApiClient";
import { ProductDetailDto, SizeDetailDto } from "../types/product";

export const productService = {
  // 상품 상세 정보 가져오기
  getProductDetail: async (
    id: string,
    colorName?: string
  ): Promise<ProductDetailDto> => {
    // colorName이 제공된 경우 쿼리 파라미터로 추가
    const url = colorName
      ? `/products/query/${id}/detail?colorName=${encodeURIComponent(
          colorName
        )}`
      : `/products/query/${id}/detail`;

    const response = await apiClient.get<ProductDetailDto>(url);
    return response.data;
  },

  // 상품 사이즈 정보 찾기 (이미 가져온 상품 정보에서 추출)
  findSizeInfo: (
    product: ProductDetailDto,
    size: string
  ): SizeDetailDto | null => {
    if (!product.sizes || product.sizes.length === 0) {
      return null;
    }

    return product.sizes.find((s) => s.size === size) || null;
  },
};
