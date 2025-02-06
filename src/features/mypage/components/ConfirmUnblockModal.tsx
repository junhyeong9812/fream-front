import React from "react";
import styled from "styled-components";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(34, 34, 34, 0.5);
  z-index: 1011;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContainer = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.1);
  width: 360px;
  padding: 24px;
  text-align: center;
`;

const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 12px;
`;

const ModalDescription = styled.p`
  font-size: 14px;
  color: rgba(34, 34, 34, 0.8);
  margin-bottom: 24px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
`;

const Button = styled.button<{ variant?: "solid" }>`
  width: 120px;
  height: 42px;
  font-size: 14px;
  border-radius: 10px;
  cursor: pointer;

  ${({ variant }) =>
    variant === "solid"
      ? `background-color: #222; color: #fff; font-weight: 700;`
      : `background-color: #fff; border: 1px solid #d3d3d3; color: #222;`}

  &:hover {
    opacity: 0.9;
  }
`;

interface ConfirmUnblockModalProps {
  realName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmUnblockModal: React.FC<ConfirmUnblockModalProps> = ({
  realName,
  onConfirm,
  onCancel,
}) => {
  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalTitle>차단 해제</ModalTitle>
        <ModalDescription>
          {realName}님을 차단 해제하시겠습니까? 차단 해제 후 해당 프로필의
          콘텐츠가 표시됩니다.
        </ModalDescription>
        <ButtonContainer>
          <Button onClick={onCancel}>취소</Button>
          <Button variant="solid" onClick={onConfirm}>
            차단 해제
          </Button>
        </ButtonContainer>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ConfirmUnblockModal;
