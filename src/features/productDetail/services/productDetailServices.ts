import apiClient from "src/global/services/ApiClient";

// Response 타입 정의
export interface SizeDetailDto {
  size: string;
  purchasePrice: number;
  salePrice: number;
  quantity: number;
}

export interface ColorDetailDto {
  colorId: number;
  colorName: string;
  thumbnailImageUrl: string;
  content: string;
}

export interface ProductDetailResponse {
  id: number;
  name: string;
  englishName: string;
  releasePrice: number;
  thumbnailImageUrl: string;
  brandName: string;
  colorId: number;
  colorName: string;
  content: string;
  interestCount: number;
  sizes: SizeDetailDto[];
  otherColors: ColorDetailDto[];
}

export const getProductDetail = async (
  productId: string,
  colorName: string
) => {
  try {
    const response = await apiClient.get<ProductDetailResponse>(
      `/products/query/${productId}/detail`,
      {
        params: {
          colorName: colorName,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch product details:", error);
    throw error;
  }
};
