import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../global/context/ThemeContext";
import { FAQService } from "../services/faqManagementService";
import { FAQResponseDto, FAQCategory } from "../types/faqManagementTypes";
import FAQList from "../components/FAQList";
import FAQSearchBar from "../components/FAQSearchBar";
import FAQFilterTabs from "../components/FAQFilterTabs";
import FAQViewer from "../components/FAQViewer";
import FAQEditor from "../components/FAQEditor";
import LoadingSpinner from "../../../global/components/common/LoadingSpinner";
import ErrorMessage from "../../../global/components/common/ErrorMessage";
import styles from "./FAQManagementPage.module.css";

// 페이지 모드 상태 타입
type PageMode = "list" | "view" | "create" | "edit";

const FAQManagementPage: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  // 상태 관리
  const [pageMode, setPageMode] = useState<PageMode>("list");
  const [faqs, setFaqs] = useState<FAQResponseDto[]>([]);
  const [selectedFAQ, setSelectedFAQ] = useState<FAQResponseDto | null>(null);
  const [currentCategory, setCurrentCategory] = useState<FAQCategory | null>(
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

  // FAQ 데이터 로드
  const loadFAQs = async (
    page: number = 0,
    category: FAQCategory | null = null,
    keyword: string = ""
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      let response;

      if (keyword) {
        // 검색 API 호출
        response = await FAQService.searchFAQs(keyword, page, pageSize);
      } else if (category) {
        // 카테고리별 조회 API 호출
        response = await FAQService.getFAQsByCategory(category, page, pageSize);
      } else {
        // 전체 조회 API 호출
        response = await FAQService.getFAQs(page, pageSize);
      }

      setFaqs(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
      setCurrentPage(response.number);
    } catch (err) {
      console.error("FAQ 로드 실패:", err);
      setError("FAQ를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 로드 및 필터/페이지 변경 시 데이터 로드
  useEffect(() => {
    loadFAQs(currentPage, currentCategory, searchKeyword);
  }, [currentPage, currentCategory]);

  // 검색 핸들러
  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    setCurrentPage(0); // 검색 시 첫 페이지로 리셋
    loadFAQs(0, null, keyword);
  };

  // 카테고리 필터 핸들러
  const handleCategoryFilter = (category: FAQCategory | null) => {
    setCurrentCategory(category);
    setCurrentPage(0); // 필터 변경 시 첫 페이지로 리셋
    setSearchKeyword(""); // 필터 변경 시 검색어 초기화
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // FAQ 상세 보기
  const handleViewFAQ = (faq: FAQResponseDto) => {
    setSelectedFAQ(faq);
    setPageMode("view");
  };

  // FAQ 생성 모드로 전환
  const handleCreateFAQ = () => {
    setSelectedFAQ(null);
    setPageMode("create");
  };

  // FAQ 수정 모드로 전환
  const handleEditFAQ = (faq: FAQResponseDto) => {
    setSelectedFAQ(faq);
    setPageMode("edit");
  };

  // FAQ 삭제
  const handleDeleteFAQ = async (faqId: number) => {
    if (!window.confirm("정말로 이 FAQ를 삭제하시겠습니까?")) {
      return;
    }

    setIsLoading(true);
    try {
      await FAQService.deleteFAQ(faqId);
      alert("FAQ가 삭제되었습니다.");
      setPageMode("list");
      loadFAQs(currentPage, currentCategory, searchKeyword);
    } catch (err) {
      console.error("FAQ 삭제 실패:", err);
      setError("FAQ 삭제 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // FAQ 생성 완료
  const handleCreateComplete = () => {
    setPageMode("list");
    loadFAQs(0, currentCategory, searchKeyword); // 첫 페이지로 리셋하고 목록 갱신
  };

  // FAQ 수정 완료
  const handleEditComplete = () => {
    setPageMode("list");
    loadFAQs(currentPage, currentCategory, searchKeyword); // 현재 페이지 유지하고 목록 갱신
  };

  // 목록으로 돌아가기
  const handleBackToList = () => {
    setPageMode("list");
    setSelectedFAQ(null);
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
        return selectedFAQ ? (
          <FAQViewer
            faq={selectedFAQ}
            theme={theme}
            onEdit={() => handleEditFAQ(selectedFAQ)}
            onDelete={() => handleDeleteFAQ(selectedFAQ.id)}
            onBack={handleBackToList}
          />
        ) : (
          <div className={styles.errorContainer}>
            <p>선택된 FAQ가 없습니다.</p>
            <button onClick={handleBackToList} className={styles.backButton}>
              목록으로
            </button>
          </div>
        );

      case "create":
        return (
          <FAQEditor
            mode="create"
            theme={theme}
            onComplete={handleCreateComplete}
            onCancel={handleBackToList}
          />
        );

      case "edit":
        return selectedFAQ ? (
          <FAQEditor
            mode="edit"
            initialFAQ={selectedFAQ}
            theme={theme}
            onComplete={handleEditComplete}
            onCancel={handleBackToList}
          />
        ) : (
          <div className={styles.errorContainer}>
            <p>수정할 FAQ가 없습니다.</p>
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
              <FAQSearchBar onSearch={handleSearch} theme={theme} />
              <FAQFilterTabs
                currentCategory={currentCategory}
                onCategoryChange={handleCategoryFilter}
                theme={theme}
              />
            </div>

            <FAQList
              faqs={faqs}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              onViewFAQ={handleViewFAQ}
              theme={theme}
            />

            <div className={styles.actionButtons}>
              <button onClick={handleCreateFAQ} className={styles.createButton}>
                새 FAQ 작성
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className={`${styles.faqManagement} ${
        theme === "dark" ? styles.dark : ""
      }`}
    >
      <h1 className={styles.pageTitle}>FAQ 관리</h1>
      {renderContent()}
    </div>
  );
};

export default FAQManagementPage;
