import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import styles from "./EventSearchBar.module.css";

interface EventSearchBarProps {
  onSearch: (keyword: string) => void;
  theme: string;
}

const EventSearchBar: React.FC<EventSearchBarProps> = ({ onSearch, theme }) => {
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchKeyword.trim());
  };

  return (
    <form className={styles.searchBar} onSubmit={handleSubmit}>
      <input
        type="text"
        className={styles.searchInput}
        placeholder="이벤트 제목 검색..."
        value={searchKeyword}
        onChange={handleSearchChange}
      />
      <button type="submit" className={styles.searchButton}>
        <FiSearch /> 검색
      </button>
    </form>
  );
};

export default EventSearchBar;
