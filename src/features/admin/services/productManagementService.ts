import apiClient from "src/global/services/ApiClient";
import {
  BrandResponseDto,
  CategoryResponseDto,
  CollectionResponseDto,
  FilterDataResponseDto,
  PaginatedProductResponse,
  ProductCreateRequestDto,
  ProductCreateResponseDto,
  ProductSearchDto,
  ProductUpdateRequestDto,
  ProductUpdateResponseDto,
} from "../types/productManagementTypes";

export class ProductService {
  private static PRODUCT_COMMAND_URL = "/products/command";
  private static PRODUCT_QUERY_URL = "/products/query";
  private static ES_PRODUCT_URL = "/es/products";
  private static BRAND_URL = "/brands";
  private static CATEGORY_URL = "/categories";
  private static COLLECTION_URL = "/collections";

  /**
   * 상품 검색
   */
  static async searchProducts(
    searchRequest: ProductSearchDto,
    page: number = 0,
    size: number = 20
  ): Promise<PaginatedProductResponse> {
    // URL 파라미터 구성
    const params = new URLSearchParams();

    // 페이지 정보 추가
    params.append("page", page.toString());
    params.append("size", size.toString());

    // 검색어가 있으면 추가
    if (searchRequest.keyword) {
      params.append("keyword", searchRequest.keyword);
    }

    // 카테고리 IDs가 있으면 추가
    if (searchRequest.categoryIds && searchRequest.categoryIds.length > 0) {
      searchRequest.categoryIds.forEach((id) => {
        params.append("categoryIds", id.toString());
      });
    }

    // 성별이 있으면 추가
    if (searchRequest.genders && searchRequest.genders.length > 0) {
      searchRequest.genders.forEach((gender) => {
        params.append("genders", gender);
      });
    }

    // 브랜드 IDs가 있으면 추가
    if (searchRequest.brandIds && searchRequest.brandIds.length > 0) {
      searchRequest.brandIds.forEach((id) => {
        params.append("brandIds", id.toString());
      });
    }

    // 컬렉션 IDs가 있으면 추가
    if (searchRequest.collectionIds && searchRequest.collectionIds.length > 0) {
      searchRequest.collectionIds.forEach((id) => {
        params.append("collectionIds", id.toString());
      });
    }

    // 색상이 있으면 추가
    if (searchRequest.colors && searchRequest.colors.length > 0) {
      searchRequest.colors.forEach((color) => {
        params.append("colors", color);
      });
    }

    // 사이즈가 있으면 추가
    if (searchRequest.sizes && searchRequest.sizes.length > 0) {
      searchRequest.sizes.forEach((size) => {
        params.append("sizes", size);
      });
    }

    // 가격 범위가 있으면 추가
    if (searchRequest.minPrice !== undefined) {
      params.append("minPrice", searchRequest.minPrice.toString());
    }
    if (searchRequest.maxPrice !== undefined) {
      params.append("maxPrice", searchRequest.maxPrice.toString());
    }

    // 정렬 옵션이 있으면 추가
    if (searchRequest.sortOption) {
      params.append("sortOption.field", searchRequest.sortOption.field);
      params.append("sortOption.order", searchRequest.sortOption.order);
    }

    const response = await apiClient.get(
      `${this.ES_PRODUCT_URL}?${params.toString()}`
    );
    return response.data;
  }

  /**
   * 상품 자동완성
   */
  static async autocompleteProducts(query: string): Promise<string[]> {
    const response = await apiClient.get(
      `${this.ES_PRODUCT_URL}/autocomplete?q=${query}`
    );
    return response.data;
  }

  /**
   * 필터 데이터 가져오기
   */
  static async getFilterData(): Promise<FilterDataResponseDto> {
    const response = await apiClient.get(`${this.PRODUCT_QUERY_URL}/filters`);
    return response.data;
  }

  /**
   * 브랜드 목록 가져오기
   */
  static async getBrands(): Promise<BrandResponseDto[]> {
    const response = await apiClient.get(this.BRAND_URL);
    return response.data.data || []; // ResponseDto에서 data 필드 추출
  }

  /**
   * 메인 카테고리 목록 가져오기
   */
  static async getMainCategories(): Promise<CategoryResponseDto[]> {
    const response = await apiClient.get(`${this.CATEGORY_URL}/main`);
    return response.data || []; // 직접 반환 (래핑 없음)
  }

  /**
   * 서브 카테고리 목록 가져오기
   */
  static async getSubCategories(
    mainCategoryName: string
  ): Promise<CategoryResponseDto[]> {
    const response = await apiClient.get(
      `${this.CATEGORY_URL}/sub/${mainCategoryName}`
    );
    return response.data || []; // 직접 반환 (래핑 없음)
  }

  /**
   * 컬렉션 목록 가져오기
   */
  static async getCollections(): Promise<CollectionResponseDto[]> {
    const response = await apiClient.get(this.COLLECTION_URL);
    return response.data.data || []; // ResponseDto에서 data 필드 추출
  }

  /**
   * 상품 생성
   */
  static async createProduct(
    data: ProductCreateRequestDto
  ): Promise<ProductCreateResponseDto> {
    const response = await apiClient.post(this.PRODUCT_COMMAND_URL, data);
    return response.data;
  }

  /**
   * 상품 수정
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
   */
  static async deleteProduct(productId: number): Promise<void> {
    await apiClient.delete(`${this.PRODUCT_COMMAND_URL}/${productId}`);
  }
}
