import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  text-align: center;
`;

const ModalMessage = styled.p`
  font-size: 16px;
  margin-bottom: 24px;
  text-align: center;
  color: #333;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
`;

const Button = styled.button`
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
`;

const LoginButton = styled(Button)`
  background-color: #ef6253;
  color: white;
  border: none;

  &:hover {
    background-color: #e04f3f;
  }
`;

const CancelButton = styled(Button)`
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;

  &:hover {
    background-color: #e8e8e8;
  }
`;

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  message = "로그인이 필요한 기능입니다.",
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogin = () => {
    navigate("/login");
    onClose();
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalTitle>로그인 필요</ModalTitle>
        <ModalMessage>{message}</ModalMessage>
        <ButtonContainer>
          <CancelButton onClick={onClose}>취소</CancelButton>
          <LoginButton onClick={handleLogin}>로그인</LoginButton>
        </ButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default LoginModal;
