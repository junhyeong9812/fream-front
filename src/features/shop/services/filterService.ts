import apiClient from "src/global/services/ApiClient";
import {
  FilterCountResponseDto,
  FilterDataType,
  SelectedFiltersPayload,
  BrandItem,
  GroupedBrands,
} from "../types/filterTypes";

/**
 * 서버에서 모든 필터 데이터를 가져옵니다
 * @returns 필터 데이터가 포함된 Promise
 */
export const fetchFilterData = async (): Promise<FilterDataType> => {
  try {
    const response = await apiClient.get("/products/query/filters");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch filter data:", error);

    // 개발용 목업 데이터 반환
    const mockData: FilterDataType = {
      sizes: {
        CLOTHING: ["XS", "S", "M", "L", "XL"],
        SHOES: ["230", "240", "250", "260", "270"],
        ACCESSORIES: ["ONE_SIZE"],
      },
      genders: [
        { value: "MALE", label: "남성" },
        { value: "FEMALE", label: "여성" },
        { value: "KIDS", label: "키즈" },
        { value: "UNISEX", label: "공용" },
      ],
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
      brands: [
        { id: 1, value: "Nike", label: "Nike" },
        { id: 2, value: "Adidas", label: "Adidas" },
        { id: 3, value: "New Balance", label: "New Balance" },
        { id: 4, value: "Jordan", label: "Jordan" },
        { id: 5, value: "Stussy", label: "Stussy" },
        { id: 6, value: "IAB Studio", label: "IAB Studio" },
        { id: 7, value: "NewJeans", label: "NewJeans" },
      ],
      collections: [],
    };
    return mockData;
  }
};

/**
 * 필터를 적용하고 일치하는 제품 수를 반환합니다
 * @param filters 선택된 필터 값
 * @returns 필터와 일치하는 제품 수가 포함된 Promise
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
 * 모든 필터를 초기화합니다
 */
export const resetFilters = async (): Promise<void> => {
  try {
    await apiClient.post("/api/filters/reset", {});
  } catch (error) {
    console.error("Failed to reset filters:", error);
  }
};

/**
 * 선택한 필터를 API 요청용으로 준비합니다
 * @param selectedFilters 선택된 필터 값 레코드
 * @returns API 요청을 위한 포맷된 페이로드
 */
export const prepareFilterPayload = (
  selectedFilters: Record<string, Set<string>>,
  keyword?: string
): SelectedFiltersPayload => {
  const payload: SelectedFiltersPayload = {};

  // 키워드가 있으면 추가
  if (keyword) {
    payload.keyword = keyword;
  }

  // 카테고리 ID 처리
  const categoryIds: number[] = [];

  // 신발, 상의, 하의, 아우터 등의 카테고리 처리
  [
    "신발",
    "상의",
    "하의",
    "아우터",
    "가방",
    "지갑",
    "시계",
    "패션잡화",
    "컬렉터블",
    "뷰티",
    "테크",
    "캠핑",
    "가구/리빙",
    "럭셔리",
  ].forEach((categoryName) => {
    if (selectedFilters[categoryName]) {
      selectedFilters[categoryName].forEach((value) => {
        const numValue = parseInt(value, 10);
        if (!isNaN(numValue) && !categoryIds.includes(numValue)) {
          categoryIds.push(numValue);
        }
      });
    }
  });

  if (categoryIds.length > 0) {
    payload.categoryIds = categoryIds;
  }

  // 성별이 있으면 추가
  if (selectedFilters.gender && selectedFilters.gender.size > 0) {
    payload.genders = Array.from(selectedFilters.gender);
  }

  // 색상이 있으면 추가
  if (selectedFilters.color && selectedFilters.color.size > 0) {
    payload.colors = Array.from(selectedFilters.color);
  }

  // 사이즈가 있으면 추가
  const sizes: string[] = [];

  // 다양한 카테고리의 사이즈 처리
  ["SHOES", "CLOTHING", "ACCESSORIES"].forEach((sizeCategory) => {
    if (selectedFilters[sizeCategory]) {
      Array.from(selectedFilters[sizeCategory]).forEach((size) => {
        if (!sizes.includes(size)) {
          sizes.push(size);
        }
      });
    }
  });

  if (sizes.length > 0) {
    payload.sizes = sizes;
  }

  // 가격 범위 처리
  if (selectedFilters.priceRange && selectedFilters.priceRange.size > 0) {
    const priceRange = Array.from(selectedFilters.priceRange)[0];

    // 가격 범위 구문 분석 (형식: "min_max" 또는 "under_X" 또는 "over_X")
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

  // 브랜드 ID 처리
  if (selectedFilters.brands && selectedFilters.brands.size > 0) {
    payload.brandIds = Array.from(selectedFilters.brands)
      .map((id) => parseInt(id, 10))
      .filter((id) => !isNaN(id));
  }

  // 백엔드에서 아직 지원하지 않는 필터들 (주석 처리)

  // 혜택 필터 처리 - 현재 백엔드에서 지원하지 않음
  // if (selectedFilters["혜택"]) {
  //   const benefits = Array.from(selectedFilters["혜택"]);
  //
  //   // 무료배송 옵션 처리
  //   if (benefits.includes("무료배송")) {
  //     payload.freeShipping = true;
  //   }
  //
  //   // 정가이하 옵션 처리
  //   if (benefits.includes("정가이하")) {
  //     payload.isBelowOriginalPrice = true;
  //   }
  // }

  // 할인율 필터 처리 - 현재 백엔드에서 지원하지 않음
  // if (selectedFilters["할인율"]) {
  //   const discounts = Array.from(selectedFilters["할인율"]);
  //
  //   // 할인율 범위를 백엔드 파라미터로 변환
  //   if (discounts.length > 0) {
  //     const discountRanges = discounts.map(range => {
  //       if (range === "30% 이하") return { min: 0, max: 30 };
  //       if (range === "30%~50%") return { min: 30, max: 50 };
  //       if (range === "50% 이상") return { min: 50, max: 100 };
  //       return null;
  //     }).filter(range => range !== null);
  //
  //     if (discountRanges.length > 0) {
  //       // 최소, 최대 할인율 계산
  //       const minDiscount = Math.min(...discountRanges.map(range => range?.min || 0));
  //       const maxDiscount = Math.max(...discountRanges.map(range => range?.max || 0));
  //
  //       payload.minDiscountRate = minDiscount;
  //       payload.maxDiscountRate = maxDiscount;
  //     }
  //   }
  // }

  return payload;
};

/**
 * 브랜드를 첫 글자를 기준으로 그룹화합니다
 * @param brandItems 브랜드 배열
 * @returns 브랜드 그룹 객체
 */
export const groupBrandsByFirstChar = (
  brandItems: BrandItem[]
): GroupedBrands => {
  // 그룹 초기화
  const groups: GroupedBrands = {};

  // 특수문자 및 숫자 그룹 키 정의
  const SPECIAL_CHAR_KEY = "#";
  const NUMBER_KEY = "0-9";

  // 브랜드 정렬 (알파벳순)
  const sortedBrands = [...brandItems].sort((a, b) =>
    a.label.localeCompare(b.label, "en")
  );

  // 각 브랜드 항목에 대해
  sortedBrands.forEach((brand) => {
    if (!brand.label || brand.label.length === 0) return;

    // 첫 글자 가져오기 및 대문자 변환
    const firstChar = brand.label.charAt(0).toUpperCase();
    const charCode = firstChar.charCodeAt(0);

    // 카테고리 결정
    let groupKey: string;

    // 숫자 (0-9)
    if (charCode >= 48 && charCode <= 57) {
      groupKey = NUMBER_KEY;
    }
    // 알파벳 (A-Z)
    else if (charCode >= 65 && charCode <= 90) {
      groupKey = firstChar;
    }
    // 기타 특수문자
    else {
      groupKey = SPECIAL_CHAR_KEY;
    }

    // 그룹이 없다면 생성
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }

    // 그룹에 브랜드 추가 (중복 방지)
    if (!groups[groupKey].some((item) => item.id === brand.id)) {
      groups[groupKey].push(brand);
    }
  });

  return groups;
};

/**
 * 그룹 키를 정렬합니다 (특수문자, 숫자, 알파벳 순)
 * @param groupedBrands 그룹화된 브랜드 객체
 * @returns 정렬된 그룹 키 배열
 */
export const getSortedGroupKeys = (groupedBrands: GroupedBrands): string[] => {
  return Object.keys(groupedBrands).sort((a, b) => {
    if (a === "#") return -1;
    if (b === "#") return 1;
    if (a === "0-9") return -1;
    if (b === "0-9") return 1;
    return a.localeCompare(b);
  });
};
