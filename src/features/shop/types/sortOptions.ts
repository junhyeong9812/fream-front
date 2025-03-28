// 백엔드 SortOption 클래스와 일치하는 타입 정의
export interface SortOption {
  field: string;
  order: string;
}

// 백엔드 지원 정렬 옵션에 맞는 키 정의
export type SortOptionKey = "인기순" | "최신순" | "가격 낮은순" | "가격 높은순";

// 백엔드 지원 정렬 옵션으로 제한된 상수 정의
export const SORT_OPTIONS: Record<SortOptionKey, SortOption> = {
  인기순: {
    field: "interestCount",
    order: "desc",
  },
  최신순: {
    field: "releaseDate",
    order: "desc",
  },
  "가격 낮은순": {
    field: "minPrice",
    order: "asc",
  },
  "가격 높은순": {
    field: "minPrice",
    order: "desc",
  },
};

// 정렬 옵션 목록
export const SORT_OPTION_LIST: SortOptionKey[] = [
  "인기순",
  "최신순",
  "가격 낮은순",
  "가격 높은순",
];

// 정렬 옵션 이름으로 SortOption 객체 반환
export const getSortOption = (sortName: SortOptionKey | string): SortOption => {
  // 타입 검사: sortName이 유효한 SortOptionKey인지 확인
  if (!SORT_OPTIONS[sortName as SortOptionKey]) {
    return SORT_OPTIONS["인기순"]; // 기본값
  }

  return SORT_OPTIONS[sortName as SortOptionKey];
};
