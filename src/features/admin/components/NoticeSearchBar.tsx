import React, { useState } from "react";
import styles from "./NoticeSearchBar.module.css";

interface NoticeSearchBarProps {
  onSearch: (keyword: string) => void;
  theme: "light" | "dark";
}

const NoticeSearchBar: React.FC<NoticeSearchBarProps> = ({
  onSearch,
  theme,
}) => {
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
      className={`${styles.searchBar} ${
        theme === "dark" ? styles.darkSearchBar : ""
      }`}
    >
      <form onSubmit={handleSubmit} className={styles.searchForm}>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="공지사항 검색"
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

export default NoticeSearchBar;
