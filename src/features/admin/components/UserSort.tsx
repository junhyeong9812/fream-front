import React from "react";
import { FiChevronDown } from "react-icons/fi";
import { SortOption } from "../types/userManagementTypes";
import styles from "./UserSort.module.css";

interface UserSortProps {
  onSort: (sortOption: SortOption) => void;
  currentSort: SortOption;
  theme: string;
}

const UserSort: React.FC<UserSortProps> = ({ onSort, currentSort, theme }) => {
  // Sort options
  const sortOptions = [
    { label: "가입일 최신순", field: "createdDate", order: "desc" },
    { label: "가입일 오래된순", field: "createdDate", order: "asc" },
    { label: "이름 오름차순", field: "profileName", order: "asc" },
    { label: "이름 내림차순", field: "profileName", order: "desc" },
    { label: "구매액 높은순", field: "totalPurchaseAmount", order: "desc" },
    { label: "포인트 높은순", field: "totalPoints", order: "desc" },
  ] as const;

  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [field, order] = e.target.value.split(",");
    onSort({ field, order: order as "asc" | "desc" });
  };

  // Get current sort value
  const getCurrentSortValue = () => {
    return `${currentSort.field},${currentSort.order}`;
  };

  return (
    <div
      className={`${styles.sortContainer} ${
        theme === "dark" ? styles.dark : ""
      }`}
    >
      <div className={styles.sortWrapper}>
        <label htmlFor="user-sort" className={styles.sortLabel}>
          정렬:
        </label>
        <div className={styles.selectWrapper}>
          <select
            id="user-sort"
            value={getCurrentSortValue()}
            onChange={handleSortChange}
            className={styles.sortSelect}
          >
            {sortOptions.map((option, index) => (
              <option key={index} value={`${option.field},${option.order}`}>
                {option.label}
              </option>
            ))}
          </select>
          <FiChevronDown className={styles.selectIcon} />
        </div>
      </div>
    </div>
  );
};

export default UserSort;
