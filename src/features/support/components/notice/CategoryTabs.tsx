// CategoryTabs 컴포넌트
import React from "react";
import styled from "styled-components";

// 테이블 스타일
const TableContainer = styled.div`
  margin-bottom: 20px;
`;

const Table = styled.table`
  border: 0;
  border-collapse: collapse;
  border-spacing: 0;
  table-layout: fixed;
  width: 100%;

  tbody {
    display: table-row-group;
    vertical-align: middle;
    border-color: inherit;
  }

  tr {
    display: table-row;
    vertical-align: inherit;
    border-color: inherit;
  }

  td {
    text-align: center;
    border: 1px solid #ebebeb;
    border-right: 1px solid #ebebeb;
    font-size: 16px;
    height: 60px;
    line-height: 60px;
    cursor: pointer;

    span {
      color: rgba(34, 34, 34, 0.5); /* 기본 회색 */
    }
  }

  td.category_on {
    font-weight: bold;

    span {
      color: #000; /* 선택된 경우 검정색 */
    }
  }

  td:hover {
    background-color: #eaeaea; /* 호버 효과 */
  }
`;

const CategoryLink = styled.a`
  align-items: center;
  display: flex;
  height: 100%;
  text-decoration: none;
`;

const CategoryText = styled.span`
  margin: 0 auto;
  overflow: hidden;
  padding-left: 18px;
  padding-right: 18px;
  word-break: keep-all;
`;

interface CategoryTabsProps {
  categories: string[]; // 카테고리 배열
  activeCategory: string; // 현재 선택된 카테고리
  onCategoryChange: (category: string) => void; // 카테고리 변경 핸들러
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
}) => {
  const rows = Math.ceil(categories.length / 3);

  // 카테고리를 3개씩 분할
  const splitCategories = Array.from({ length: rows }, (_, rowIndex) =>
    categories.slice(rowIndex * 3, rowIndex * 3 + 3)
  );

  return (
    <TableContainer>
      <Table>
        <tbody>
          {splitCategories.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((category, colIndex) => (
                <td
                  key={colIndex}
                  className={
                    category === activeCategory ? "category_on" : "category"
                  }
                  onClick={() => onCategoryChange(category)}
                >
                  <CategoryLink href="#">
                    <CategoryText>{category}</CategoryText>
                  </CategoryLink>
                </td>
              ))}
              {/* 빈 칸 채우기 */}
              {row.length < 3 &&
                Array.from({ length: 3 - row.length }).map((_, emptyIndex) => (
                  <td key={`empty-${emptyIndex}`} className="category"></td>
                ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
};

export default CategoryTabs;
