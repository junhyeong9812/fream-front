import React, { useState, useEffect, useRef } from "react";
import { ProductService } from "../services/productManagementService";
import styles from "./ProductSearchBar.module.css";

interface ProductSearchBarProps {
  onSearch: (keyword: string) => void;
  theme: "light" | "dark";
}

const ProductSearchBar: React.FC<ProductSearchBarProps> = ({
  onSearch,
  theme,
}) => {
  const [keyword, setKeyword] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] =
    useState<number>(-1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // 검색어 변경 시 자동완성 요청
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (keyword.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const result = await ProductService.autocompleteProducts(keyword);
        setSuggestions(result);
      } catch (error) {
        console.error("자동완성 데이터 로드 실패:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [keyword]);

  // 외부 클릭 시 자동완성 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 폼 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(keyword.trim());
    setShowSuggestions(false);
  };

  // 키워드 입력 핸들러
  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
    setSelectedSuggestionIndex(-1);
    setShowSuggestions(true);
  };

  // 자동완성 항목 클릭 핸들러
  const handleSuggestionClick = (suggestion: string) => {
    setKeyword(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  // 검색창 클리어 핸들러
  const handleClear = () => {
    setKeyword("");
    onSearch("");
    setShowSuggestions(false);
  };

  // 키보드 네비게이션 핸들러
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    // 화살표 아래 (다음 항목으로)
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    }
    // 화살표 위 (이전 항목으로)
    else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : prev));
    }
    // Enter (선택 항목 적용)
    else if (e.key === "Enter" && selectedSuggestionIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[selectedSuggestionIndex]);
    }
    // Escape (자동완성 닫기)
    else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  // 입력창 포커스 핸들러
  const handleFocus = () => {
    if (keyword.trim().length >= 2) {
      setShowSuggestions(true);
    }
  };

  return (
    <div
      ref={searchRef}
      className={`${styles.searchBar} ${theme === "dark" ? styles.dark : ""}`}
    >
      <form onSubmit={handleSubmit} className={styles.searchForm}>
        <input
          type="text"
          value={keyword}
          onChange={handleKeywordChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          placeholder="상품명, 브랜드, 컬렉션, 모델번호 등으로 검색"
          className={styles.searchInput}
          autoComplete="off"
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

      {/* 자동완성 목록 */}
      {showSuggestions && suggestions.length > 0 && (
        <div className={styles.autocompleteContainer}>
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className={`${styles.autocompleteItem} ${
                selectedSuggestionIndex === index ? styles.selected : ""
              }`}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductSearchBar;
