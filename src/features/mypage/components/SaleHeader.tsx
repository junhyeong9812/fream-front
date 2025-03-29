import React, { useState } from "react";
import styled from "styled-components";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FaSort } from "react-icons/fa";
import { SaleBidResponseDto, statusFilters } from "../types/sale";

const SalesHead = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 16px;
  justify-content: space-between;
`;

const FilterButton = styled.a`
  display: inline-block;
  background-color: #fff;
  border: 1px solid #ebebeb;
  border-radius: 12px;
  font-size: 13px;
  line-height: 24px;
  padding: 5px 30px 5px 10px;
  position: relative;
  text-decoration: none;
  color: #222;
  cursor: pointer;

  svg {
    position: absolute;
    right: 5px;
    top: 6px;
  }
`;

const SortButton = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-left: 15px;
  font-size: 14px;
  color: #222;
  position: relative;

  &.active {
    font-weight: bold;
  }

  svg {
    margin-left: 5px;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2000;
`;

const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 400px;
  z-index: 2001;
  padding: 20px;
`;

const ModalHeader = styled.h2`
  font-size: 18px;
  margin-bottom: 20px;
`;

const StatusList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
`;

const StatusItem = styled.li`
  text-align: center;
  padding: 10px;
  border: 1px solid #ebebeb;
  border-radius: 8px;
  cursor: pointer;
  color: #222;

  &:hover {
    background-color: #f5f5f5;
  }

  &.active {
    color: #46a049; /* 초록색 */
    border-color: #46a049;
  }
`;

interface SalesHeaderProps {
  onFilterChange: (filter: string) => void;
  onSortChange: (
    field: keyof SaleBidResponseDto,
    direction: "asc" | "desc" | null
  ) => void;
  sortField: keyof SaleBidResponseDto | null;
  sortDirection: "asc" | "desc" | null;
  currentFilter: string;
}

const SalesHeader: React.FC<SalesHeaderProps> = ({
  onFilterChange,
  onSortChange,
  sortField,
  sortDirection,
  currentFilter,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFilterClick = (filter: string) => {
    onFilterChange(filter);
    setIsModalOpen(false);
  };

  const handleSortClick = (field: keyof SaleBidResponseDto) => {
    if (sortField === field) {
      const newDirection =
        sortDirection === "asc"
          ? "desc"
          : sortDirection === "desc"
          ? null
          : "asc";
      onSortChange(field, newDirection);
    } else {
      onSortChange(field, "asc");
    }
  };

  // 모달 외부 클릭 시 닫기
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <SalesHead>
        <FilterButton onClick={() => setIsModalOpen(true)}>
          {currentFilter}
          <IoIosArrowDown />
        </FilterButton>
        <div style={{ display: "flex", alignItems: "center" }}>
          <SortButton
            className={sortField === "bidPrice" ? "active" : ""}
            onClick={() => handleSortClick("bidPrice")}
          >
            판매 희망가
            {sortField === "bidPrice" ? (
              <>
                {sortDirection === "asc" && <IoIosArrowUp />}
                {sortDirection === "desc" && <IoIosArrowDown />}
                {sortDirection === null && <FaSort />}
              </>
            ) : (
              <FaSort />
            )}
          </SortButton>
          <SortButton
            className={sortField === "createdDate" ? "active" : ""}
            onClick={() => handleSortClick("createdDate")}
          >
            만료일
            {sortField === "createdDate" ? (
              <>
                {sortDirection === "asc" && <IoIosArrowUp />}
                {sortDirection === "desc" && <IoIosArrowDown />}
                {sortDirection === null && <FaSort />}
              </>
            ) : (
              <FaSort />
            )}
          </SortButton>
        </div>
      </SalesHead>
      {isModalOpen && (
        <ModalOverlay onClick={handleOverlayClick}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <ModalHeader>선택한 상태 보기</ModalHeader>
            <StatusList>
              {statusFilters.map((filter) => (
                <StatusItem
                  key={filter}
                  onClick={() => handleFilterClick(filter)}
                  className={currentFilter === filter ? "active" : ""}
                >
                  {filter}
                </StatusItem>
              ))}
            </StatusList>
          </ModalContainer>
        </ModalOverlay>
      )}
    </>
  );
};

export default SalesHeader;
