import React, { useState } from "react";
import styles from "./FAQSearchBar.module.css";

interface FAQSearchBarProps {
  onSearch: (keyword: string) => void;
  theme: "light" | "dark";
}

const FAQSearchBar: React.FC<FAQSearchBarProps> = ({ onSearch, theme }) => {
  const [keyword, setKeyword] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(keyword.trim());
  };

  const handleClear = () => {
    setKeyword("");
    onSearch("");
  };

  return (
    <div
      className={`${styles.searchBar} ${theme === "dark" ? styles.dark : ""}`}
    >
      <form onSubmit={handleSubmit} className={styles.searchForm}>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="FAQ 검색"
          className={styles.searchInput}
        />
        {keyword && (
          <button
            type="button"
            onClick={handleClear}
            className={styles.clearButton}
            aria-label="검색어 지우기"
          >
            ✕
          </button>
        )}
        <button type="submit" className={styles.searchButton}>
          검색
        </button>
      </form>
    </div>
  );
};

export default FAQSearchBar;
