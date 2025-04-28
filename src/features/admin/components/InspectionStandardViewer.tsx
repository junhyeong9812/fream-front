import React from "react";
import {
  InspectionStandardResponseDto,
  CategoryKoreanMap,
  InspectionCategory,
} from "../types/inspectionStandardsTypes";
import styles from "./InspectionStandardViewer.module.css";

interface InspectionStandardViewerProps {
  standard: InspectionStandardResponseDto;
  theme: "light" | "dark"; // 테마 prop 추가
}

export const InspectionStandardViewer: React.FC<
  InspectionStandardViewerProps
> = ({ standard, theme }) => {
  const categoryDisplay =
    CategoryKoreanMap[standard.category as InspectionCategory] ||
    standard.category;

  // 날짜 형식 변환 함수
  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={`${styles.viewer} ${theme === "dark" ? styles.dark : ""}`}>
      <div className={styles.header}>
        <h2 className={styles.category}>{categoryDisplay} 검수 기준</h2>
        <span className={styles.id}>ID: {standard.id}</span>
      </div>

      <div className={styles.dateInfo}>
        <span className={styles.dateItem}>
          <strong>생성일:</strong> {formatDate(standard.createdDate)}
        </span>
        {standard.modifiedDate && (
          <span className={styles.dateItem}>
            <strong>수정일:</strong> {formatDate(standard.modifiedDate)}
          </span>
        )}
      </div>

      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: standard.content }}
      />

      {/* 이미지 URL 목록이 있다면 표시 */}
      {standard.imageUrls && standard.imageUrls.length > 0 && (
        <div className={styles.imageUrlSection}>
          <h3 className={styles.imageUrlTitle}>등록된 이미지 파일</h3>
          <ul className={styles.imageUrlList}>
            {standard.imageUrls.map((url, index) => {
              // URL에서 파일명만 추출
              const fileName = url.split("/").pop() || url;
              return (
                <li key={index} className={styles.imageUrlItem}>
                  <a
                    href={`/inspections/files/${standard.id}/${fileName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.imageUrlLink}
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
