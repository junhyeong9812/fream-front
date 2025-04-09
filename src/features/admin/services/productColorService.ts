import apiClient from "src/global/services/ApiClient";
import {
  ProductColorCreateRequestDto,
  ProductColorUpdateRequestDto,
  ProductColorDetailResponseDto,
} from "../types/productManagementTypes";

/**
 * 상품 색상 관련 API 서비스
 */
export class ProductColorService {
  private static PRODUCT_COLOR_URL = "/product-colors";

  /**
   * 상품 색상 상세 정보 조회
   * @param colorId 색상 ID
   * @returns 색상 상세 정보
   */
  static async getProductColorById(
    colorId: number
  ): Promise<ProductColorDetailResponseDto> {
    const response = await apiClient.get(
      `${this.PRODUCT_COLOR_URL}/${colorId}`
    );
    return response.data;
  }

  /**
   * 상품의 색상 목록 조회
   * @param productId 상품 ID
   * @returns 색상 목록
   */
  static async getProductColorsByProductId(
    productId: number
  ): Promise<ProductColorDetailResponseDto[]> {
    const response = await apiClient.get(`/products/${productId}/colors`);
    return response.data;
  }

  /**
   * 상품 색상 생성
   * @param productId 상품 ID
   * @param formData 색상 생성 요청 데이터 (multipart/form-data)
   * @returns 생성 성공 여부
   */
  static async createProductColor(
    productId: number,
    formData: FormData
  ): Promise<void> {
    await apiClient.post(`${this.PRODUCT_COLOR_URL}/${productId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  /**
   * 상품 색상 수정
   * @param colorId 색상 ID
   * @param formData 색상 수정 요청 데이터 (multipart/form-data)
   * @returns 수정 성공 여부
   */
  static async updateProductColor(
    colorId: number,
    formData: FormData
  ): Promise<void> {
    await apiClient.put(`${this.PRODUCT_COLOR_URL}/${colorId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  /**
   * 상품 색상 삭제
   * @param colorId 색상 ID
   * @returns 삭제 성공 여부
   */
  static async deleteProductColor(colorId: number): Promise<void> {
    await apiClient.delete(`${this.PRODUCT_COLOR_URL}/${colorId}`);
  }

  /**
   * 상품 이미지 URL 생성
   * @param productId 상품 ID
   * @param imageName 이미지 파일명
   * @returns 이미지 URL
   */
  static getProductImageUrl(productId: number, imageName: string): string {
    return `/products/query/${productId}/images?imageName=${imageName}`;
  }
}
