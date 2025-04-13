import React from "react";
import { FiEye, FiChevronDown } from "react-icons/fi";
import {
  UserSanction,
  SortOption,
  SanctionStatus,
  SanctionType,
} from "../types/sanctionTypes";
import styles from "./SanctionList.module.css";

interface SanctionListProps {
  sanctions: UserSanction[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onViewSanction: (sanction: UserSanction) => void;
  onSortChange: (sortOption: SortOption) => void;
  currentSort: SortOption;
  theme: string;
}

const SanctionList: React.FC<SanctionListProps> = ({
  sanctions,
  currentPage,
  totalPages,
  onPageChange,
  onViewSanction,
  onSortChange,
  currentSort,
  theme,
}) => {
  // Format date function
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Get status badge class
  const getStatusBadgeClass = (status: SanctionStatus) => {
    switch (status) {
      case "ACTIVE":
        return styles.activeBadge;
      case "EXPIRED":
        return styles.expiredBadge;
      case "PENDING":
        return styles.pendingBadge;
      case "REJECTED":
        return styles.rejectedBadge;
      case "CANCELED":
        return styles.canceledBadge;
      default:
        return "";
    }
  };

  // Get status label
  const getStatusLabel = (status: SanctionStatus) => {
    switch (status) {
      case "ACTIVE":
        return "활성";
      case "EXPIRED":
        return "만료됨";
      case "PENDING":
        return "승인 대기중";
      case "REJECTED":
        return "거부됨";
      case "CANCELED":
        return "취소됨";
      default:
        return status;
    }
  };

  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [field, order] = e.target.value.split(",");
    onSortChange({ field, order: order as "asc" | "desc" });
  };

  // Get type label
  const getTypeLabel = (type: SanctionType) => {
    switch (type) {
      case "WARNING":
        return "경고";
      case "TEMPORARY_BAN":
        return "일시 정지";
      case "PERMANENT_BAN":
        return "영구 정지";
      case "FEATURE_RESTRICTION":
        return "기능 제한";
      default:
        return type;
    }
  };

  // 페이지네이션 렌더링
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    // 현재 페이지 그룹 계산 (5개씩 그룹화)
    const currentGroup = Math.floor(currentPage / 5);
    const startPage = currentGroup * 5;
    const endPage = Math.min(startPage + 4, totalPages - 1);

    const pageNumbers = [];

    // 이전 그룹 버튼
    if (currentGroup > 0) {
      pageNumbers.push(
        <button
          key="prev-group"
          onClick={() => onPageChange(startPage - 1)}
          className={styles.pageButton}
        >
          &lt;&lt;
        </button>
      );
    }

    // 이전 페이지 버튼
    if (currentPage > 0) {
      pageNumbers.push(
        <button
          key="prev-page"
          onClick={() => onPageChange(currentPage - 1)}
          className={styles.pageButton}
        >
          &lt;
        </button>
      );
    }

    // 페이지 번호 버튼
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`${styles.pageButton} ${
            currentPage === i ? styles.activePage : ""
          }`}
        >
          {i + 1}
        </button>
      );
    }

    // 다음 페이지 버튼
    if (currentPage < totalPages - 1) {
      pageNumbers.push(
        <button
          key="next-page"
          onClick={() => onPageChange(currentPage + 1)}
          className={styles.pageButton}
        >
          &gt;
        </button>
      );
    }

    // 다음 그룹 버튼
    if (endPage < totalPages - 1) {
      pageNumbers.push(
        <button
          key="next-group"
          onClick={() => onPageChange(endPage + 1)}
          className={styles.pageButton}
        >
          &gt;&gt;
        </button>
      );
    }

    return <div className={styles.pagination}>{pageNumbers}</div>;
  };

  return (
    <div
      className={`${styles.sanctionListContainer} ${
        theme === "dark" ? styles.dark : ""
      }`}
    >
      <div className={styles.listHeader}>
        <div className={styles.sortWrapper}>
          <label htmlFor="sanction-sort" className={styles.sortLabel}>
            정렬:
          </label>
          <div className={styles.selectWrapper}>
            <select
              id="sanction-sort"
              value={`${currentSort.field},${currentSort.order}`}
              onChange={handleSortChange}
              className={styles.sortSelect}
            >
              <option value="createdDate,desc">등록일 최신순</option>
              <option value="createdDate,asc">등록일 오래된순</option>
              <option value="startDate,desc">시작일 최신순</option>
              <option value="startDate,asc">시작일 오래된순</option>
              <option value="endDate,desc">종료일 최신순</option>
              <option value="endDate,asc">종료일 오래된순</option>
            </select>
            <FiChevronDown className={styles.selectIcon} />
          </div>
        </div>
      </div>

      <table className={styles.sanctionTable}>
        <thead>
          <tr>
            <th className={styles.idColumn}>ID</th>
            <th className={styles.userColumn}>사용자</th>
            <th className={styles.typeColumn}>제재 유형</th>
            <th className={styles.reasonColumn}>사유</th>
            <th className={styles.periodColumn}>기간</th>
            <th className={styles.statusColumn}>상태</th>
            <th className={styles.actionsColumn}>관리</th>
          </tr>
        </thead>
        <tbody>
          {sanctions.length > 0 ? (
            sanctions.map((sanction) => (
              <tr key={sanction.id}>
                <td className={styles.idColumn}>{sanction.id}</td>
                <td className={styles.userColumn}>
                  <div className={styles.userInfo}>
                    <div className={styles.userEmail}>{sanction.userEmail}</div>
                    <div className={styles.userName}>
                      {sanction.userProfileName || "-"}
                    </div>
                  </div>
                </td>
                <td className={styles.typeColumn}>
                  <span
                    className={`${styles.typeBadge} ${
                      styles[sanction.type.toLowerCase() + "Badge"]
                    }`}
                  >
                    {getTypeLabel(sanction.type)}
                  </span>
                </td>
                <td className={styles.reasonColumn}>
                  <div className={styles.reasonText}>{sanction.reason}</div>
                </td>
                <td className={styles.periodColumn}>
                  <div>{formatDate(sanction.startDate)}</div>
                  <div className={styles.endDate}>
                    {sanction.endDate ? formatDate(sanction.endDate) : "영구"}
                  </div>
                </td>
                <td className={styles.statusColumn}>
                  <span
                    className={`${styles.statusBadge} ${getStatusBadgeClass(
                      sanction.status
                    )}`}
                  >
                    {getStatusLabel(sanction.status)}
                  </span>
                </td>
                <td className={styles.actionsColumn}>
                  <button
                    className={styles.viewButton}
                    onClick={() => onViewSanction(sanction)}
                    title="상세 보기"
                  >
                    <FiEye />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className={styles.noData}>
                검색 결과가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className={styles.paginationContainer}>{renderPagination()}</div>
      )}
    </div>
  );
};

export default SanctionList;
