import apiClient from "src/global/services/ApiClient";
import {
  BrandRequestDto,
  BrandResponseDto,
  PaginatedBrandResponse,
  SortOption,
} from "../types/brandCollectionTypes";

export class BrandService {
  private static BRAND_URL = "/brands";

  /**
   * 브랜드 목록 조회 (페이징)
   */
  static async getBrandsPaging(
    page: number = 0,
    size: number = 10,
    sortOption?: SortOption
  ): Promise<PaginatedBrandResponse> {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("size", size.toString());

    if (sortOption) {
      params.append("sort", `${sortOption.field},${sortOption.order}`);
    }

    const response = await apiClient.get(
      `${this.BRAND_URL}/page?${params.toString()}`
    );
    return response.data.data;
  }

  /**
   * 브랜드 검색 (페이징)
   */
  static async searchBrands(
    keyword: string,
    page: number = 0,
    size: number = 10,
    sortOption?: SortOption
  ): Promise<PaginatedBrandResponse> {
    const params = new URLSearchParams();
    params.append("keyword", keyword);
    params.append("page", page.toString());
    params.append("size", size.toString());

    if (sortOption) {
      params.append("sort", `${sortOption.field},${sortOption.order}`);
    }

    const response = await apiClient.get(
      `${this.BRAND_URL}/search?${params.toString()}`
    );
    return response.data.data;
  }

  /**
   * 모든 브랜드 조회 (페이징 없음)
   */
  static async getAllBrands(): Promise<BrandResponseDto[]> {
    const response = await apiClient.get(this.BRAND_URL);
    return response.data.data;
  }

  /**
   * 단일 브랜드 조회
   */
  static async getBrandById(brandId: number): Promise<BrandResponseDto> {
    const response = await apiClient.get(`${this.BRAND_URL}/${brandId}`);
    return response.data.data;
  }

  /**
   * 브랜드명으로 브랜드 조회
   */
  static async getBrandByName(brandName: string): Promise<BrandResponseDto> {
    const response = await apiClient.get(`${this.BRAND_URL}/name/${brandName}`);
    return response.data.data;
  }

  /**
   * 브랜드 생성
   */
  static async createBrand(
    request: BrandRequestDto
  ): Promise<BrandResponseDto> {
    const response = await apiClient.post(this.BRAND_URL, request);
    return response.data.data;
  }

  /**
   * 브랜드 수정
   */
  static async updateBrand(
    brandId: number,
    request: BrandRequestDto
  ): Promise<BrandResponseDto> {
    const response = await apiClient.put(
      `${this.BRAND_URL}/${brandId}`,
      request
    );
    return response.data.data;
  }

  /**
   * 브랜드 삭제
   */
  static async deleteBrand(brandName: string): Promise<void> {
    await apiClient.delete(`${this.BRAND_URL}/${brandName}`);
  }
}
