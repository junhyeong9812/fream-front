import React from "react";
import {
  FAQResponseDto,
  FAQCategory,
  CategoryKoreanMap,
} from "../types/faqManagementTypes";
import styles from "./FAQList.module.css";

interface FAQListProps {
  faqs: FAQResponseDto[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onViewFAQ: (faq: FAQResponseDto) => void;
  theme: "light" | "dark";
}

const FAQList: React.FC<FAQListProps> = ({
  faqs,
  currentPage,
  totalPages,
  onPageChange,
  onViewFAQ,
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
    // 유효한 FAQCategory 값인지 확인
    return Object.values(FAQCategory).includes(category as FAQCategory)
      ? CategoryKoreanMap[category as FAQCategory]
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
      className={`${styles.faqListContainer} ${
        theme === "dark" ? styles.dark : ""
      }`}
    >
      {faqs.length === 0 ? (
        <div className={styles.emptyFaq}>
          <p>등록된 FAQ가 없습니다.</p>
        </div>
      ) : (
        <>
          <div className={styles.tableContainer}>
            <table className={styles.faqTable}>
              <thead>
                <tr>
                  <th className={styles.idCol}>번호</th>
                  <th className={styles.categoryCol}>분류</th>
                  <th className={styles.questionCol}>질문</th>
                  <th className={styles.dateCol}>등록일</th>
                  <th className={styles.actionCol}></th>
                </tr>
              </thead>
              <tbody>
                {faqs.map((faq) => (
                  <tr
                    key={faq.id}
                    className={styles.faqRow}
                    onDoubleClick={() => onViewFAQ(faq)}
                  >
                    <td className={styles.idCol}>{faq.id}</td>
                    <td className={styles.categoryCol}>
                      {getCategoryDisplay(faq.category)}
                    </td>
                    <td className={styles.questionCol}>{faq.question}</td>
                    <td className={styles.dateCol}>
                      {faq.createdDate ? formatDate(faq.createdDate) : "-"}
                    </td>
                    <td className={styles.actionCol}>
                      <button
                        onClick={() => onViewFAQ(faq)}
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

export default FAQList;
