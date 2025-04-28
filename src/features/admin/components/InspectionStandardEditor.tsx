import React, { useState, useEffect, useRef } from "react";
import {
  InspectionCategory,
  CategoryKoreanMap,
  InspectionStandardResponseDto,
  InspectionStandardCreateRequestDto,
  InspectionStandardUpdateRequestDto,
} from "../types/inspectionStandardsTypes";
import { InspectionStandardService } from "../services/inspectionStandardService";
import styles from "./InspectionStandardEditor.module.css";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface InspectionStandardEditorProps {
  mode: "create" | "edit";
  initialCategory?: InspectionCategory | null;
  standard?: InspectionStandardResponseDto;
  onComplete: (standard: InspectionStandardResponseDto) => void;
  onCancel: () => void;
  theme: "light" | "dark"; // 테마 prop 추가
}

export const InspectionStandardEditor: React.FC<
  InspectionStandardEditorProps
> = ({
  mode,
  initialCategory = null,
  standard,
  onComplete,
  onCancel,
  theme,
}) => {
  // 상태 관리
  const [category, setCategory] = useState<InspectionCategory>(
    initialCategory ||
      (standard?.category as InspectionCategory) ||
      InspectionCategory.SHOES
  );
  const [content, setContent] = useState<string>(standard?.content || "");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>(
    standard?.imageUrls || []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 카테고리 배열
  const categories = Object.values(InspectionCategory);

  // 파일 업로드 핸들러
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setUploadedFiles((prev) => [...prev, ...files]);
    }
  };

  // 카테고리 선택 핸들러
  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCategory(event.target.value as InspectionCategory);
  };

  // 에디터 콘텐츠 변경 핸들러
  const handleContentChange = (value: string) => {
    setContent(value);
  };

  // 업로드된 파일 제거 핸들러
  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // 기존 이미지 제거 핸들러
  const handleRemoveExistingImage = (index: number) => {
    setExistingImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // 파일 선택 트리거
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 저장 핸들러
  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!content.trim()) {
        setError("검수 기준 내용을 입력해주세요.");
        return;
      }

      if (mode === "create") {
        // 생성 요청 객체 구성
        const createData: InspectionStandardCreateRequestDto = {
          category,
          content,
          files: uploadedFiles,
        };

        // 저장 API 호출
        const result = await InspectionStandardService.create(createData);
        onComplete(result);
      } else if (mode === "edit" && standard) {
        // 수정 요청 객체 구성
        const updateData: InspectionStandardUpdateRequestDto = {
          category,
          content,
          existingImageUrls,
          newFiles: uploadedFiles,
        };

        // 수정 API 호출
        const result = await InspectionStandardService.update(
          standard.id,
          updateData
        );
        onComplete(result);
      }
    } catch (err) {
      console.error("Failed to save inspection standard:", err);
      setError("검수 기준을 저장하는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // HTML 에디터 설정
  const editorModules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["link", "image"],
      ["clean"],
    ],
  };

  return (
    <div className={`${styles.editor} ${theme === "dark" ? styles.dark : ""}`}>
      <h2 className={styles.editorTitle}>
        {mode === "create" ? "새 검수 기준 생성" : "검수 기준 수정"}
      </h2>

      {/* 카테고리 선택 */}
      <div className={styles.formGroup}>
        <label htmlFor="category" className={styles.label}>
          카테고리
        </label>
        <select
          id="category"
          value={category}
          onChange={handleCategoryChange}
          className={styles.select}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {CategoryKoreanMap[cat as InspectionCategory]}
            </option>
          ))}
        </select>
      </div>

      {/* 에디터 */}
      <div className={styles.formGroup}>
        <label htmlFor="content" className={styles.label}>
          내용
        </label>
        <div className={styles.htmlEditor}>
          <ReactQuill
            value={content}
            onChange={handleContentChange}
            modules={editorModules}
            placeholder="검수 기준 내용을 입력하세요..."
            theme="snow"
          />
        </div>
        <p className={styles.imageGuide}>
          이미지 삽입은 하단의 이미지 파일 업로드 후 에디터에 추가할 수
          있습니다.
        </p>
      </div>

      {/* 파일 업로드 */}
      <div className={styles.formGroup}>
        <label className={styles.label}>이미지 파일</label>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          accept="image/*"
          className={styles.fileInput}
          style={{ display: "none" }}
        />
        <button
          type="button"
          onClick={triggerFileInput}
          className={styles.uploadButton}
        >
          이미지 파일 선택
        </button>
      </div>

      {/* 업로드된 파일 목록 */}
      {uploadedFiles.length > 0 && (
        <div className={styles.fileList}>
          <h3 className={styles.fileListTitle}>업로드할 이미지 파일</h3>
          <ul>
            {uploadedFiles.map((file, index) => (
              <li key={index} className={styles.fileItem}>
                <span className={styles.fileName}>{file.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  className={styles.removeButton}
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 기존 이미지 파일 목록 (수정 모드) */}
      {mode === "edit" && existingImageUrls.length > 0 && (
        <div className={styles.fileList}>
          <h3 className={styles.fileListTitle}>기존 이미지 파일</h3>
          <ul>
            {existingImageUrls.map((url, index) => {
              // URL에서 파일명만 추출
              const fileName = url.split("/").pop() || url;
              return (
                <li key={index} className={styles.fileItem}>
                  <span className={styles.fileName}>{fileName}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(index)}
                    className={styles.removeButton}
                  >
                    삭제
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* 에러 메시지 */}
      {error && <div className={styles.error}>{error}</div>}

      {/* 버튼 영역 */}
      <div className={styles.buttonGroup}>
        <button
          type="button"
          onClick={onCancel}
          className={styles.cancelButton}
          disabled={loading}
        >
          취소
        </button>
        <button
          type="button"
          onClick={handleSave}
          className={styles.saveButton}
          disabled={loading}
        >
          {loading ? "저장 중..." : "저장"}
        </button>
      </div>
    </div>
  );
};
