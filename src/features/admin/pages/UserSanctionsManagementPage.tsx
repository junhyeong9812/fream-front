import React, { useState, useEffect } from "react";
import {
  FiEye,
  FiAlertTriangle,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import { useTheme } from "../../../global/context/ThemeContext";
import { SanctionService } from "../services/sanctionService";
import {
  UserSanction,
  SanctionSearchDto,
  SanctionStatusFilter,
  SortOption,
} from "../types/sanctionTypes";
import SanctionList from "../components/SanctionList";
import SanctionDetail from "../components/SanctionDetail";
import styles from "./UserSanctionsManagementPage.module.css";

// 간단한 로딩 스피너 컴포넌트
const LoadingSpinner: React.FC = () => (
  <div className={styles.loadingSpinner}>
    <div className={styles.spinner}></div>
    <p>로딩 중...</p>
  </div>
);

// 에러 메시지 컴포넌트
const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className={styles.errorMessage}>
    <FiAlertTriangle size={24} />
    <p>{message}</p>
  </div>
);

const UserSanctionsManagementPage: React.FC = () => {
  const { theme } = useTheme();

  // State management
  const [sanctions, setSanctions] = useState<UserSanction[]>([]);
  const [selectedSanction, setSelectedSanction] = useState<UserSanction | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showDetail, setShowDetail] = useState<boolean>(false);

  // Filter and sort states
  const [statusFilter, setStatusFilter] = useState<SanctionStatusFilter>("ALL");
  const [currentSort, setCurrentSort] = useState<SortOption>({
    field: "createdDate",
    order: "desc",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  const pageSize = 20;

  // Statistics
  const [sanctionStats, setSanctionStats] = useState({
    total: 0,
    active: 0,
    expired: 0,
    pending: 0,
  });

  // Load sanctions on component mount and when filters change
  useEffect(() => {
    loadSanctions();
  }, [statusFilter, currentSort, currentPage]);

  // Load sanctions function
  const loadSanctions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Configure search request
      const searchRequest: SanctionSearchDto = {
        status: statusFilter !== "ALL" ? statusFilter : undefined,
        sortOption: currentSort,
      };

      // Call API
      const response = await SanctionService.searchSanctions(
        searchRequest,
        currentPage,
        pageSize
      );

      // Process results
      setSanctions(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);

      // Load statistics
      const stats = await SanctionService.getSanctionStatistics();
      setSanctionStats(stats);
    } catch (err) {
      console.error("Failed to load sanctions:", err);
      setError("제재 정보를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // View sanction details
  const handleViewSanction = (sanction: UserSanction) => {
    setSelectedSanction(sanction);
    setShowDetail(true);
  };

  // Close detail view
  const handleCloseDetail = () => {
    setShowDetail(false);
  };

  // Handle status filter change
  const handleStatusFilterChange = (status: SanctionStatusFilter) => {
    setStatusFilter(status);
    setCurrentPage(0); // Reset to first page on filter change
  };

  // Handle sort change
  const handleSortChange = (sortOption: SortOption) => {
    setCurrentSort(sortOption);
    setCurrentPage(0); // Reset to first page on sort change
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle sanction action (approve, reject, cancel)
  const handleSanctionAction = async (
    action: "approve" | "reject" | "cancel",
    sanctionId: number,
    rejectionReason?: string
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      if (action === "approve") {
        await SanctionService.approveSanction(sanctionId);
      } else if (action === "reject") {
        // 거부 사유가 필요
        if (!rejectionReason) {
          throw new Error("거부 사유가 필요합니다.");
        }
        await SanctionService.rejectSanction(sanctionId, rejectionReason);
      } else if (action === "cancel") {
        await SanctionService.cancelSanction(sanctionId);
      }

      // Reload sanctions and close detail view
      await loadSanctions();
      setShowDetail(false);
    } catch (err) {
      console.error(`Failed to ${action} sanction:`, err);
      setError(
        `제재 ${
          action === "approve" ? "승인" : action === "reject" ? "거부" : "취소"
        } 중 오류가 발생했습니다.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`${styles.sanctionsManagement} ${
        theme === "dark" ? styles.dark : ""
      }`}
    >
      <h1 className={styles.pageTitle}>회원 제재 관리</h1>

      {/* Statistics summary */}
      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>전체 제재</div>
          <div className={styles.statValue}>{sanctionStats.total}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>활성 제재</div>
          <div className={styles.statValue}>{sanctionStats.active}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>만료된 제재</div>
          <div className={styles.statValue}>{sanctionStats.expired}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>승인 대기 중</div>
          <div className={styles.statValue}>{sanctionStats.pending}</div>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className={styles.tabContainer}>
        <button
          className={`${styles.tabButton} ${
            statusFilter === "ALL" ? styles.active : ""
          }`}
          onClick={() => handleStatusFilterChange("ALL")}
        >
          전체
        </button>
        <button
          className={`${styles.tabButton} ${
            statusFilter === "ACTIVE" ? styles.active : ""
          }`}
          onClick={() => handleStatusFilterChange("ACTIVE")}
        >
          <FiAlertTriangle /> 활성
        </button>
        <button
          className={`${styles.tabButton} ${
            statusFilter === "EXPIRED" ? styles.active : ""
          }`}
          onClick={() => handleStatusFilterChange("EXPIRED")}
        >
          <FiCheckCircle /> 만료됨
        </button>
        <button
          className={`${styles.tabButton} ${
            statusFilter === "PENDING" ? styles.active : ""
          }`}
          onClick={() => handleStatusFilterChange("PENDING")}
        >
          <FiXCircle /> 승인 대기중
        </button>
      </div>

      {/* Sanctions list or detail view */}
      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : showDetail && selectedSanction ? (
        <SanctionDetail
          sanction={selectedSanction}
          onBack={handleCloseDetail}
          onAction={handleSanctionAction}
          theme={theme}
        />
      ) : (
        <SanctionList
          sanctions={sanctions}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onViewSanction={handleViewSanction}
          onSortChange={handleSortChange}
          currentSort={currentSort}
          theme={theme}
        />
      )}
    </div>
  );
};

export default UserSanctionsManagementPage;
