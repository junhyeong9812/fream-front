import apiClient from "src/global/services/ApiClient";

// ProductSearchDto 타입 정의
interface ProductSearchDto {
  keyword?: string;
  categoryIds?: number[];
  genders?: string[];
  brandIds?: number[];
  collectionIds?: number[];
  colors?: string[];
  sizes?: string[];
  minPrice?: number;
  maxPrice?: number;
  sortOption?: string;
}

// 카테고리별 상품 조회 함수
export const fetchProductsByCategory = async () => {
  try {
    const response = await apiClient.get("/products/query");
    console.log(response.data.content);
    // API 응답을 프론트엔드 포맷으로 변환
    return response.data.content.map((item: any) => ({
      id: item.id, // 추가
      colorName: item.colorName || "default", // 추가
      transaction: item.viewCount || "0",
      img: item.thumbnailUrl,
      backgroundcolor: "#f4f4f4",
      brand: item.brandName,
      name: item.productName,
      price: item.salePrice.toLocaleString(),
      buy: item.buyAvailable,
      coupon: item.hasCoupon,
      earn: item.hasPoints,
    }));
  } catch (error) {
    console.error("상품 조회 실패:", error);
    return "no";
  }
};
// export const fetchProductsByCategory = async (categoryType: string) => {
//   try {
//     // 카테고리별 검색 조건 설정
//     const searchParams: ProductSearchDto =
//       getSearchParamsByCategory(categoryType);

//     const response = await apiClient.get("/products/query", {
//       params: searchParams,
//     });

//     // API 응답을 프론트엔드 포맷으로 변환
//     return response.data.content.map((item: any) => ({
//       transaction: item.viewCount || "0",
//       img: item.thumbnailUrl,
//       backgroundcolor: "#f4f4f4",
//       brand: item.brandName,
//       name: item.productName,
//       price: item.salePrice.toLocaleString(),
//       buy: item.buyAvailable,
//       coupon: item.hasCoupon,
//       earn: item.hasPoints,
//     }));
//   } catch (error) {
//     console.error("상품 조회 실패:", error);
//     return "no";
//   }
// };

// 카테고리별 검색 조건 설정
const getSearchParamsByCategory = (categoryType: string): ProductSearchDto => {
  switch (categoryType) {
    case "justDropped":
      return {
        categoryIds: [1], // Just Dropped 카테고리 ID
        sortOption: "LATEST",
      };

    case "mostPopular":
      return {
        sortOption: "POPULARITY",
      };

    case "muffler":
      return {
        categoryIds: [2], // 목도리 카테고리 ID
        keyword: "목도리",
      };

    case "outdoor":
      return {
        categoryIds: [3], // 아웃도어 카테고리 ID
        keyword: "아웃도어",
      };

    case "luxuryWish":
      return {
        categoryIds: [4], // 럭셔리 카테고리 ID
        sortOption: "WISH_COUNT",
      };

    // 나머지 카테고리들에 대한 조건 추가...

    default:
      return {};
  }
};
