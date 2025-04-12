import React, { useState, useEffect } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { BrandResponseDto } from "../types/brandCollectionTypes";
import { EventSearchDto } from "../types/eventTypes";
import styles from "../styles/EventFilter.module.css";
import { BrandService } from "../services/BrandService";

interface EventFilterProps {
  onApplyFilter: (filter: EventSearchDto) => void;
  theme: string;
}

const EventFilter: React.FC<EventFilterProps> = ({ onApplyFilter, theme }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [brands, setBrands] = useState<BrandResponseDto[]>([]);
  const [filter, setFilter] = useState<EventSearchDto>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 브랜드 데이터 로드
  useEffect(() => {
    const loadBrands = async () => {
      setIsLoading(true);
      try {
        const brandData = await BrandService.getAllBrands();
        setBrands(brandData);
      } catch (error) {
        console.error("브랜드 로드 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBrands();
  }, []);

  // 필터 변경 핸들러
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checkbox = e.target as HTMLInputElement;
      setFilter({
        ...filter,
        [name]: checkbox.checked,
      });
    } else if (value === "") {
      // 값이 비어있으면 해당 필터 제거
      const updatedFilter = { ...filter };
      delete updatedFilter[name as keyof EventSearchDto];
      setFilter(updatedFilter);
    } else {
      setFilter({
        ...filter,
        [name]: value,
      });
    }
  };

  // 필터 적용 핸들러
  const handleApplyFilter = () => {
    onApplyFilter(filter);
  };

  // 필터 초기화 핸들러
  const handleResetFilter = () => {
    setFilter({});
    onApplyFilter({});
  };

  // 필터 확장/축소 토글
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`${styles.filterContainer} ${
        theme === "dark" ? styles.dark : ""
      }`}
    >
      <div className={styles.filterHeader}>
        <h3 className={styles.filterTitle}>이벤트 필터</h3>
        <button
          className={styles.filterToggleButton}
          onClick={toggleExpand}
          type="button"
        >
          {isExpanded ? (
            <>
              <FiChevronUp /> 필터 접기
            </>
          ) : (
            <>
              <FiChevronDown /> 필터 펼치기
            </>
          )}
        </button>
      </div>

      {isExpanded && (
        <>
          <div className={styles.filterContent}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>브랜드</label>
              <select
                name="brandId"
                className={styles.filterSelect}
                value={filter.brandId || ""}
                onChange={handleFilterChange}
                disabled={isLoading}
              >
                <option value="">모든 브랜드</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>상태</label>
              <select
                name="isActive"
                className={styles.filterSelect}
                value={
                  filter.isActive !== undefined
                    ? filter.isActive.toString()
                    : ""
                }
                onChange={handleFilterChange}
              >
                <option value="">모든 상태</option>
                <option value="true">진행 중</option>
                <option value="false">종료/예정</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>시작일 이후</label>
              <input
                type="date"
                name="startDate"
                className={styles.filterInput}
                value={filter.startDate || ""}
                onChange={handleFilterChange}
              />
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>종료일 이전</label>
              <input
                type="date"
                name="endDate"
                className={styles.filterInput}
                value={filter.endDate || ""}
                onChange={handleFilterChange}
              />
            </div>
          </div>

          <div className={styles.filterButtons}>
            <button
              className={styles.resetFilterButton}
              onClick={handleResetFilter}
              type="button"
            >
              초기화
            </button>
            <button
              className={styles.applyFilterButton}
              onClick={handleApplyFilter}
              type="button"
            >
              필터 적용
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default EventFilter;
