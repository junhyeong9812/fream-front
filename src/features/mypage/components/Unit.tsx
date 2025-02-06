import React from "react";
import styled from "styled-components";

const UnitContainer = styled.div`
  border-bottom: 1px solid #ebebeb;
  display: flex;
  flex-direction: column;
  padding: 25px 0 12px;
  position: relative;
`;

const UnitTitle = styled.h5`
  color: rgba(34, 34, 34, 0.5);
  font-size: 13px;
  font-weight: 400;
  letter-spacing: -0.07px;
  margin: 0;
`;

const UnitContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 8px;
  padding-bottom: 8px;
`;

const ContentText = styled.p`
  flex: 1;
  font-size: 16px;
  letter-spacing: -0.16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0;
`;

const ModifyButton = styled.button`
  position: absolute;
  right: 0;
  background-color: #fff;
  border: 1px solid #d3d3d3;
  color: rgba(34, 34, 34, 0.8);
  border-radius: 10px;
  font-size: 12px;
  height: 34px;
  padding: 0 14px;
  cursor: pointer;

  &:hover {
    background-color: #f9f9f9;
  }
`;

interface UnitProps {
  title: string;
  content: string;
  onModify: () => void;
}

const Unit: React.FC<UnitProps> = ({ title, content, onModify }) => {
  return (
    <UnitContainer>
      <UnitTitle>{title}</UnitTitle>
      <UnitContent>
        <ContentText>{content}</ContentText>
        <ModifyButton onClick={onModify}>변경</ModifyButton>
      </UnitContent>
    </UnitContainer>
  );
};

export default Unit;
