// SearchBar 컴포넌트
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FaTimes } from "react-icons/fa";

// 검색창 스타일
const SearchContainer = styled.div`
  position: relative;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  background-color: #f4f4f4;
  border-radius: 8px;
  font-size: 15px;
  height: 48px;
  padding: 15px 43px 15px 12px;
  width: 100%;
  border: none;
`;

const ClearButton = styled.button`
  position: absolute;
  right: 14px;
  top: 14px;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (inputValue.trim() === "") {
        onSearch("");
      }
      onSearch(inputValue.trim());
    }
  };

  const handleClear = () => {
    setInputValue("");
    onSearch("");
  };

  return (
    <SearchContainer>
      <SearchInput
        type="text"
        placeholder="검색"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      {inputValue && (
        <ClearButton onClick={handleClear}>
          <FaTimes size={20} color="#ccc" />
        </ClearButton>
      )}
    </SearchContainer>
  );
};

export default SearchBar;
