import apiClient from "src/global/services/ApiClient";

// export const fetchShopData = async (keyword?: string) => {
//   try {
//     const params = new URLSearchParams();
//     if (keyword) {
//       params.append("keyword", keyword);
//     }
//     const queryString = params.toString();
//     const url = `/products/query${queryString ? `?${queryString}` : ""}`;

//     const response = await apiClient.get(url);
//     return response.data.content;

//     // const response = await apiClient.get(
//     //   `/products/query?${params.toString()}`
//     // );
//     // return response.data.content;
//   } catch (error) {
//     console.error("상품 조회 실패:", error);
//     return "no";
//   }
// };




// export const fetchShopData = async (
//   keyword?: string,
//   categories?: string[],
//   gender?: string | null,
//   colors?: string[],
//   priceRange?: string | null,
//   sizes?: string[],
//   brands?: string[]
// ) => {
//   try {
//     const params = new URLSearchParams();
    
//     params.append("brandId", "1"); // 브랜드 ID 추가
//     params.append("categoryId", "2");

//     // const params = new URLSearchParams({
//     //   brandId: "1",
//     //   categoryId: "2"
//     // });

//     // 키워드 추가
//     if (keyword) {
//       params.append("keyword", keyword);
//     }

//     // 필터 추가
//     if (categories && categories.length > 0) {
//       categories.forEach((c) => params.append("categoryId", c));
//     }
//     if (gender) {
//       params.append("gender", gender);
//     }
//     if (colors && colors.length > 0) {
//       colors.forEach((c) => params.append("color", c));
//     }
//     if (priceRange) {
//       params.append("priceRange", priceRange);
//     }
//     if (sizes && sizes.length > 0) {
//       sizes.forEach((s) => params.append("size", s));
//     }
//     if (brands && brands.length > 0) {
//       brands.forEach((b) => params.append("brandId", b));
//     }

//     // API 요청
//     const url = `/products/query${params.toString() ? `?${params.toString()}` : ""}`;
//     const response = await apiClient.get(url);

//     // 응답 데이터 처리
//     if (response.data && response.data.content) {
//       return response.data.content;
//     } else {
//       console.error("fetchShopData 에러: 예상 데이터 구조가 아님", response.data);
//       return [];
//     }
//   } catch (error) {
//     console.error("fetchShopData 에러:", error);
//     return [];
//   }
// };

export const fetchShopData = async (
  keyword?: string,
  categories?: string[],
  gender?: string | null,
  colors?: string[],
  priceRange?: string | null,
  sizes?: string[],
  brands?: string[],
  collections?: string[]
) => {
  try {
    const params = new URLSearchParams();

    if (keyword) {
      params.append("keyword", keyword);
    }

    if (categories && categories.length > 0) {
      params.append("categoryIds", categories.join(",")); 
    }

    if (brands && brands.length > 0) {
      params.append("brandIds", brands.join(",")); 
    }

    if (collections && collections.length > 0) {
      params.append("collectionIds", collections.join(",")); 
    }

    if (gender) {
      params.append("genders", gender.toUpperCase());
    }

    if (colors && colors.length > 0) {
      params.append("colors", colors.map((c) => c.toUpperCase()).join(","));
    }

    if (sizes && sizes.length > 0) {
      params.append("sizes", sizes.join(","));
    }

    if (priceRange) {
      params.append("priceRange", priceRange);
    }

    const url = `/products/query${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await apiClient.get(url);

    if (response.data && response.data.content) {
      return response.data.content;
    } else {
      console.error("fetchShopData 에러: 예상 데이터 구조가 아님", response.data);
      return [];
    }
  } catch (error) {
    console.error("fetchShopData 에러:", error);
    return [];
  }
};


// export const fetchShopData = async (
//   keyword?: string,
//   categories?: string[],
//   gender?: string | null,
//   colors?: string[],
//   priceRange?: string | null,
//   sizes?: string[],
//   brands?: string[]
// ) => {
//   try {
//     const params = new URLSearchParams();

//     if (keyword) params.append("keyword", keyword);
//     if (categories && categories.length > 0)
//       categories.forEach((c) => params.append("category", c));
//     if (gender) params.append("gender", gender);
//     if (colors && colors.length > 0) colors.forEach((c) => params.append("color", c));
//     if (priceRange) params.append("priceRange", priceRange);
//     if (sizes && sizes.length > 0) sizes.forEach((s) => params.append("size", s));
//     if (brands && brands.length > 0) brands.forEach((b) => params.append("brand", b));

//     const response = await fetch(`/products/query${params.toString()}`);
//     const data = await response.json();

//     if (data && data.content) {
//       return data.content;
//     } else {
//       console.error("fetchShopData 에러: 예상 데이터 구조가 아님", data);
//       return [];
//     }
//   } catch (error) {
//     console.error("fetchShopData 에러:", error);
//     return [];
//   }
// };
