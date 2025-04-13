import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import styles from "./UserSearchBar.module.css";

interface UserSearchBarProps {
  onSearch: (keyword: string) => void;
  theme: string;
}

const UserSearchBar: React.FC<UserSearchBarProps> = ({ onSearch, theme }) => {
  const [keyword, setKeyword] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(keyword.trim());
  };

  return (
    <form className={styles.searchBar} onSubmit={handleSubmit}>
      <div
        className={`${styles.searchInputContainer} ${
          theme === "dark" ? styles.dark : ""
        }`}
      >
        <input
          type="text"
          placeholder="이메일, 전화번호, 프로필명으로 검색"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton}>
          <FiSearch />
        </button>
      </div>
    </form>
  );
};

export default UserSearchBar;
