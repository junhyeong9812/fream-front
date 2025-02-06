import React, { useState } from "react";
import styled from "styled-components";
import StyleButton from "./StyleButton"; // StyleButton 컴포넌트 import
import SortButton from "./SortButton"; // SortButton 컴포넌트 import
import { trendCategories } from "../services/styleDummy"; // 더미 데이터 import

const SubgroupContainer = styled.div`
  padding: 16px 0;
`;

const FilterChipGroup = styled.div`
  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: none;
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  scrollbar-width: none;
  width: 100%;

  /* 스크롤바 숨김 */
  &::-webkit-scrollbar {
    display: none;
  }
`;

const FilterGroup = styled.div`
  flex: 1;
  padding-left: 40px;
  padding-right: 40px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px 8px;
`;

const SortButtonContainer = styled.div`
  padding-left: 40px;
  padding-right: 40px;
`;

const ContentContainer = styled.div`
  padding: 16px 40px; /* 콘텐츠 컨테이너 스타일 */
`;

const Trend: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("전체");
  const [activeSort, setActiveSort] = useState<string>("인기순"); // 정렬 상태

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    // 추가 로직: 카테고리 클릭 시 데이터를 필터링하거나 API 호출
  };

  const handleSortChange = (sortOption: string) => {
    setActiveSort(sortOption);
    // 추가 로직: 정렬 변경 시 데이터 정렬
  };

  return (
    <div>
      <SubgroupContainer>
        <FilterChipGroup>
          <FilterGroup>
            {trendCategories.map((category) => (
              <StyleButton
                key={category}
                label={category}
                isActive={activeCategory === category}
                onClick={() => handleCategoryClick(category)}
              />
            ))}
          </FilterGroup>
        </FilterChipGroup>
      </SubgroupContainer>

      {/* SortButton 렌더링 */}
      <SortButtonContainer>
        <SortButton
          options={["인기순", "최신순"]}
          activeOption={activeSort}
          onSelect={handleSortChange}
        />
      </SortButtonContainer>

      {/* 트렌드 콘텐츠 */}
      <ContentContainer>
        <p>여기에 트렌드 탭의 콘텐츠를 추가하세요.</p>
        <p>현재 선택된 카테고리: {activeCategory}</p>
        <p>현재 정렬 기준: {activeSort}</p>
      </ContentContainer>
    </div>
  );
};

export default Trend;
