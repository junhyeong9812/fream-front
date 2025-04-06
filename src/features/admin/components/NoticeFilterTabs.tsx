import React from "react";
import {
  NoticeCategory,
  CategoryKoreanMap,
} from "../types/noticeManagementTypes";
import styles from "./NoticeFilterTabs.module.css";

interface NoticeFilterTabsProps {
  currentCategory: NoticeCategory | null;
  onCategoryChange: (category: NoticeCategory | null) => void;
  theme: "light" | "dark";
}

const NoticeFilterTabs: React.FC<NoticeFilterTabsProps> = ({
  currentCategory,
  onCategoryChange,
  theme,
}) => {
  const categories = Object.values(NoticeCategory);

  return (
    <div
      className={`${styles.filterTabs} ${theme === "dark" ? styles.dark : ""}`}
    >
      <button
        className={`${styles.tabButton} ${
          currentCategory === null ? styles.active : ""
        }`}
        onClick={() => onCategoryChange(null)}
      >
        전체
      </button>

      {categories.map((category) => (
        <button
          key={category}
          className={`${styles.tabButton} ${
            currentCategory === category ? styles.active : ""
          }`}
          onClick={() => onCategoryChange(category)}
        >
          {CategoryKoreanMap[category]}
        </button>
      ))}
    </div>
  );
};

export default NoticeFilterTabs;
