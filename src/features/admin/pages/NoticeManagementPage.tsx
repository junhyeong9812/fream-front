import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../global/context/ThemeContext";
import { NoticeService } from "../services/noticeManagementService";
import {
  NoticeResponseDto,
  NoticeCategory,
} from "../types/noticeManagementTypes";
import NoticeList from "../components/NoticeList";
import NoticeSearchBar from "../components/NoticeSearchBar";
import NoticeFilterTabs from "../components/NoticeFilterTabs";
import NoticeViewer from "../components/NoticeViewer";
import NoticeEditor from "../components/NoticeEditor";
import LoadingSpinner from "../../../global/components/common/LoadingSpinner";
import ErrorMessage from "../../../global/components/common/ErrorMessage";
import styles from "./NoticeManagementPage.module.css";

// 페이지 모드 상태 타입
type PageMode = "list" | "view" | "create" | "edit";

const NoticeManagementPage: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  // 상태 관리
  const [pageMode, setPageMode] = useState<PageMode>("list");
  const [notices, setNotices] = useState<NoticeResponseDto[]>([]);
  const [selectedNotice, setSelectedNotice] =
    useState<NoticeResponseDto | null>(null);
  const [currentCategory, setCurrentCategory] = useState<NoticeCategory | null>(
    null
  );
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  const pageSize = 20;

  // 공지사항 데이터 로드
  const loadNotices = async (
    page: number = 0,
    category: NoticeCategory | null = null,
    keyword: string = ""
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      let response;

      if (keyword && category) {
        // 카테고리와 키워드로 검색
        response = await NoticeService.searchNoticesByCategoryAndKeyword(
          category,
          keyword,
          page,
          pageSize
        );
      } else if (keyword) {
        // 검색 API 호출
        response = await NoticeService.searchNotices(keyword, page, pageSize);
      } else if (category) {
        // 카테고리별 조회 API 호출
        response = await NoticeService.getNoticesByCategory(
          category,
          page,
          pageSize
        );
      } else {
        // 전체 조회 API 호출
        response = await NoticeService.getNotices(page, pageSize);
      }

      setNotices(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
      setCurrentPage(response.number);
    } catch (err) {
      console.error("공지사항 로드 실패:", err);
      setError("공지사항을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 로드 및 필터/페이지 변경 시 데이터 로드
  useEffect(() => {
    loadNotices(currentPage, currentCategory, searchKeyword);
  }, [currentPage, currentCategory]);

  // 검색 핸들러
  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    setCurrentPage(0); // 검색 시 첫 페이지로 리셋
    loadNotices(0, currentCategory, keyword);
  };

  // 카테고리 필터 핸들러
  const handleCategoryFilter = (category: NoticeCategory | null) => {
    setCurrentCategory(category);
    setCurrentPage(0); // 필터 변경 시 첫 페이지로 리셋
    // 검색어가 있는 경우 검색어와 함께 필터링
    loadNotices(0, category, searchKeyword);
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 공지사항 상세 보기
  const handleViewNotice = (notice: NoticeResponseDto) => {
    setSelectedNotice(notice);
    setPageMode("view");
  };

  // 공지사항 생성 모드로 전환
  const handleCreateNotice = () => {
    setSelectedNotice(null);
    setPageMode("create");
  };

  // 공지사항 수정 모드로 전환
  const handleEditNotice = (notice: NoticeResponseDto) => {
    setSelectedNotice(notice);
    setPageMode("edit");
  };

  // 공지사항 삭제
  const handleDeleteNotice = async (noticeId: number) => {
    if (!window.confirm("정말로 이 공지사항을 삭제하시겠습니까?")) {
      return;
    }

    setIsLoading(true);
    try {
      await NoticeService.deleteNotice(noticeId);
      alert("공지사항이 삭제되었습니다.");
      setPageMode("list");
      loadNotices(currentPage, currentCategory, searchKeyword);
    } catch (err) {
      console.error("공지사항 삭제 실패:", err);
      setError("공지사항 삭제 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 공지사항 생성 완료
  const handleCreateComplete = () => {
    setPageMode("list");
    loadNotices(0, currentCategory, searchKeyword); // 첫 페이지로 리셋하고 목록 갱신
  };

  // 공지사항 수정 완료
  const handleEditComplete = () => {
    setPageMode("list");
    loadNotices(currentPage, currentCategory, searchKeyword); // 현재 페이지 유지하고 목록 갱신
  };

  // 목록으로 돌아가기
  const handleBackToList = () => {
    setPageMode("list");
    setSelectedNotice(null);
  };

  // 렌더링 컨텐츠 결정
  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (error) {
      return <ErrorMessage message={error} />;
    }

    switch (pageMode) {
      case "view":
        return selectedNotice ? (
          <NoticeViewer
            notice={selectedNotice}
            theme={theme}
            onEdit={() => handleEditNotice(selectedNotice)}
            onDelete={() => handleDeleteNotice(selectedNotice.id)}
            onBack={handleBackToList}
          />
        ) : (
          <div className={styles.errorContainer}>
            <p>선택된 공지사항이 없습니다.</p>
            <button onClick={handleBackToList} className={styles.backButton}>
              목록으로
            </button>
          </div>
        );

      case "create":
        return (
          <NoticeEditor
            mode="create"
            theme={theme}
            onComplete={handleCreateComplete}
            onCancel={handleBackToList}
          />
        );

      case "edit":
        return selectedNotice ? (
          <NoticeEditor
            mode="edit"
            initialNotice={selectedNotice}
            theme={theme}
            onComplete={handleEditComplete}
            onCancel={handleBackToList}
          />
        ) : (
          <div className={styles.errorContainer}>
            <p>수정할 공지사항이 없습니다.</p>
            <button onClick={handleBackToList} className={styles.backButton}>
              목록으로
            </button>
          </div>
        );

      case "list":
      default:
        return (
          <div className={styles.listContainer}>
            <div className={styles.searchFilterContainer}>
              <NoticeSearchBar onSearch={handleSearch} theme={theme} />
              <NoticeFilterTabs
                currentCategory={currentCategory}
                onCategoryChange={handleCategoryFilter}
                theme={theme}
              />
            </div>

            <NoticeList
              notices={notices}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              onViewNotice={handleViewNotice}
              theme={theme}
            />

            <div className={styles.actionButtons}>
              <button
                onClick={handleCreateNotice}
                className={styles.createButton}
              >
                새 공지사항 작성
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className={`${styles.noticeManagement} ${
        theme === "dark" ? styles.dark : ""
      }`}
    >
      <h1 className={styles.pageTitle}>공지사항 관리</h1>
      {renderContent()}
    </div>
  );
};

export default NoticeManagementPage;
