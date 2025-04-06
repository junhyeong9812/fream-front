import apiClient from "src/global/services/ApiClient";
import {
  CollectionRequestDto,
  CollectionResponseDto,
  PaginatedCollectionResponse,
  SortOption,
} from "../types/brandCollectionTypes";

export class CollectionService {
  private static COLLECTION_URL = "/collections";

  /**
   * 컬렉션 목록 조회 (페이징)
   */
  static async getCollectionsPaging(
    page: number = 0,
    size: number = 10,
    sortOption?: SortOption
  ): Promise<PaginatedCollectionResponse> {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("size", size.toString());

    if (sortOption) {
      params.append("sort", `${sortOption.field},${sortOption.order}`);
    }

    const response = await apiClient.get(
      `${this.COLLECTION_URL}/page?${params.toString()}`
    );
    return response.data.data;
  }

  /**
   * 컬렉션 검색 (페이징)
   */
  static async searchCollections(
    keyword: string,
    page: number = 0,
    size: number = 10,
    sortOption?: SortOption
  ): Promise<PaginatedCollectionResponse> {
    const params = new URLSearchParams();
    params.append("keyword", keyword);
    params.append("page", page.toString());
    params.append("size", size.toString());

    if (sortOption) {
      params.append("sort", `${sortOption.field},${sortOption.order}`);
    }

    const response = await apiClient.get(
      `${this.COLLECTION_URL}/search?${params.toString()}`
    );
    return response.data.data;
  }

  /**
   * 모든 컬렉션 조회 (페이징 없음)
   */
  static async getAllCollections(): Promise<CollectionResponseDto[]> {
    const response = await apiClient.get(this.COLLECTION_URL);
    return response.data.data;
  }

  /**
   * 단일 컬렉션 조회
   */
  static async getCollectionById(
    collectionId: number
  ): Promise<CollectionResponseDto> {
    const response = await apiClient.get(
      `${this.COLLECTION_URL}/${collectionId}`
    );
    return response.data.data;
  }

  /**
   * 컬렉션명으로 컬렉션 조회
   */
  static async getCollectionByName(
    collectionName: string
  ): Promise<CollectionResponseDto> {
    const response = await apiClient.get(
      `${this.COLLECTION_URL}/name/${collectionName}`
    );
    return response.data.data;
  }

  /**
   * 컬렉션 생성
   */
  static async createCollection(
    request: CollectionRequestDto
  ): Promise<CollectionResponseDto> {
    const response = await apiClient.post(this.COLLECTION_URL, request);
    return response.data.data;
  }

  /**
   * 컬렉션 수정
   */
  static async updateCollection(
    collectionId: number,
    request: CollectionRequestDto
  ): Promise<CollectionResponseDto> {
    const response = await apiClient.put(
      `${this.COLLECTION_URL}/${collectionId}`,
      request
    );
    return response.data.data;
  }

  /**
   * 컬렉션 삭제
   */
  static async deleteCollection(collectionName: string): Promise<void> {
    await apiClient.delete(`${this.COLLECTION_URL}/${collectionName}`);
  }
}
