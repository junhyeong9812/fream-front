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
  return (
    <Pagination>
      {currentPage > 1 && (
        <>
          <button onClick={() => onPageChange(1)}>&laquo;</button>
          <button onClick={() => onPageChange(currentPage - 1)}>&lt;</button>
        </>
      )}
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          className={currentPage === i + 1 ? "active" : ""}
          onClick={() => onPageChange(i + 1)}
        >
          {i + 1}
        </button>
      ))}
      {currentPage < totalPages && (
        <>
          <button onClick={() => onPageChange(currentPage + 1)}>&gt;</button>
          <button onClick={() => onPageChange(totalPages)}>&raquo;</button>
        </>
      )}
    </Pagination>
  );
};

export default PaginationComponent;
