import apiClient from "src/global/services/ApiClient";
import { ImageData, SelectedFiltersPayload } from "../types/filterTypes";
import { SortOption, getSortOption } from "../types/sortOptions";

/**
 * 필터 적용하여 상품 데이터 가져오기
 * @param filters 선택한 필터 값들
 * @param page 페이지 번호 (0부터 시작)
 * @param size 페이지 크기
 * @param sortOption 정렬 옵션
 * @returns 필터링된 상품 데이터와 페이징 정보를 포함한 응답
 */
export const fetchShopData = async (
  filters: SelectedFiltersPayload = {},
  page: number = 0,
  size: number = 20,
  sortOptionName: string = "인기순"
): Promise<{
  content: ImageData[];
  totalElements: number;
  totalPages: number;
  last: boolean;
}> => {
  try {
    const params = new URLSearchParams();

    // 페이징 파라미터 추가
    params.append("page", page.toString());
    params.append("size", size.toString());

    // 정렬 옵션 추가
    const sortOption = getSortOption(sortOptionName);
    params.append("sortOption.field", sortOption.field);
    params.append("sortOption.order", sortOption.order);

    // 키워드 추가
    if (filters.keyword) {
      params.append("keyword", filters.keyword);
    }

    // 카테고리 ID 추가
    if (filters.categoryIds && filters.categoryIds.length > 0) {
      params.append("categoryIds", filters.categoryIds.join(","));
    }

    // 브랜드 ID 추가
    if (filters.brandIds && filters.brandIds.length > 0) {
      params.append("brandIds", filters.brandIds.join(","));
    }

    // 컬렉션 ID 추가
    if (filters.collectionIds && filters.collectionIds.length > 0) {
      params.append("collectionIds", filters.collectionIds.join(","));
    }

    // 성별 추가
    if (filters.genders && filters.genders.length > 0) {
      params.append("genders", filters.genders.join(","));
    }

    // 색상 추가
    if (filters.colors && filters.colors.length > 0) {
      params.append("colors", filters.colors.join(","));
    }

    // 사이즈 추가
    if (filters.sizes && filters.sizes.length > 0) {
      params.append("sizes", filters.sizes.join(","));
    }

    // 가격 범위 추가
    if (filters.minPrice) {
      params.append("minPrice", filters.minPrice.toString());
    }

    if (filters.maxPrice) {
      params.append("maxPrice", filters.maxPrice.toString());
    }

    // API 엔드포인트 호출
    const url = `/es/products${
      params.toString() ? `?${params.toString()}` : ""
    }`;

    const response = await apiClient.get(url);

    if (response.data && response.data.content) {
      // 응답 데이터 포맷팅
      const formattedData = response.data.content.map((item: any) => ({
        ...item,
        price: item.price || item.releasePrice,
        imgUrl: item.thumbnailImageUrl,
        productName: item.name,
        productPrice: (item.price || item.releasePrice).toLocaleString() + "원",
      }));

      // 페이징 정보를 포함한 응답 반환
      return {
        content: formattedData,
        totalElements: response.data.totalElements,
        totalPages: response.data.totalPages,
        last: response.data.last,
      };
    } else {
      console.error(
        "fetchShopData 에러: 예상 데이터 구조가 아님",
        response.data
      );
      return {
        content: [],
        totalElements: 0,
        totalPages: 0,
        last: true,
      };
    }
  } catch (error) {
    console.error("fetchShopData 에러:", error);
    return {
      content: [],
      totalElements: 0,
      totalPages: 0,
      last: true,
    };
  }
};
/**
 * 정렬 옵션 설정(아직 사용X)
 * @param sortOption 정렬 옵션 값
 */
export const setSortOption = async (sortOption: string): Promise<void> => {
  try {
    await apiClient.post("/filters/sort", { sortOption });
  } catch (error) {
    console.error("정렬 옵션 설정 실패:", error);
  }
};

/**
 * 배송 필터 옵션 설정
 * @param deliveryOption 배송 옵션 값
 */
export const setDeliveryOption = async (
  deliveryOption: string
): Promise<void> => {
  try {
    await apiClient.post("/filters/delivery", { filter: deliveryOption });
  } catch (error) {
    console.error("배송 옵션 설정 실패:", error);
  }
};

/**
 * 추가 필터 옵션 설정 (정가이하, 품절제외)
 * @param options 필터 옵션 객체
 */
export const setAdditionalFilters = async (options: {
  isBelowOriginalPrice: boolean;
  isExcludeSoldOut: boolean;
}): Promise<void> => {
  try {
    await apiClient.post("/filters/additional", options);
  } catch (error) {
    console.error("추가 필터 설정 실패:", error);
  }
};
