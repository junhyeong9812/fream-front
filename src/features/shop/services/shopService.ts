import apiClient from "src/global/services/ApiClient";
import {
  ImageData,
  SelectedFiltersPayload,
  PaginatedResponse,
} from "../types/filterTypes";

/**
 * 필터 적용하여 상품 데이터 가져오기 (페이징 지원)
 * @param filters 선택한 필터 값들
 * @param page 페이지 번호 (0부터 시작)
 * @param size 페이지당 아이템 수
 * @returns 필터링된 상품 데이터와 페이징 정보를 포함한 객체 프로미스
 */
export const fetchShopData = async (
  filters: SelectedFiltersPayload = {},
  page: number = 0,
  size: number = 20
): Promise<PaginatedResponse<ImageData>> => {
  try {
    const params = new URLSearchParams();

    // 페이징 파라미터 추가
    params.append("page", page.toString());
    params.append("size", size.toString());

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

    // 정렬 옵션 추가
    if (filters.sortOption) {
      const { formatSortForAPI } = await import("../types/sortOptions");
      params.append("sort", formatSortForAPI(filters.sortOption));
    }

    // 배송 옵션 추가
    if (filters.deliveryOption) {
      params.append("delivery", filters.deliveryOption);
    }

    // 추가 필터 추가
    if (filters.isBelowOriginalPrice) {
      params.append("belowOriginalPrice", "true");
    }

    if (filters.isExcludeSoldOut) {
      params.append("excludeSoldOut", "true");
    }

    //product경로 /products/query
    //elastic경로 /es/products
    const url = `/es/products${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    const response = await apiClient.get(url);

    if (response.data) {
      // 응답 데이터 포맷팅
      const formattedData = response.data.content.map((item: any) => ({
        id: item.id,
        name: item.name,
        englishName: item.englishName || "",
        brandName: item.brandName,
        releasePrice: item.releasePrice || 0,
        thumbnailImageUrl: item.thumbnailImageUrl,
        price: item.price || item.releasePrice || 0,
        colorName: item.colorName || "default",
        colorId: item.colorId || 0,
        interestCount: item.interestCount || 0,
        styleCount: item.styleCount || 0,
        tradeCount: item.tradeCount || 0,
        imgUrl: item.imgUrl || item.thumbnailImageUrl,
        productName: item.name,
        productPrice:
          (item.price || item.releasePrice || 0).toLocaleString() + "원",
      }));

      return {
        content: formattedData,
        last: response.data.last || false,
        totalElements: response.data.totalElements || 0,
        totalPages: response.data.totalPages || 1,
      };
    } else {
      console.error(
        "fetchShopData 에러: 예상 데이터 구조가 아님",
        response.data
      );
      return {
        content: [],
        last: true,
        totalElements: 0,
        totalPages: 0,
      };
    }
  } catch (error) {
    console.error("fetchShopData 에러:", error);
    return {
      content: [],
      last: true,
      totalElements: 0,
      totalPages: 0,
    };
  }
};

/**
 * 기존 호출 방식과의 호환성을 위한 함수 (레거시 지원)
 * @deprecated 가능하면 fetchShopData(filters) 방식을 사용하세요
 */
export const fetchShopDataLegacy = async (
  keyword?: string,
  categories?: string[],
  gender?: string | null,
  colors?: string[],
  priceRange?: string | null,
  sizes?: string[],
  brands?: string[],
  collections?: string[]
): Promise<ImageData[]> => {
  // 새로운 필터 객체로 변환
  const filters: SelectedFiltersPayload = {};

  if (keyword) {
    filters.keyword = keyword;
  }

  if (categories && categories.length > 0) {
    filters.categoryIds = categories
      .map((c) => parseInt(c, 10))
      .filter((id) => !isNaN(id));
  }

  if (gender) {
    filters.genders = [gender];
  }

  if (colors && colors.length > 0) {
    filters.colors = colors;
  }

  if (sizes && sizes.length > 0) {
    filters.sizes = sizes;
  }

  if (brands && brands.length > 0) {
    filters.brandIds = brands
      .map((b) => parseInt(b, 10))
      .filter((id) => !isNaN(id));
  }

  if (collections && collections.length > 0) {
    filters.collectionIds = collections
      .map((c) => parseInt(c, 10))
      .filter((id) => !isNaN(id));
  }

  // priceRange 처리 (가격 범위 형식에 따라 다름)
  if (priceRange) {
    if (priceRange.includes("_")) {
      const [min, max] = priceRange.split("_");
      if (min === "under") {
        filters.maxPrice = parseInt(max, 10);
      } else if (max === "over") {
        filters.minPrice = parseInt(min, 10);
      } else {
        filters.minPrice = parseInt(min, 10);
        filters.maxPrice = parseInt(max, 10);
      }
    }
  }

  // 필터 객체를 사용하여 새 함수 호출
  const result = await fetchShopData(filters);
  return result.content;
};

/**
 * 정렬 옵션 설정
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
