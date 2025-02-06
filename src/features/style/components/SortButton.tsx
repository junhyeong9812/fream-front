import React from "react";
import styled from "styled-components";

const SortContainer = styled.div`
  display: flex;
  justify-content: flex-end; /* 우측 정렬 */
`;

const SortList = styled.ul`
  padding: 16px 0;
  list-style: none;
  display: flex;
  align-items: center; /* 정렬 아이템 가운데 정렬 */
`;

const SortItem = styled.li`
  display: inline-flex;

  /* 최신순 앞에 ::before 추가 */
  &:not(:first-child)::before {
    align-self: center;
    background: #ebebeb;
    content: "";
    height: 10px;
    margin-left: 12px;
    margin-right: 12px;
    width: 1px;
  }
`;

const SortLink = styled.a<{ isActive: boolean }>`
  color: ${(props) => (props.isActive ? "#000" : "rgba(34, 34, 34, 0.8)")};
  font-size: 14px;
  font-weight: ${(props) => (props.isActive ? "700" : "400")};
  letter-spacing: -0.21px;
  line-height: 17px;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    color: #000;
  }
`;

interface SortButtonProps {
  options: string[];
  activeOption: string;
  onSelect: (option: string) => void;
}

const SortButton: React.FC<SortButtonProps> = ({
  options,
  activeOption,
  onSelect,
}) => {
  return (
    <SortContainer>
      <SortList>
        {options.map((option) => (
          <SortItem key={option}>
            <SortLink
              isActive={activeOption === option}
              onClick={() => onSelect(option)}
            >
              {option}
            </SortLink>
          </SortItem>
        ))}
      </SortList>
    </SortContainer>
  );
};

export default SortButton;
