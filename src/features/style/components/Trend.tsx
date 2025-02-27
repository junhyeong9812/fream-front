import React, { useEffect, useState } from "react";
import styles from "./Trend.module.css";
import StyleButton from "./StyleButton";
import SortButton from "./SortButton";
import { StyleResponseDto } from "../types/styleTypes";
import StylePostItem from "./StylePostItem";
import Masonry from "react-masonry-css";
import styleService from "../services/styleService";

// 브랜드 데이터 타입 정의
interface Brand {
  id: number;
  value: string;
  label: string;
}

// 브랜드 목록
const brands: Brand[] = [
  { id: 5, value: "Stussy", label: "Stussy" },
  { id: 1, value: "Nike", label: "Nike" },
  { id: 7, value: "NewJeans", label: "NewJeans" },
  { id: 2, value: "New Balance", label: "New Balance" },
  { id: 4, value: "Jordan", label: "Jordan" },
  { id: 6, value: "IAB Studio", label: "IAB Studio" },
  { id: 3, value: "Adidas", label: "Adidas" },
];

// 필터링 타입 정의
type FilterType = "category" | "brand";

const Trend: React.FC = () => {
  const [styleItems, setStyleItems] = useState<StyleResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const [activeFilterType, setActiveFilterType] =
    useState<FilterType>("category");
  const [activeCategory, setActiveCategory] = useState<string>("전체");
  const [activeBrand, setActiveBrand] = useState<string>("전체");
  const [activeSort, setActiveSort] = useState<string>("인기순");

  // 카테고리 목록
  const categories = [
    "전체",
    "스트릿",
    "클래식",
    "캐주얼",
    "스포츠",
    "아메카지",
    "미니멀",
    "레트로",
    "빈티지",
    "가을룩",
    "겨울룩",
  ];

  // 브랜드 목록에 "전체" 추가
  const brandOptions = ["전체", ...brands.map((brand) => brand.label)];

  const breakpointColumns = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  // 필터 타입 변경 핸들러
  const handleFilterTypeChange = (type: FilterType) => {
    setActiveFilterType(type);
    resetFilters();
  };

  // 필터 초기화
  const resetFilters = () => {
    setPage(0);
    setStyleItems([]);
    setActiveCategory("전체");
    setActiveBrand("전체");
    fetchStyles(0);
  };

  // 카테고리 클릭 핸들러
  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    setPage(0);
    setStyleItems([]);
    fetchStyles(0, category, activeBrand, activeSort);
  };

  // 브랜드 클릭 핸들러
  const handleBrandClick = (brand: string) => {
    setActiveBrand(brand);
    setPage(0);
    setStyleItems([]);
    fetchStyles(0, activeCategory, brand, activeSort);
  };

  // 정렬 변경 핸들러
  const handleSortChange = (sortOption: string) => {
    setActiveSort(sortOption);
    setPage(0);
    setStyleItems([]);
    fetchStyles(0, activeCategory, activeBrand, sortOption);
  };

  // 데이터 가져오기 함수
  const fetchStyles = async (
    pageNum: number,
    category: string = activeCategory,
    brand: string = activeBrand,
    sort: string = activeSort
  ) => {
    setIsLoading(true);
    try {
      // 필터 파라미터 준비
      const filterParams: Record<string, any> = {};

      // 정렬 파라미터 설정
      if (sort === "인기순") {
        filterParams.sortBy = "popular";
      }

      // 카테고리 파라미터 설정 (실제 API에 맞게 조정 필요)
      if (category !== "전체") {
        // categoryId나 다른 형식으로 변환이 필요할 수 있음
        // 현재는 예시로 소문자 변환만 적용
        filterParams.categoryName = category.toLowerCase();
      }

      // 브랜드 파라미터 설정
      if (brand !== "전체") {
        filterParams.brandName = brand;
      }

      // API 호출
      const response = await styleService.getStyles(pageNum, 10, filterParams);

      setStyleItems((prev) =>
        pageNum === 0 ? response.content : [...prev, ...response.content]
      );
      setHasMore(!response.last);
    } catch (error) {
      console.error("트렌드 스타일 로딩 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    fetchStyles(0);
  }, []);

  // 무한 스크롤 구현
  useEffect(() => {
    const handleScroll = () => {
      if (isLoading || !hasMore) return;

      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      const scrollPercentage =
        (scrollTop / (scrollHeight - clientHeight)) * 100;

      if (scrollPercentage > 75) {
        // 75% 스크롤 시 다음 페이지 로드
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading, hasMore]);

  // 페이지 변경 시 데이터 로드
  useEffect(() => {
    if (page > 0) {
      fetchStyles(page);
    }
  }, [page]);

  // 필터 타입에 따른 버튼 목록 렌더링
  const renderFilterButtons = () => {
    const items = activeFilterType === "category" ? categories : brandOptions;
    const activeItem =
      activeFilterType === "category" ? activeCategory : activeBrand;
    const handleClick =
      activeFilterType === "category" ? handleCategoryClick : handleBrandClick;

    return items.map((item) => (
      <StyleButton
        key={item}
        label={item}
        isActive={activeItem === item}
        onClick={() => handleClick(item)}
      />
    ));
  };

  const renderContent = () => {
    if (isLoading && styleItems.length === 0) {
      return <div className={styles.loadingState}>로딩 중...</div>;
    }

    if (!styleItems.length && !isLoading) {
      return <div className={styles.emptyState}>등록된 스타일이 없습니다.</div>;
    }

    return (
      <>
        <Masonry
          breakpointCols={breakpointColumns}
          className={styles.masonryGrid}
          columnClassName={styles.masonryGridColumn}
        >
          {styleItems.map((style) => (
            <StylePostItem key={style.id} {...style} />
          ))}
        </Masonry>
        {isLoading && <div className={styles.loadingState}>로딩 중...</div>}
        {!hasMore && styleItems.length > 0 && (
          <div className={styles.emptyState}>더 이상 스타일이 없습니다.</div>
        )}
      </>
    );
  };

  return (
    <div className={styles.container}>
      {/* 필터 타입 선택 버튼 */}
      <div className={styles.filterTypeContainer}>
        <button
          className={`${styles.filterTypeButton} ${
            activeFilterType === "category" ? styles.active : ""
          }`}
          onClick={() => handleFilterTypeChange("category")}
        >
          카테고리
        </button>
        <button
          className={`${styles.filterTypeButton} ${
            activeFilterType === "brand" ? styles.active : ""
          }`}
          onClick={() => handleFilterTypeChange("brand")}
        >
          브랜드
        </button>
      </div>

      {/* 필터 버튼 그룹 */}
      <div className={styles.subgroupContainer}>
        <div className={styles.filterChipGroup}>
          <div className={styles.filterGroup}>{renderFilterButtons()}</div>
        </div>
      </div>

      {/* 정렬 버튼 */}
      <div className={styles.sortingContainer}>
        <SortButton
          options={["인기순", "최신순"]}
          activeOption={activeSort}
          onSelect={handleSortChange}
        />
      </div>

      {/* 콘텐츠 영역 */}
      <div className={styles.contentContainer}>{renderContent()}</div>
    </div>
  );
};

export default Trend;
