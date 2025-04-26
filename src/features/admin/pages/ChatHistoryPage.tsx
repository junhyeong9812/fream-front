import React, { useState, useEffect, useContext } from "react";
import { ThemeContext } from "src/global/context/ThemeContext";
import { ChatQuestionService } from "../services/chatQuestionService";
import {
  ChatHistoryDto,
  PaginatedChatHistoryResponse,
} from "../types/chatQuestionTypes";
import LoadingSpinner from "src/global/components/common/LoadingSpinner";
import ErrorMessage from "src/global/components/common/ErrorMessage";
import styles from "./ChatHistoryPage.module.css";
import {
  FiMessageCircle,
  FiRefreshCw,
  FiDownload,
  FiUser,
  FiClock,
} from "react-icons/fi";

/**
 * 채팅 기록 페이지
 * 사용자별 채팅 기록을 조회할 수 있는 페이지
 */
const ChatHistoryPage: React.FC = () => {
  const { theme } = useContext(ThemeContext);
  const [chatHistory, setChatHistory] =
    useState<PaginatedChatHistoryResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [expandedChat, setExpandedChat] = useState<number | null>(null);

  // 채팅 기록 조회
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const historyData = await ChatQuestionService.getChatHistoryPaging(
          page,
          size
        );
        setChatHistory(historyData);
        setTotalPages(historyData.totalPages);
      } catch (error) {
        console.error("채팅 기록 조회 오류:", error);
        setError("채팅 기록을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatHistory();
  }, [page, size]);

  // 페이지 변경 처리
  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  // 페이지 사이즈 변경 처리
  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value);
    setSize(newSize);
    setPage(0); // 페이지 초기화
  };

  // 채팅 내용 확장/축소 토글
  const toggleChatExpansion = (chatId: number) => {
    if (expandedChat === chatId) {
      setExpandedChat(null);
    } else {
      setExpandedChat(chatId);
    }
  };

  // 새로고침
  const refreshChatHistory = () => {
    setPage(0);
    setIsLoading(true);
  };

  // 페이지네이션 컴포넌트
  const renderPagination = () => {
    if (!chatHistory || chatHistory.totalElements === 0) return null;

    const pageButtons = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(0, page - halfVisible);
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    // 처음 페이지 버튼
    pageButtons.push(
      <button
        key="first"
        onClick={() => handlePageChange(0)}
        disabled={page === 0}
        className={styles.pageButton}
        aria-label="첫 페이지"
      >
        &laquo;
      </button>
    );

    // 이전 페이지 버튼
    pageButtons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 0}
        className={styles.pageButton}
        aria-label="이전 페이지"
      >
        &lsaquo;
      </button>
    );

    // 페이지 번호 버튼
    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`${styles.pageButton} ${
            i === page ? styles.activePage : ""
          }`}
        >
          {i + 1}
        </button>
      );
    }

    // 다음 페이지 버튼
    pageButtons.push(
      <button
        key="next"
        onClick={() => handlePageChange(page + 1)}
        disabled={page === totalPages - 1}
        className={styles.pageButton}
        aria-label="다음 페이지"
      >
        &rsaquo;
      </button>
    );

    // 마지막 페이지 버튼
    pageButtons.push(
      <button
        key="last"
        onClick={() => handlePageChange(totalPages - 1)}
        disabled={page === totalPages - 1}
        className={styles.pageButton}
        aria-label="마지막 페이지"
      >
        &raquo;
      </button>
    );

    return (
      <div className={styles.pagination}>
        {pageButtons}
        <div className={styles.pageInfo}>
          {`${page + 1} / ${totalPages} 페이지 (총 ${
            chatHistory.totalElements
          }건)`}
        </div>
      </div>
    );
  };

  // CSV 파일로 내보내기
  const exportToCsv = () => {
    if (!chatHistory || !chatHistory.content.length) return;

    // CSV 헤더
    const headers = ["ID", "질문", "답변", "생성 일시"];

    // CSV 행 데이터
    const rows = chatHistory.content.map((chat) => [
      chat.id,
      `"${chat.question.replace(/"/g, '""')}"`,
      `"${chat.answer.replace(/"/g, '""')}"`,
      chat.createdAt,
    ]);

    // CSV 문자열 생성
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    // 파일 다운로드
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `chat_history_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div
      className={`${styles.container} ${theme === "dark" ? styles.dark : ""}`}
    >
      <div className={styles.header}>
        <h1 className={styles.title}>채팅 기록 조회</h1>
        <div className={styles.actions}>
          <div className={styles.pageSelector}>
            <label htmlFor="pageSize">페이지 크기:</label>
            <select
              id="pageSize"
              value={size}
              onChange={handleSizeChange}
              className={styles.pageSizeSelect}
            >
              <option value="5">5개</option>
              <option value="10">10개</option>
              <option value="20">20개</option>
              <option value="50">50개</option>
            </select>
          </div>
          <button
            className={`${styles.actionButton} ${styles.refreshButton}`}
            onClick={refreshChatHistory}
            title="새로고침"
          >
            <FiRefreshCw /> 새로고침
          </button>
          <button
            className={`${styles.actionButton} ${styles.exportButton}`}
            onClick={exportToCsv}
            disabled={!chatHistory || chatHistory.content.length === 0}
            title="CSV로 내보내기"
          >
            <FiDownload /> 내보내기
          </button>
        </div>
      </div>

      {error && (
        <ErrorMessage
          message={error}
          onRetry={refreshChatHistory}
          theme={theme}
        />
      )}

      {isLoading ? (
        <LoadingSpinner size="large" text="채팅 기록을 불러오고 있습니다..." />
      ) : (
        <>
          {chatHistory && chatHistory.content.length > 0 ? (
            <div className={styles.chatHistory}>
              {chatHistory.content.map((chat) => (
                <div
                  key={chat.id}
                  className={`${styles.chatItem} ${
                    theme === "dark" ? styles.dark : ""
                  }`}
                >
                  <div
                    className={styles.chatHeader}
                    onClick={() => toggleChatExpansion(chat.id)}
                  >
                    <div className={styles.chatInfo}>
                      <span className={styles.chatId}>#{chat.id}</span>
                      <span className={styles.chatTime}>
                        <FiClock /> {formatDate(chat.createdAt)}
                      </span>
                    </div>
                    <div className={styles.chatPreview}>
                      {chat.question.length > 100
                        ? `${chat.question.substring(0, 100)}...`
                        : chat.question}
                    </div>
                  </div>

                  {expandedChat === chat.id && (
                    <div className={styles.chatContent}>
                      <div className={styles.question}>
                        <div className={styles.messageHeader}>
                          <FiUser /> 질문
                        </div>
                        <div className={styles.messageContent}>
                          {chat.question}
                        </div>
                      </div>

                      <div className={styles.answer}>
                        <div className={styles.messageHeader}>
                          <FiMessageCircle /> 답변
                        </div>
                        <div className={styles.messageContent}>
                          {chat.answer}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {renderPagination()}
            </div>
          ) : (
            <div className={styles.noData}>
              <p>채팅 기록이 없습니다.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ChatHistoryPage;
