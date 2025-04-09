import apiClient from "src/global/services/ApiClient";
import {
  ProductDetailResponseDto,
  ProductColorDetailResponseDto,
  ProductCreateRequestDto,
  ProductCreateResponseDto,
  ProductUpdateRequestDto,
  ProductUpdateResponseDto,
} from "../types/productManagementTypes";

/**
 * 관리자용 상품 API 서비스
 */
export class AdminProductService {
  private static ADMIN_PRODUCT_QUERY_URL = "/admin/products/query";
  private static PRODUCT_COMMAND_URL = "/products/command";

  /**
   * 상품 상세 정보 조회 (관리자용)
   * @param productId 상품 ID
   * @returns 상품 상세 정보
   */
  static async getProductDetailForAdmin(
    productId: number
  ): Promise<ProductDetailResponseDto> {
    const response = await apiClient.get(
      `${this.ADMIN_PRODUCT_QUERY_URL}/${productId}/detail`
    );
    return response.data;
  }

  /**
   * 상품의 색상 목록 조회 (관리자용)
   * @param productId 상품 ID
   * @returns 색상 목록
   */
  static async getProductColorsForAdmin(
    productId: number
  ): Promise<ProductColorDetailResponseDto[]> {
    const response = await apiClient.get(
      `${this.ADMIN_PRODUCT_QUERY_URL}/${productId}/colors`
    );
    return response.data;
  }

  /**
   * 색상 상세 정보 조회 (관리자용)
   * @param colorId 색상 ID
   * @returns 색상 상세 정보
   */
  static async getProductColorDetailForAdmin(
    colorId: number
  ): Promise<ProductColorDetailResponseDto> {
    const response = await apiClient.get(
      `${this.ADMIN_PRODUCT_QUERY_URL}/colors/${colorId}`
    );
    return response.data;
  }

  /**
   * 상품 생성
   * @param data 상품 생성 요청 데이터
   * @returns 생성된 상품 정보
   */
  static async createProduct(
    data: ProductCreateRequestDto
  ): Promise<ProductCreateResponseDto> {
    const response = await apiClient.post(`${this.PRODUCT_COMMAND_URL}`, data);
    return response.data;
  }

  /**
   * 상품 수정
   * @param productId 상품 ID
   * @param data 상품 수정 요청 데이터
   * @returns 수정된 상품 정보
   */
  static async updateProduct(
    productId: number,
    data: ProductUpdateRequestDto
  ): Promise<ProductUpdateResponseDto> {
    const response = await apiClient.put(
      `${this.PRODUCT_COMMAND_URL}/${productId}`,
      data
    );
    return response.data;
  }

  /**
   * 상품 삭제
   * @param productId 상품 ID
   */
  static async deleteProduct(productId: number): Promise<void> {
    await apiClient.delete(`${this.PRODUCT_COMMAND_URL}/${productId}`);
  }
}
