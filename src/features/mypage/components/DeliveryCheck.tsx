import React from "react";
import styled from "styled-components";
import { FiSquare, FiCheckSquare } from "react-icons/fi";

// 체크박스 아이템 스타일
const CheckboxItem = styled.div`
  font-size: 0;
  position: relative;
  float: left;
  margin-right: 19px;

  &:last-child {
    margin-right: 0;
  }
`;

const Label = styled.label`
  cursor: pointer;
  display: inline-flex;
  align-items: center;
`;

const LabelText = styled.span`
  display: inline-block;
  font-size: 13px;
  line-height: 24px;
  padding-left: 8px;
  vertical-align: top;
`;

const DeliveryCheck: React.FC<{ isChecked: boolean; onToggle: () => void }> = ({
  isChecked,
  onToggle,
}) => {
  return (
    <CheckboxItem>
      <input
        type="checkbox"
        id="default-checkbox"
        checked={isChecked}
        onChange={() => {}} // 불필요한 동작 방지
        style={{ display: "none" }} // 시각적으로 숨김
      />
      <Label htmlFor="default-checkbox" onClick={onToggle}>
        {isChecked ? (
          <FiCheckSquare size={24} color="#222" />
        ) : (
          <FiSquare size={24} color="#ccc" />
        )}
        <LabelText>기본 배송지로 설정</LabelText>
      </Label>
    </CheckboxItem>
  );
};

export default DeliveryCheck;
