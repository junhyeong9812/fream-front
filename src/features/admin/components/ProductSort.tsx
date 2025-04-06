import React from "react";
import { SortOption } from "../types/productManagementTypes";
import styles from "./ProductSort.module.css";

// 정렬 옵션 타입
type SortOptionItem = {
  label: string;
  field: string;
  order: "asc" | "desc";
};

interface ProductSortProps {
  onSort: (sortOption: SortOption) => void;
  currentSort?: SortOption;
  theme: "light" | "dark";
}

const ProductSort: React.FC<ProductSortProps> = ({
  onSort,
  currentSort,
  theme,
}) => {
  // 정렬 옵션 목록
  const sortOptions: SortOptionItem[] = [
    { label: "관심 많은순", field: "interestCount", order: "desc" },
    { label: "최신순", field: "releaseDate", order: "desc" },
    { label: "가격 낮은순", field: "price", order: "asc" },
    { label: "가격 높은순", field: "price", order: "desc" },
  ];

  // 현재 선택된 정렬 옵션 확인
  const isActive = (option: SortOptionItem) => {
    if (!currentSort) {
      // 기본값: 관심 많은순
      return option.field === "interestCount" && option.order === "desc";
    }
    return (
      currentSort.field === option.field && currentSort.order === option.order
    );
  };

  // 정렬 옵션 클릭 핸들러
  const handleSortClick = (option: SortOptionItem) => {
    onSort({
      field: option.field,
      order: option.order,
    });
  };

  return (
    <div
      className={`${styles.sortContainer} ${
        theme === "dark" ? styles.dark : ""
      }`}
    >
      <span className={styles.sortLabel}>정렬:</span>
      <div className={styles.sortOptions}>
        {sortOptions.map((option, index) => (
          <button
            key={index}
            className={`${styles.sortOption} ${
              isActive(option) ? styles.active : ""
            }`}
            onClick={() => handleSortClick(option)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductSort;
