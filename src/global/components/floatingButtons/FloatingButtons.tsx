import React, { useState, useEffect } from "react";
import { FaHeadset, FaAngleDoubleUp } from "react-icons/fa";
import styled from "styled-components";

// 플로팅 버튼 컨테이너
const FloatingContainer = styled.div`
  position: fixed;
  right: 20px;
  bottom: 80px; /* 하단 메뉴 높이(64px) + 여유 공간(16px) */
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 1000;

  @media screen and (max-width: 768px) {
    bottom: 80px; /* 모바일에서는 더 높게 올림 */
  }
`;

// 버튼 공통 스타일
const FloatingButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
`;

// 상담 버튼
const ConsultButton = styled(FloatingButton)`
  background-color: #3498db;
  color: white;
`;

// 상단 이동 버튼
const ScrollTopButton = styled(FloatingButton)<{ visible: boolean }>`
  background-color: #2c3e50;
  color: white;
  opacity: ${({ visible }) => (visible ? "1" : "0")};
  pointer-events: ${({ visible }) => (visible ? "auto" : "none")};
  transition: opacity 0.3s ease;
`;

// 채팅창 컨테이너
const ChatContainer = styled.div<{ isOpen: boolean }>`
  position: fixed;
  right: 80px;
  bottom: 80px; /* 플로팅 버튼과 동일한 높이로 조정 */
  width: 300px;
  height: 400px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 1000;
  transition: all 0.3s ease;
  transform: ${({ isOpen }) => (isOpen ? "scale(1)" : "scale(0)")};
  transform-origin: bottom right;
  opacity: ${({ isOpen }) => (isOpen ? "1" : "0")};

  @media screen and (max-width: 768px) {
    width: 270px; /* 모바일에서는 크기를 좀 더 작게 */
    height: 350px;
    right: 70px;
  }
`;

// 채팅창 헤더
const ChatHeader = styled.div`
  background-color: #3498db;
  color: white;
  padding: 10px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

// 채팅 내용 영역
const ChatMessages = styled.div`
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

// 메시지 기본 스타일
const MessageBase = styled.div`
  max-width: 75%;
  padding: 8px 12px;
  border-radius: 10px;
  word-break: break-word;
`;

// 시스템 메시지 (왼쪽)
const SystemMessage = styled(MessageBase)`
  align-self: flex-start;
  background-color: #f1f1f1;
`;

// 사용자 메시지 (오른쪽)
const UserMessage = styled(MessageBase)`
  align-self: flex-end;
  background-color: #3498db;
  color: white;
`;

// 채팅 입력 영역
const ChatInput = styled.div`
  display: flex;
  padding: 10px;
  border-top: 1px solid #eee;
`;

// 메시지 입력 인풋
const MessageInput = styled.input`
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 20px;
  padding: 8px 15px;
  outline: none;

  &:focus {
    border-color: #3498db;
  }
`;

// 메시지 전송 버튼
const SendButton = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 15px;
  margin-left: 8px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2980b9;
  }
`;

// 메시지 인터페이스
interface Message {
  text: string;
  isUser: boolean;
  id: number;
}

interface FloatingButtonsProps {
  headerHeight: number;
  mobileFooterHeight?: number; // 모바일 푸터 높이
}

const FloatingButtons: React.FC<FloatingButtonsProps> = ({
  headerHeight,
  mobileFooterHeight = 64, // 기본값으로 64px 설정
}) => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "안녕하세요! 무엇을 도와드릴까요?", isUser: false, id: 0 },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [messageIdCounter, setMessageIdCounter] = useState(1);

  // 스크롤 위치에 따라 상단 이동 버튼 표시 여부 결정
  useEffect(() => {
    const handleScroll = () => {
      // 헤더 높이의 2배 이상 스크롤했을 때 버튼 표시
      setShowScrollTop(window.scrollY > headerHeight * 1.5);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // 초기 상태 설정
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [headerHeight]);

  // 최상단으로 스크롤
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // 채팅창 토글
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  // 메시지 전송
  const sendMessage = () => {
    if (newMessage.trim() === "") return;

    // 사용자 메시지 추가
    const userMessage: Message = {
      text: newMessage,
      isUser: true,
      id: messageIdCounter,
    };

    setMessages([...messages, userMessage]);
    setNewMessage("");
    setMessageIdCounter(messageIdCounter + 1);

    // 시스템 응답 (간단한 자동 응답)
    setTimeout(() => {
      const systemResponse: Message = {
        text: "문의하신 내용을 확인중입니다. 잠시만 기다려주세요.",
        isUser: false,
        id: messageIdCounter + 1,
      };
      setMessages((prev) => [...prev, systemResponse]);
      setMessageIdCounter(messageIdCounter + 2);
    }, 1000);
  };

  // 엔터키 처리
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <>
      <FloatingContainer>
        <ConsultButton onClick={toggleChat} title="상담하기">
          <FaHeadset size={24} />
        </ConsultButton>
        <ScrollTopButton
          onClick={scrollToTop}
          visible={showScrollTop}
          title="맨 위로"
        >
          <FaAngleDoubleUp size={24} />
        </ScrollTopButton>
      </FloatingContainer>

      <ChatContainer isOpen={isChatOpen}>
        <ChatHeader>
          <h4 style={{ margin: 0, fontSize: "16px" }}>고객 상담</h4>
          <button
            onClick={toggleChat}
            style={{
              background: "none",
              border: "none",
              color: "white",
              cursor: "pointer",
              fontSize: "18px",
            }}
          >
            ×
          </button>
        </ChatHeader>
        <ChatMessages>
          {messages.map((message) =>
            message.isUser ? (
              <UserMessage key={message.id}>{message.text}</UserMessage>
            ) : (
              <SystemMessage key={message.id}>{message.text}</SystemMessage>
            )
          )}
        </ChatMessages>
        <ChatInput>
          <MessageInput
            type="text"
            placeholder="메시지를 입력하세요..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <SendButton onClick={sendMessage}>전송</SendButton>
        </ChatInput>
      </ChatContainer>
    </>
  );
};

export default FloatingButtons;
