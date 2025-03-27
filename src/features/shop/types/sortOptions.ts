// 정렬 옵션 타입 정의
export type SortOptionKey =
  | "인기순"
  | "남성 인기순"
  | "여성 인기순"
  | "할인물순"
  | "프리미엄 높은순"
  | "프리미엄 낮은순"
  | "낮은 구매가순"
  | "높은 구매가순"
  | "높은 판매가순"
  | "관심 많은순"
  | "스타일 많은순"
  | "발매일순";

interface SortOptionBase {
  field: string;
  order: "asc" | "desc";
}

interface SortOptionWithGender extends SortOptionBase {
  gender: "MALE" | "FEMALE";
}

type SortOptionValue = SortOptionBase | SortOptionWithGender;

// 정렬 옵션 상수 정의
export const SORT_OPTIONS: Record<SortOptionKey, SortOptionValue> = {
  인기순: {
    field: "interestCount",
    order: "desc",
  },
  "남성 인기순": {
    field: "interestCount",
    order: "desc",
    gender: "MALE",
  },
  "여성 인기순": {
    field: "interestCount",
    order: "desc",
    gender: "FEMALE",
  },
  할인물순: {
    field: "discountRate",
    order: "desc",
  },
  "프리미엄 높은순": {
    field: "premiumRate",
    order: "desc",
  },
  "프리미엄 낮은순": {
    field: "premiumRate",
    order: "asc",
  },
  "낮은 구매가순": {
    field: "purchasePrice",
    order: "asc",
  },
  "높은 구매가순": {
    field: "purchasePrice",
    order: "desc",
  },
  "높은 판매가순": {
    field: "salePrice",
    order: "desc",
  },
  "관심 많은순": {
    field: "interestCount",
    order: "desc",
  },
  "스타일 많은순": {
    field: "styleCount",
    order: "desc",
  },
  발매일순: {
    field: "releaseDate",
    order: "desc",
  },
};

// 정렬 옵션 목록
export const SORT_OPTION_LIST: SortOptionKey[] = [
  "인기순",
  "남성 인기순",
  "여성 인기순",
  "할인물순",
  "프리미엄 높은순",
  "프리미엄 낮은순",
  "낮은 구매가순",
  "높은 구매가순",
  "높은 판매가순",
  "관심 많은순",
  "스타일 많은순",
  "발매일순",
];

// 정렬 옵션 이름으로 API 요청 형식으로 변환
export const formatSortForAPI = (sortName: SortOptionKey | string): string => {
  // 타입 검사: sortName이 유효한 SortOptionKey인지 확인
  if (!SORT_OPTIONS[sortName as SortOptionKey]) {
    return "interestCount,desc"; // 기본값
  }

  const option = SORT_OPTIONS[sortName as SortOptionKey];
  return `${option.field},${option.order}`;
};
