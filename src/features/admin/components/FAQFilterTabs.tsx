import React from "react";
import { FAQCategory, CategoryKoreanMap } from "../types/faqManagementTypes";
import styles from "./FAQFilterTabs.module.css";

interface FAQFilterTabsProps {
  currentCategory: FAQCategory | null;
  onCategoryChange: (category: FAQCategory | null) => void;
  theme: "light" | "dark";
}

const FAQFilterTabs: React.FC<FAQFilterTabsProps> = ({
  currentCategory,
  onCategoryChange,
  theme,
}) => {
  const categories = Object.values(FAQCategory);

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

export default FAQFilterTabs;
