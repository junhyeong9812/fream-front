import apiClient from "src/global/services/ApiClient";
import {
  CategoryRequestDto,
  CategoryResponseDto
} from "../types/categoryTypes";

export class CategoryService {
  private static CATEGORY_URL = "/categories";

  /**
   * 모든 메인 카테고리 조회
   */
  static async getAllMainCategories(): Promise<CategoryResponseDto[]> {
    const response = await apiClient.get(`${this.CATEGORY_URL}/main`);
    // API 응답이 직접 배열 형태로 오므로 response.data 사용
    return response.data || [];
  }

  /**
   * 메인 카테고리에 속한 서브 카테고리 조회
   */
  static async getSubCategoriesByMain(mainCategoryName: string): Promise<CategoryResponseDto[]> {
    const response = await apiClient.get(`${this.CATEGORY_URL}/sub/${mainCategoryName}`);
    // API 응답이 직접 배열 형태로 오므로 response.data 사용
    return response.data || [];
  }

  /**
   * 카테고리 생성 (메인 또는 서브)
   */
  static async createCategory(request: CategoryRequestDto): Promise<CategoryResponseDto> {
    const response = await apiClient.post(this.CATEGORY_URL, request);
    return response.data;
  }

  /**
   * 카테고리 수정
   */
  static async updateCategory(categoryId: number, request: CategoryRequestDto): Promise<CategoryResponseDto> {
    const response = await apiClient.put(`${this.CATEGORY_URL}/${categoryId}`, request);
    return response.data;
  }

  /**
   * 카테고리 삭제
   */
  static async deleteCategory(categoryId: number): Promise<void> {
    await apiClient.delete(`${this.CATEGORY_URL}/${categoryId}`);
  }
}