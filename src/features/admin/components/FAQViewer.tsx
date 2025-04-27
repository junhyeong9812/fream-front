import React from "react";
import {
  FAQResponseDto,
  FAQCategory,
  CategoryKoreanMap,
} from "../types/faqManagementTypes";
import styles from "./FAQViewer.module.css";

interface FAQViewerProps {
  faq: FAQResponseDto;
  theme: "light" | "dark";
  onEdit: () => void;
  onDelete: () => void;
  onBack: () => void;
}

const FAQViewer: React.FC<FAQViewerProps> = ({
  faq,
  theme,
  onEdit,
  onDelete,
  onBack,
}) => {
  // 날짜 포맷 함수
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")} ${String(
      date.getHours()
    ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  // 안전하게 카테고리 표시 처리
  const getCategoryDisplay = (category: string): string => {
    // 유효한 FAQCategory 값인지 확인
    return Object.values(FAQCategory).includes(category as FAQCategory)
      ? CategoryKoreanMap[category as FAQCategory]
      : category;
  };

  // 카테고리 표시용
  const categoryDisplay = getCategoryDisplay(faq.category);

  return (
    <div className={`${styles.viewer} ${theme === "dark" ? styles.dark : ""}`}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={onBack}>
          ← 목록으로
        </button>
        <div className={styles.actions}>
          <button className={styles.editButton} onClick={onEdit}>
            수정
          </button>
          <button className={styles.deleteButton} onClick={onDelete}>
            삭제
          </button>
        </div>
      </div>

      <div className={styles.faqInfo}>
        <h1 className={styles.question}>{faq.question}</h1>
        <div className={styles.meta}>
          <span className={styles.category}>{categoryDisplay}</span>
          <span className={styles.date}>
            등록일: {formatDate(faq.createdDate)}
            {faq.modifiedDate && ` (수정일: ${formatDate(faq.modifiedDate)})`}
          </span>
        </div>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.answerContainer}>
        <h2 className={styles.answerTitle}>답변</h2>
        <div
          className={styles.answer}
          dangerouslySetInnerHTML={{ __html: faq.answer }}
        />
      </div>

      {/* 이미지 URL 목록이 있다면 표시 */}
      {faq.imageUrls && faq.imageUrls.length > 0 && (
        <div className={styles.attachments}>
          <h3 className={styles.attachmentsTitle}>첨부 파일</h3>
          <ul className={styles.attachmentsList}>
            {faq.imageUrls.map((url, index) => {
              // URL에서 파일명만 추출
              const fileName = url.split("/").pop() || url;
              return (
                <li key={index} className={styles.attachmentItem}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.attachmentLink}
                  >
                    {fileName}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FAQViewer;
