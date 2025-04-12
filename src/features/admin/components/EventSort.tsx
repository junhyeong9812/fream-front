import React from "react";
import { SortOption } from "../types/eventTypes";
import styles from "../styles/EventSort.module.css";

interface EventSortProps {
  onSort: (sortOption: SortOption) => void;
  currentSort: SortOption;
  totalElements: number;
  theme: string;
}

const EventSort: React.FC<EventSortProps> = ({
  onSort,
  currentSort,
  totalElements,
  theme,
}) => {
  // 정렬 변경 핸들러
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    // 필드와 순서 분리
    const [field, order] = value.split("_");

    onSort({
      field,
      order: order as "asc" | "desc",
    });
  };

  // 현재 정렬 옵션 문자열 생성
  const getCurrentSortValue = () => {
    return `${currentSort.field}_${currentSort.order}`;
  };

  return (
    <div
      className={`${styles.sortContainer} ${
        theme === "dark" ? styles.dark : ""
      }`}
    >
      <div className={styles.resultCount}>
        총 {totalElements.toLocaleString()}개의 이벤트
      </div>

      <div className={styles.sortOptions}>
        <span className={styles.sortLabel}>정렬:</span>
        <select
          className={styles.sortSelect}
          onChange={handleSortChange}
          value={getCurrentSortValue()}
        >
          <option value="id_desc">최신 등록순</option>
          <option value="id_asc">오래된순</option>
          <option value="title_asc">제목 오름차순</option>
          <option value="title_desc">제목 내림차순</option>
          <option value="startDate_desc">시작일 최신순</option>
          <option value="startDate_asc">시작일 오래된순</option>
          <option value="endDate_desc">종료일 최신순</option>
          <option value="endDate_asc">종료일 오래된순</option>
        </select>
      </div>
    </div>
  );
};

export default EventSort;
