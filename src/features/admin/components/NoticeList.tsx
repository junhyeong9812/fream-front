import React from "react";
import {
  NoticeResponseDto,
  NoticeCategory,
  CategoryKoreanMap,
} from "../types/noticeManagementTypes";
import styles from "./NoticeList.module.css";

interface NoticeListProps {
  notices: NoticeResponseDto[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onViewNotice: (notice: NoticeResponseDto) => void;
  theme: "light" | "dark";
}

const NoticeList: React.FC<NoticeListProps> = ({
  notices,
  currentPage,
  totalPages,
  onPageChange,
  onViewNotice,
  theme,
}) => {
  // 날짜 포맷 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  // 안전하게 카테고리 표시 처리
  const getCategoryDisplay = (category: string): string => {
    // 유효한 NoticeCategory 값인지 확인
    return Object.values(NoticeCategory).includes(category as NoticeCategory)
      ? CategoryKoreanMap[category as NoticeCategory]
      : category;
  };

  // 페이지네이션 처리
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
      className={`${styles.noticeListContainer} ${
        theme === "dark" ? styles.dark : ""
      }`}
    >
      {notices.length === 0 ? (
        <div className={styles.emptyNotice}>
          <p>등록된 공지사항이 없습니다.</p>
        </div>
      ) : (
        <>
          <div className={styles.tableContainer}>
            <table className={styles.noticeTable}>
              <thead>
                <tr>
                  <th className={styles.idCol}>번호</th>
                  <th className={styles.categoryCol}>분류</th>
                  <th className={styles.titleCol}>제목</th>
                  <th className={styles.dateCol}>등록일</th>
                  <th className={styles.actionCol}></th>
                </tr>
              </thead>
              <tbody>
                {notices.map((notice) => (
                  <tr
                    key={notice.id}
                    className={styles.noticeRow}
                    onDoubleClick={() => onViewNotice(notice)}
                  >
                    <td className={styles.idCol}>{notice.id}</td>
                    <td className={styles.categoryCol}>
                      {getCategoryDisplay(notice.category)}
                    </td>
                    <td className={styles.titleCol}>{notice.title}</td>
                    <td className={styles.dateCol}>
                      {formatDate(notice.createdDate)}
                    </td>
                    <td className={styles.actionCol}>
                      <button
                        onClick={() => onViewNotice(notice)}
                        className={styles.viewButton}
                      >
                        보기
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {renderPagination()}
        </>
      )}
    </div>
  );
};

export default NoticeList;
