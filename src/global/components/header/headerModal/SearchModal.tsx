// global/header/headerModal/SearchModal.tsx

import React, { useState } from "react";
import "./SearchModal.css";
import { searchAutoComplete } from "../services/searchAutoComplete";

interface SearchModalProps {
  closeModal: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ closeModal }) => {
  const [searchValue, setSearchValue] = useState("");
  const [recentSearches, setRecentSearches] = useState(["아이템 포켓몬"]);
  const recommendedSearches = [
    "스테이지 파이터",
    "나이키 에어포스",
    "검정 패팅",
    "에어포스 카카오",
  ];
  const popularSearches = [
    { text: "팔라스 어그", isNew: false },
    { text: "킨", isNew: false },
    { text: "바지", isNew: false },
    { text: "뉴발", isNew: true },
    { text: "사카이", isNew: true },
  ];
  const popularCollabs = [
    "슈프림 x 조던",
    "플레르 x 베르세르크",
    "나이키 x 녹타",
  ];

  const handleTagClick = (tag: string) => {
    console.log("Search:", tag);
  };
  // (4) 최근 검색어 삭제
  const handleDeleteTag = (tag: string) => {
    setRecentSearches(recentSearches.filter((item) => item !== tag));
  };

  // 자동완성 결과 목록
  const [autoCompleteList, setAutoCompleteList] = useState<string[]>([]);

  // 입력 변경 시
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);

    // 입력이 비어 있으면 자동완성 목록 초기화
    if (!value.trim()) {
      setAutoCompleteList([]);
      return;
    }

    // (2) 별도 함수 호출
    const results = await searchAutoComplete(value);
    setAutoCompleteList(results);
  };

  // 자동완성 아이템 클릭 시
  const handleAutoCompleteClick = (item: string) => {
    setSearchValue(item);
    setAutoCompleteList([]);
  };

  return (
    <div className="full-screen-modal">
      <div className="search-header">
        <input
          className="search-input"
          placeholder="브랜드, 상품, 프로필, 태그 등"
          value={searchValue}
          onChange={handleInputChange}
        />
        <button className="close-button" onClick={closeModal}>
          ✖
        </button>
      </div>

      {/* (5) 자동완성 리스트 */}
      {autoCompleteList.length > 0 && (
        <div className="autocomplete-container">
          {autoCompleteList.map((item, index) => (
            <div
              key={index}
              className="autocomplete-item"
              onClick={() => handleAutoCompleteClick(item)}
            >
              {item}
            </div>
          ))}
        </div>
      )}
      {/* (기존 섹션) 최근 검색어 */}
      <div className="section">
        <h3>
          최근 검색어{" "}
          <button onClick={() => setRecentSearches([])}>지우기</button>
        </h3>
        <div className="tag-container">
          {recentSearches.map((tag) => (
            <div className="tag" key={tag}>
              {tag}
              <button onClick={() => handleDeleteTag(tag)}>✖</button>
            </div>
          ))}
        </div>
      </div>
      {/* 추천 검색어 */}
      <div className="section">
        <h3>추천 검색어</h3>
        <div className="tag-container">
          {recommendedSearches.map((tag) => (
            <div
              className="tag"
              key={tag}
              onClick={() => handleTagClick(tag)}
              style={{ cursor: "pointer" }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
      <div className="section">
        <h3>인기 검색어</h3>
        <div className="grid-container">
          {popularSearches.map((item, index) => (
            <div className="list-item" key={index}>
              {index + 1}. {item.text}
              {item.isNew && <span>NEW</span>}
            </div>
          ))}
        </div>
      </div>
      <div className="section">
        <h3>인기 콜라보</h3>
        <div className="grid-container">
          {popularCollabs.map((text, index) => (
            <div key={index}>
              {index + 1}. {text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
