import React, { useState, useEffect, useContext } from "react";
import { ThemeContext } from "src/global/context/ThemeContext";
import { ChatQuestionService } from "../services/chatQuestionService";
import {
  GPTUsageLogDto,
  PaginatedGPTUsageLogResponse,
  GPTSearchParams,
} from "../types/chatQuestionTypes";
import LoadingSpinner from "src/global/components/common/LoadingSpinner";
import ErrorMessage from "src/global/components/common/ErrorMessage";
import styles from "./GPTUsageLogsPage.module.css";
import { FiSearch, FiRefreshCw, FiFilter, FiDownload } from "react-icons/fi";

/**
 * GPT 사용량 로그 페이지
 * GPT API 사용량 로그를 조회하고 필터링할 수 있는 페이지
 */
const GPTUsageLogsPage: React.FC = () => {
  const { theme } = useContext(ThemeContext);
  const [usageLogs, setUsageLogs] =
    useState<PaginatedGPTUsageLogResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(20);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [searchParams, setSearchParams] = useState<GPTSearchParams>({
    startDate: (() => {
      // 기본값: 7일 전 날짜
      const date = new Date();
      date.setDate(date.getDate() - 7);
      return date.toISOString().split("T")[0];
    })(),
    endDate: new Date().toISOString().split("T")[0],
    modelName: "",
    requestType: "",
    userName: "",
    page: 0,
    size: 20,
  });
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // 로그 데이터 조회
  useEffect(() => {
    const fetchUsageLogs = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const logsData = await ChatQuestionService.getGPTUsageLogs(page, size);
        setUsageLogs(logsData);
        setTotalPages(logsData.totalPages);
      } catch (error) {
        console.error("사용량 로그 조회 오류:", error);
        setError("사용량 로그를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsageLogs();
  }, [page, size]);

  // 검색 처리
  const handleSearch = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 검색 조건 유효성 검사
      if (searchParams.startDate && searchParams.endDate) {
        if (new Date(searchParams.startDate) > new Date(searchParams.endDate)) {
          setError("시작 날짜는 종료 날짜보다 이전이어야 합니다.");
          setIsLoading(false);
          return;
        }

        // 6개월 제한
        const sixMonthsLater = new Date(searchParams.startDate);
        sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);

        if (new Date(searchParams.endDate) > sixMonthsLater) {
          setError("조회 기간은 최대 6개월까지 가능합니다.");
          setIsLoading(false);
          return;
        }
      }

      const searchData = await ChatQuestionService.searchGPTUsageLogs({
        ...searchParams,
        page: 0, // 검색 시 첫 페이지로 초기화
      });

      setUsageLogs(searchData);
      setTotalPages(searchData.totalPages);
      setPage(0); // 페이지 초기화
    } catch (error) {
      console.error("사용량 로그 검색 오류:", error);
      setError("사용량 로그를 검색하는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 필터 초기화
  const resetFilters = () => {
    setSearchParams({
      startDate: (() => {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        return date.toISOString().split("T")[0];
      })(),
      endDate: new Date().toISOString().split("T")[0],
      modelName: "",
      requestType: "",
      userName: "",
      page: 0,
      size: 20,
    });
    setPage(0);
    setShowFilters(false);
  };

  // 페이지 변경 처리
  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
      setSearchParams({
        ...searchParams,
        page: newPage,
      });
    }
  };

  // 검색 파라미터 업데이트
  const updateSearchParams = (
    key: keyof GPTSearchParams,
    value: string | number
  ) => {
    setSearchParams({
      ...searchParams,
      [key]: value,
    });
  };

  // 필터 토글
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // 페이지네이션 컴포넌트
  const renderPagination = () => {
    if (!usageLogs || usageLogs.totalElements === 0) return null;

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
            usageLogs.totalElements
          }건)`}
        </div>
      </div>
    );
  };

  // CSV 파일로 내보내기
  const exportToCsv = () => {
    if (!usageLogs || !usageLogs.content.length) return;

    // CSV 헤더
    const headers = [
      "ID",
      "사용자",
      "요청 유형",
      "입력 토큰",
      "출력 토큰",
      "총 토큰",
      "모델명",
      "요청 일시",
      "질문 내용",
    ];

    // CSV 행 데이터
    const rows = usageLogs.content.map((log) => [
      log.id,
      log.userName,
      log.requestType,
      log.promptTokens,
      log.completionTokens,
      log.totalTokens,
      log.modelName,
      log.requestDate,
      `"${log.questionContent.replace(/"/g, '""')}"`,
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
      `gpt_usage_logs_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className={`${styles.container} ${theme === "dark" ? styles.dark : ""}`}
    >
      <div className={styles.header}>
        <h1 className={styles.title}>GPT 사용량 로그</h1>
        <div className={styles.actions}>
          <button
            className={`${styles.actionButton} ${styles.filterButton}`}
            onClick={toggleFilters}
            title="필터 토글"
          >
            <FiFilter /> 필터
          </button>
          <button
            className={`${styles.actionButton} ${styles.resetButton}`}
            onClick={resetFilters}
            title="필터 초기화"
          >
            <FiRefreshCw /> 초기화
          </button>
          <button
            className={`${styles.actionButton} ${styles.exportButton}`}
            onClick={exportToCsv}
            disabled={!usageLogs || usageLogs.content.length === 0}
            title="CSV로 내보내기"
          >
            <FiDownload /> 내보내기
          </button>
        </div>
      </div>

      {showFilters && (
        <div className={styles.filterContainer}>
          <div className={styles.filterGroup}>
            <label htmlFor="startDate">시작 날짜:</label>
            <input
              type="date"
              id="startDate"
              value={searchParams.startDate}
              onChange={(e) => updateSearchParams("startDate", e.target.value)}
              className={styles.filterInput}
            />
          </div>
          <div className={styles.filterGroup}>
            <label htmlFor="endDate">종료 날짜:</label>
            <input
              type="date"
              id="endDate"
              value={searchParams.endDate}
              onChange={(e) => updateSearchParams("endDate", e.target.value)}
              className={styles.filterInput}
            />
          </div>
          <div className={styles.filterGroup}>
            <label htmlFor="modelName">모델명:</label>
            <input
              type="text"
              id="modelName"
              value={searchParams.modelName}
              onChange={(e) => updateSearchParams("modelName", e.target.value)}
              placeholder="예: gpt-3.5-turbo"
              className={styles.filterInput}
            />
          </div>
          <div className={styles.filterGroup}>
            <label htmlFor="requestType">요청 유형:</label>
            <input
              type="text"
              id="requestType"
              value={searchParams.requestType}
              onChange={(e) =>
                updateSearchParams("requestType", e.target.value)
              }
              placeholder="예: FAQ_CHAT"
              className={styles.filterInput}
            />
          </div>
          <div className={styles.filterGroup}>
            <label htmlFor="userName">사용자:</label>
            <input
              type="text"
              id="userName"
              value={searchParams.userName}
              onChange={(e) => updateSearchParams("userName", e.target.value)}
              placeholder="이메일 또는 이름"
              className={styles.filterInput}
            />
          </div>
          <button className={styles.searchButton} onClick={handleSearch}>
            <FiSearch /> 검색
          </button>
        </div>
      )}

      {error && (
        <ErrorMessage message={error} onRetry={handleSearch} theme={theme} />
      )}

      {isLoading ? (
        <LoadingSpinner
          size="large"
          text="GPT 사용량 로그를 불러오고 있습니다..."
        />
      ) : (
        <>
          {usageLogs && usageLogs.content.length > 0 ? (
            <>
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>사용자</th>
                      <th>요청 유형</th>
                      <th>입력 토큰</th>
                      <th>출력 토큰</th>
                      <th>총 토큰</th>
                      <th>모델명</th>
                      <th>요청 일시</th>
                      <th>질문 내용</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usageLogs.content.map((log) => (
                      <tr key={log.id}>
                        <td>{log.id}</td>
                        <td>{log.userName}</td>
                        <td>{log.requestType}</td>
                        <td>{log.promptTokens.toLocaleString()}</td>
                        <td>{log.completionTokens.toLocaleString()}</td>
                        <td>{log.totalTokens.toLocaleString()}</td>
                        <td>{log.modelName}</td>
                        <td>{log.requestDate}</td>
                        <td className={styles.questionCell}>
                          {log.questionContent}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {renderPagination()}
            </>
          ) : (
            <div className={styles.noData}>
              <p>로그 데이터가 없습니다.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GPTUsageLogsPage;
