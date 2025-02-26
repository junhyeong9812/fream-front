import apiClient from "src/global/services/ApiClient";
import {
  FilterCountResponseDto,
  FilterDataType,
  SelectedFiltersPayload,
} from "../types/filterTypes";

/**
 * Fetches all filter data from the server
 * @returns Promise with filter data
 */
export const fetchFilterData = async (): Promise<FilterDataType> => {
  try {
    const response = await apiClient.get("/products/query/filters");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch filter data:", error);

    // Return mock data on error (for development)
    const mockData: FilterDataType = {
      sizes: {
        CLOTHING: ["XS", "S", "M", "L", "XL"],
        SHOES: ["230", "240", "250", "260", "270"],
        ACCESSORIES: ["ONE_SIZE"],
      },
      genders: ["MALE", "FEMALE", "KIDS", "UNISEX"],
      colors: [
        { key: "BLACK", name: "블랙" },
        { key: "WHITE", name: "화이트" },
        { key: "BLUE", name: "블루" },
      ],
      discounts: [
        { title: "혜택", options: ["무료배송", "할인", "정가이하"] },
        { title: "할인율", options: ["30% 이하", "30%~50%", "50% 이상"] },
      ],
      priceRanges: [
        { label: "10만원 이하", value: "under_100000" },
        { label: "10만원대", value: "100000_200000" },
        { label: "20만원대", value: "200000_300000" },
        { label: "30만원대", value: "300000_400000" },
        { label: "30~50만원", value: "300000_500000" },
        { label: "50~100만원", value: "500000_1000000" },
        { label: "100~500만원", value: "1000000_5000000" },
        { label: "500만원 이상", value: "over_5000000" },
      ],
      categories: [
        {
          id: 1,
          value: "Shoes",
          label: "신발",
          subCategories: [
            { id: 3, value: "Sneakers", label: "스니커즈" },
            { id: 4, value: "SandalsSlippers", label: "샌들/슬리퍼" },
          ],
        },
        {
          id: 2,
          value: "Tops",
          label: "상의",
          subCategories: [
            { id: 5, value: "ShortSleeveTShirts", label: "반팔 티셔츠" },
            { id: 6, value: "LongSleeveTShirts", label: "긴팔 티셔츠" },
          ],
        },
      ],
    };
    return mockData;
  }
};

/**
 * Applies filters and returns the count of matching products
 * @param filters Selected filter values
 * @returns Promise with count of products matching the filters
 */
export const getFilteredProductsCount = async (
  filters: SelectedFiltersPayload
): Promise<number> => {
  try {
    const response = await apiClient.post<FilterCountResponseDto>(
      "/products/query/filters/count",
      filters
    );
    return response.data.totalCount;
  } catch (error) {
    console.error("Failed to get filtered product count:", error);
    return 0;
  }
};

/**
 * Resets all filters
 */
export const resetFilters = async (): Promise<void> => {
  try {
    await apiClient.post("/api/filters/reset", {});
  } catch (error) {
    console.error("Failed to reset filters:", error);
  }
};

/**
 * Prepares selected filters for API request
 * @param selectedFilters Record of selected filter values
 * @returns Formatted payload for API request
 */
export const prepareFilterPayload = (
  selectedFilters: Record<string, Set<string>>,
  keyword?: string
): SelectedFiltersPayload => {
  const payload: SelectedFiltersPayload = {};

  // Add keyword if present
  if (keyword) {
    payload.keyword = keyword;
  }

  // Add category IDs if present
  if (
    selectedFilters["신발"] ||
    selectedFilters["상의"] ||
    selectedFilters["하의"]
  ) {
    payload.categoryIds = [];

    // Process categories (convert string IDs to numbers)
    ["신발", "상의", "하의", "아우터"].forEach((categoryName) => {
      if (selectedFilters[categoryName]) {
        selectedFilters[categoryName].forEach((value) => {
          const numValue = parseInt(value, 10);
          if (!isNaN(numValue)) {
            payload.categoryIds!.push(numValue);
          }
        });
      }
    });
  }

  // Add gender if present
  if (selectedFilters.gender && selectedFilters.gender.size > 0) {
    payload.genders = Array.from(selectedFilters.gender);
  }

  // Add colors if present
  if (selectedFilters.color && selectedFilters.color.size > 0) {
    payload.colors = Array.from(selectedFilters.color);
  }

  // Add sizes if present
  if (
    selectedFilters.SHOES ||
    selectedFilters.CLOTHING ||
    selectedFilters.ACCESSORIES
  ) {
    payload.sizes = [];

    // Process sizes from different categories
    ["SHOES", "CLOTHING", "ACCESSORIES"].forEach((sizeCategory) => {
      if (selectedFilters[sizeCategory]) {
        payload.sizes!.push(...Array.from(selectedFilters[sizeCategory]));
      }
    });
  }

  // Process price range
  if (selectedFilters.priceRange && selectedFilters.priceRange.size > 0) {
    const priceRange = Array.from(selectedFilters.priceRange)[0];

    // Parse price range (format: "min_max" or "under_X" or "over_X")
    if (priceRange.includes("_")) {
      const [min, max] = priceRange.split("_");

      if (min === "under") {
        payload.maxPrice = parseInt(max, 10);
      } else if (max === "over") {
        payload.minPrice = parseInt(min, 10);
      } else {
        payload.minPrice = parseInt(min, 10);
        payload.maxPrice = parseInt(max, 10);
      }
    }
  }

  // Add brands if present
  if (selectedFilters.brands && selectedFilters.brands.size > 0) {
    payload.brandIds = Array.from(selectedFilters.brands)
      .map((id) => parseInt(id, 10))
      .filter((id) => !isNaN(id));
  }

  return payload;
};
