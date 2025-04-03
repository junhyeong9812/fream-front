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

  return (
    <div className={`${styles.viewer} ${theme === "dark" ? styles.dark : ""}`}>
      <div className={styles.header}>
        <h2 className={styles.category}>{categoryDisplay} 검수 기준</h2>
        <span className={styles.id}>ID: {standard.id}</span>
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
