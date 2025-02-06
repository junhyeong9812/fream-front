import React, { useState } from "react";
import styled from "styled-components";
import { IoIosArrowDown } from "react-icons/io";

const SalesHead = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 16px;
`;

const FilterButton = styled.button`
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

  &:hover {
    background-color: #f5f5f5;
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

const SalesHeader: React.FC<{
  onFilterChange: (filter: string) => void;
}> = ({ onFilterChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("전체");
  const filters = ["전체", "배송완료", "배송 중", "판매 대기", "판매 취소"];

  const handleFilterClick = (filter: string) => {
    setSelectedFilter(filter);
    onFilterChange(filter);
    setIsModalOpen(false);
  };

  return (
    <>
      <SalesHead>
        <FilterButton onClick={() => setIsModalOpen(true)}>
          {selectedFilter}
          <IoIosArrowDown />
        </FilterButton>
      </SalesHead>
      {isModalOpen && (
        <ModalOverlay>
          <ModalContainer>
            <ModalHeader>선택한 상태 보기</ModalHeader>
            <StatusList>
              {filters.map((filter) => (
                <StatusItem
                  key={filter}
                  onClick={() => handleFilterClick(filter)}
                  className={selectedFilter === filter ? "active" : ""}
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
