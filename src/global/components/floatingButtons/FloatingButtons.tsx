import React, { useState, useEffect, useRef, useContext, useCallback } from "react";
import { FaHeadset, FaAngleDoubleUp } from "react-icons/fa";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { sendQuestion, getChatHistory, getChatHistoryPageCount } from "./services/chatService";
import { ChatHistoryDto, ChatMessage } from "./types/chatTypes";

// 플로팅 버튼 컨테이너
const FloatingContainer = styled.div`
  position: fixed;
  right: 20px;
  bottom: 80px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 1000;

  @media screen and (max-width: 768px) {
    bottom: 80px;
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
  bottom: 80px;
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
    width: 270px;
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

// 로딩 인디케이터 (전체)
const LoadingIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #666;
  font-size: 14px;
`;

// 히스토리 로딩 인디케이터 (상단)
const HistoryLoadingIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  color: #666;
  font-size: 12px;
  width: 100%;
`;

// 히스토리 끝 표시
const HistoryEndIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  color: #999;
  font-size: 11px;
  width: 100%;
  border-top: 1px dashed #eee;
  margin-top: 5px;
  margin-bottom: 5px;
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

// 타임스탬프
const MessageTimestamp = styled.div`
  font-size: 10px;
  color: #999;
  margin-top: 4px;
  text-align: right;
`;

// 채팅 입력 영역
const ChatInput = styled.div`
  display: flex;
  padding: 10px;
  border-top: 1px solid #eee;
`;

// 메시지 입력 인풋
const MessageInput = styled.input<{ $isLoggedIn: boolean }>`
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 20px;
  padding: 8px 15px;
  outline: none;
  background-color: ${({ $isLoggedIn }) => ($isLoggedIn ? "white" : "#f5f5f5")};
  
  &:focus {
    border-color: ${({ $isLoggedIn }) => ($isLoggedIn ? "#3498db" : "#ddd")};
  }
`;

// 메시지 전송 버튼
const SendButton = styled.button<{ $isLogin?: boolean }>`
  background-color: ${({ $isLogin }) => ($isLogin ? "#2ecc71" : "#3498db")};
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 15px;
  margin-left: 8px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ $isLogin }) => ($isLogin ? "#27ae60" : "#2980b9")};
  }
`;

// 날짜 구분선
const DateDivider = styled.div`
  display: flex;
  align-items: center;
  font-size: 11px;
  color: #999;
  width: 100%;
  margin: 10px 0;
  
  &::before, &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #eee;
  }
  
  &::before {
    margin-right: 10px;
  }
  
  &::after {
    margin-left: 10px;
  }
`;

interface FloatingButtonsProps {
  headerHeight: number;
  mobileFooterHeight?: number;
}

const PAGE_SIZE = 2; // 한 번에 로드할 채팅 개수

const FloatingButtons: React.FC<FloatingButtonsProps> = ({
  headerHeight,
  mobileFooterHeight = 64,
}) => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [messageIdCounter, setMessageIdCounter] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasReachedTop, setHasReachedTop] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = useRef<number>(0);
  
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  // 스크롤 위치에 따라 상단 이동 버튼 표시 여부 결정
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > headerHeight * 1.5);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [headerHeight]);

  // 채팅창 열릴 때 초기화 및 채팅 기록 로드
  useEffect(() => {
    if (isChatOpen) {
      if (isLoggedIn) {
        initializeChatHistory();
      } else {
        // 로그인 안 된 상태면 안내 메시지만 표시
        setMessages([
          {
            id: 0,
            text: "안녕하세요! 무엇을 도와드릴까요?",
            isUser: false,
          },
        ]);
        setInitialLoadComplete(true);
      }
    } else {
      // 채팅창이 닫히면 상태 초기화
      setInitialLoadComplete(false);
      setCurrentPage(0);
      setTotalPages(0);
      setHasReachedTop(false);
    }
  }, [isChatOpen, isLoggedIn]);

  // 채팅창에서 스크롤 이벤트 처리
  useEffect(() => {
    const chatMessages = chatMessagesRef.current;
    if (!chatMessages || !initialLoadComplete || !isLoggedIn) return;

    const handleScroll = () => {
      // 스크롤이 상단에 도달했고, 더 로드할 페이지가 있을 때
      if (chatMessages.scrollTop <= 10 && currentPage < totalPages - 1 && !isLoadingMore && !hasReachedTop) {
        loadMoreMessages();
      }
    };

    chatMessages.addEventListener('scroll', handleScroll);
    return () => {
      chatMessages.removeEventListener('scroll', handleScroll);
    };
  }, [initialLoadComplete, currentPage, totalPages, isLoadingMore, hasReachedTop, isLoggedIn]);

  // 추가 메시지 로드 후 스크롤 위치 유지
  useEffect(() => {
    const chatMessages = chatMessagesRef.current;
    if (chatMessages && isLoadingMore && prevScrollHeightRef.current > 0) {
      const newScrollHeight = chatMessages.scrollHeight;
      const scrollDiff = newScrollHeight - prevScrollHeightRef.current;
      chatMessages.scrollTop = scrollDiff;
    }
  }, [isLoadingMore, messages]);

  // 최초 로딩시 총 페이지 수 조회 및 가장 최근 채팅 로드
  const initializeChatHistory = async () => {
    if (!isLoggedIn) return;
    
    setIsLoading(true);
    try {
      // 총 페이지 수 조회
      const totalPageCount = await getChatHistoryPageCount(PAGE_SIZE);
      setTotalPages(totalPageCount);
      
      if (totalPageCount > 0) {
        // 가장 최근(마지막) 페이지부터 로드
        const lastPage = 0; // Spring의 페이징은 0부터 시작하며, sort=desc일 때 0이 가장 최신
        const history = await getChatHistory(lastPage, PAGE_SIZE);
        
        // 채팅 기록 변환 (최신 순으로 온 것을 시간순으로 정렬)
        const historyMessages: ChatMessage[] = convertChatHistoryToMessages(history.content.reverse());
        
        // 기록 추가 + 기본 인사 메시지
        setMessages([
          ...historyMessages,
          {
            id: historyMessages.length > 0 ? historyMessages[historyMessages.length - 1].id + 1 : 0,
            text: "안녕하세요! 추가 질문이 있으시면 알려주세요.",
            isUser: false,
          },
        ]);
        
        // 현재 페이지 설정
        setCurrentPage(lastPage);
        
        // 페이지가 1개뿐이면 상단 도달 표시
        if (totalPageCount <= 1) {
          setHasReachedTop(true);
        }
        
        // 메시지 ID 카운터 업데이트
        setMessageIdCounter(historyMessages.length + 1);
      } else {
        // 기록이 없으면 기본 인사 메시지만
        setMessages([
          {
            id: 0,
            text: "안녕하세요! 무엇을 도와드릴까요?",
            isUser: false,
          },
        ]);
        setHasReachedTop(true);
      }
    } catch (error) {
      console.error("채팅 기록 초기화 실패:", error);
      setMessages([
        {
          id: 0,
          text: "채팅 기록을 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.",
          isUser: false,
        },
      ]);
    } finally {
      setIsLoading(false);
      setInitialLoadComplete(true);
      scrollToBottom();
    }
  };

  // 추가 메시지 로드 (페이지 번호 증가)
  const loadMoreMessages = async () => {
    if (isLoadingMore || currentPage >= totalPages - 1 || hasReachedTop) return;
    
    setIsLoadingMore(true);
    
    // 스크롤 위치 유지를 위해 현재 스크롤 높이 저장
    if (chatMessagesRef.current) {
      prevScrollHeightRef.current = chatMessagesRef.current.scrollHeight;
    }
    
    try {
      // 이전 페이지 로드 (최신순 정렬이므로 페이지 번호를 증가시킴)
      const nextPage = currentPage + 1;
      const history = await getChatHistory(nextPage, PAGE_SIZE);
      
      if (history.content.length > 0) {
        // 채팅 기록 변환 (최신 순으로 온 것을 시간순으로 정렬)
        const historyMessages = convertChatHistoryToMessages(history.content.reverse());
        
        // 기존 메시지 앞에 추가
        setMessages(prevMessages => [...historyMessages, ...prevMessages]);
        
        // 현재 페이지 업데이트
        setCurrentPage(nextPage);
        
        // 마지막 페이지 도달 확인
        if (nextPage >= totalPages - 1) {
          setHasReachedTop(true);
        }
      } else {
        // 결과가 없으면 상단 도달로 표시
        setHasReachedTop(true);
      }
    } catch (error) {
      console.error("추가 메시지 로드 실패:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // 채팅 기록을 UI용 메시지로 변환
  const convertChatHistoryToMessages = (chatHistory: ChatHistoryDto[]): ChatMessage[] => {
    const result: ChatMessage[] = [];
    let idCounter = 0;
    
    chatHistory.forEach((chat) => {
      // 사용자 질문
      result.push({
        id: idCounter++,
        text: chat.question,
        isUser: true,
        timestamp: formatTimestamp(chat.createdAt),
      });
      
      // 시스템 응답
      result.push({
        id: idCounter++,
        text: chat.answer,
        isUser: false,
        timestamp: formatTimestamp(chat.createdAt),
      });
    });
    
    return result;
  };

  // 최상단으로 스크롤 (페이지)
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // 채팅창 맨 아래로 스크롤
  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  // 채팅창 토글
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  // 메시지 전송
  const sendMessage = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    
    if (newMessage.trim() === "") return;

    // 사용자 메시지 추가
    const userMessage: ChatMessage = {
      id: messageIdCounter,
      text: newMessage,
      isUser: true,
      timestamp: formatTimestamp(new Date().toISOString()),
    };

    setMessages([...messages, userMessage]);
    setMessageIdCounter(messageIdCounter + 1);
    
    const questionText = newMessage;
    setNewMessage("");
    scrollToBottom();

    try {
      // 임시 응답 표시 (로딩 중)
      const tempId = messageIdCounter + 1;
      const loadingMessage: ChatMessage = {
        id: tempId,
        text: "답변을 생성하는 중입니다...",
        isUser: false,
      };
      
      setMessages(prev => [...prev, loadingMessage]);
      setMessageIdCounter(tempId + 1);
      scrollToBottom();
      
      // 실제 API 호출
      const response = await sendQuestion(questionText);
      
      // 로딩 메시지 제거하고 실제 응답 추가
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== tempId);
        return [...filtered, {
          id: tempId,
          text: response.answer,
          isUser: false,
          timestamp: formatTimestamp(response.createdAt),
        }];
      });
      
      scrollToBottom();
      
      // 메시지를 새로 보냈으니 히스토리 페이지 수 업데이트
      if (isLoggedIn) {
        const newTotalPages = await getChatHistoryPageCount(PAGE_SIZE);
        setTotalPages(newTotalPages);
      }
      
    } catch (error) {
      console.error("응답 생성 실패:", error);
      
      // 에러 메시지 추가
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.text.includes("답변을 생성하는 중"));
        return [...filtered, {
          id: messageIdCounter + 1,
          text: "죄송합니다. 응답을 받아오는 중 오류가 발생했습니다. 다시 시도해주세요.",
          isUser: false,
        }];
      });
      
      setMessageIdCounter(messageIdCounter + 2);
      scrollToBottom();
    }
  };

  // 타임스탬프 포맷팅
  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleString('ko-KR', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  // 엔터키 처리
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && isLoggedIn) {
      sendMessage();
    }
  };

  // 로그인 페이지로 이동
  const handleLoginRedirect = () => {
    navigate("/login");
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
        
        <ChatMessages ref={chatMessagesRef}>
          {isLoading ? (
            <LoadingIndicator>
              채팅 내역을 불러오는 중입니다...
            </LoadingIndicator>
          ) : (
            <>
              {/* 히스토리 상단 표시 (모든 기록을 다 불러왔을 때) */}
              {hasReachedTop && messages.length > 1 && (
                <HistoryEndIndicator>
                  대화 기록의 처음입니다
                </HistoryEndIndicator>
              )}
              
              {/* 이전 기록 로딩 인디케이터 */}
              {isLoadingMore && (
                <HistoryLoadingIndicator>
                  이전 대화를 불러오는 중...
                </HistoryLoadingIndicator>
              )}
              
              {/* 메시지 목록 */}
              {messages.map((message) => (
                message.isUser ? (
                  <UserMessage key={message.id}>
                    {message.text}
                    {message.timestamp && (
                      <MessageTimestamp>{message.timestamp}</MessageTimestamp>
                    )}
                  </UserMessage>
                ) : (
                  <SystemMessage key={message.id}>
                    {message.text}
                    {message.timestamp && (
                      <MessageTimestamp>{message.timestamp}</MessageTimestamp>
                    )}
                  </SystemMessage>
                )
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </ChatMessages>
        
        <ChatInput>
          <MessageInput
            type="text"
            placeholder={isLoggedIn ? "메시지를 입력하세요..." : "로그인 후 질문이 가능합니다."}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={!isLoggedIn}
            $isLoggedIn={isLoggedIn}
          />
          {isLoggedIn ? (
            <SendButton onClick={sendMessage}>전송</SendButton>
          ) : (
            <SendButton $isLogin onClick={handleLoginRedirect}>로그인</SendButton>
          )}
        </ChatInput>
      </ChatContainer>
    </>
  );
};

export default FloatingButtons;