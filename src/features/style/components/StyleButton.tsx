import React from "react";
import styled from "styled-components";

const StyleButtonContainer = styled.button<{ isActive: boolean }>`
  align-items: center;
  background-color: ${(props) => (props.isActive ? "#000" : "#fff")};
  border: 1px solid #f0f0f0;
  border-radius: 30px;
  color: ${(props) => (props.isActive ? "#fff" : "#4e4e4e")};
  display: flex;
  flex-direction: row;
  font-size: 13px;
  font-weight: 600;
  height: 30px;
  padding: 0 8px;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => (props.isActive ? "#333" : "#f7f7f7")};
  }
`;

const TextGroup = styled.p`
  padding: 0 4px;
`;

const Text = styled.span`
  box-sizing: border-box;
`;

interface StyleButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const StyleButton: React.FC<StyleButtonProps> = ({
  label,
  isActive,
  onClick,
}) => {
  return (
    <StyleButtonContainer isActive={isActive} onClick={onClick}>
      <TextGroup>
        <Text>{label}</Text>
      </TextGroup>
    </StyleButtonContainer>
  );
};

export default StyleButton;
