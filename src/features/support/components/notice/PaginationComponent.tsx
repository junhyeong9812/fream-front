import React from "react";
import styled from "styled-components";

const Pagination = styled.div`
  padding: 28px 0;
  text-align: center;

  button {
    margin: 0 5px;
    padding: 5px 10px;
    border: none;
    background-color: #fff;
    border: 1px solid #ddd;
    cursor: pointer;

    &.active {
      font-weight: bold;
      background-color: #000;
      color: #fff;
    }

    &:hover {
      background-color: #f4f4f4;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;

      &:hover {
        background-color: #fff;
      }
    }
  }
`;

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationComponent: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // 페이지 그룹 계산 (5개씩 그룹화)
  const currentGroup = Math.floor((currentPage - 1) / 5);
  const startPage = currentGroup * 5 + 1;
  const endPage = Math.min(startPage + 4, totalPages);

  // 페이지 범위 배열 생성
  const pageRange = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return (
    <Pagination>
      {/* 처음 페이지로 */}
      <button onClick={() => onPageChange(1)} disabled={currentPage === 1}>
        &laquo;
      </button>

      {/* 이전 페이지로 */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &lt;
      </button>

      {/* 페이지 번호 */}
      {pageRange.map((page) => (
        <button
          key={page}
          className={currentPage === page ? "active" : ""}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      {/* 다음 페이지로 */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        &gt;
      </button>

      {/* 마지막 페이지로 */}
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage >= totalPages}
      >
        &raquo;
      </button>
    </Pagination>
  );
};

export default PaginationComponent;
