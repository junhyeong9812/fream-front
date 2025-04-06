import React, { useState, useEffect, useRef } from "react";
import {
  FAQCategory,
  CategoryKoreanMap,
  FAQResponseDto,
  FAQCreateRequestDto,
  FAQUpdateRequestDto,
} from "../types/faqManagementTypes";
import { FAQService } from "../services/faqManagementService";
import styles from "./FAQEditor.module.css";

// HTML 에디터 라이브러리 사용 (React-Quill로 예시)
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface FAQEditorProps {
  mode: "create" | "edit";
  initialFAQ?: FAQResponseDto;
  theme: "light" | "dark";
  onComplete: () => void;
  onCancel: () => void;
}

const FAQEditor: React.FC<FAQEditorProps> = ({
  mode,
  initialFAQ,
  theme,
  onComplete,
  onCancel,
}) => {
  // 가능한 카테고리 변환 함수
  const getCategoryFromString = (categoryStr: string): FAQCategory => {
    // 유효한 FAQCategory 값인지 확인
    return Object.values(FAQCategory).includes(categoryStr as FAQCategory)
      ? (categoryStr as FAQCategory)
      : FAQCategory.GENERAL; // 기본값
  };

  // 상태 관리
  const [question, setQuestion] = useState<string>(initialFAQ?.question || "");
  const [answer, setAnswer] = useState<string>(initialFAQ?.answer || "");
  const [category, setCategory] = useState<FAQCategory>(
    initialFAQ?.category
      ? getCategoryFromString(initialFAQ.category)
      : FAQCategory.GENERAL
  );
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>(
    initialFAQ?.imageUrls || []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 카테고리 배열
  const categories = Object.values(FAQCategory);

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
    setCategory(event.target.value as FAQCategory);
  };

  // 에디터 콘텐츠 변경 핸들러
  const handleAnswerChange = (value: string) => {
    setAnswer(value);
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

      // 입력값 검증
      if (!question.trim()) {
        setError("질문을 입력해주세요.");
        return;
      }

      if (!answer.trim()) {
        setError("답변을 입력해주세요.");
        return;
      }

      if (mode === "create") {
        // 생성 요청 객체 구성
        const createData: FAQCreateRequestDto = {
          question,
          answer,
          category,
          files: uploadedFiles,
        };

        // 저장 API 호출
        await FAQService.createFAQ(createData);
        alert("FAQ가 등록되었습니다.");
        onComplete();
      } else if (mode === "edit" && initialFAQ) {
        // 수정 요청 객체 구성
        const updateData: FAQUpdateRequestDto = {
          question,
          answer,
          category,
          existingImageUrls,
          newFiles: uploadedFiles,
        };

        // 수정 API 호출
        await FAQService.updateFAQ(initialFAQ.id, updateData);
        alert("FAQ가 수정되었습니다.");
        onComplete();
      }
    } catch (err) {
      console.error("Failed to save FAQ:", err);
      setError("FAQ를 저장하는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 미리보기 토글
  const togglePreview = () => {
    setPreview(!preview);
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
        {mode === "create" ? "새 FAQ 작성" : "FAQ 수정"}
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
              {CategoryKoreanMap[cat]}
            </option>
          ))}
        </select>
      </div>

      {/* 질문 입력 */}
      <div className={styles.formGroup}>
        <label htmlFor="question" className={styles.label}>
          질문
        </label>
        <input
          id="question"
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="FAQ 질문을 입력하세요"
          className={styles.questionInput}
        />
      </div>

      {/* 에디터 / 미리보기 토글 */}
      <div className={styles.editorToolbar}>
        <button
          type="button"
          onClick={togglePreview}
          className={`${styles.previewToggle} ${preview ? styles.active : ""}`}
        >
          {preview ? "에디터로 돌아가기" : "미리보기"}
        </button>
      </div>

      {/* 에디터 / 미리보기 */}
      <div className={styles.formGroup}>
        {preview ? (
          <div className={styles.previewContainer}>
            <div className={styles.previewHeader}>
              <h3 className={styles.previewQuestion}>
                {question || "질문 없음"}
              </h3>
              <span className={styles.previewCategory}>
                {CategoryKoreanMap[category]}
              </span>
            </div>
            <div
              className={styles.previewAnswer}
              dangerouslySetInnerHTML={{ __html: answer }}
            />
          </div>
        ) : (
          <>
            <label htmlFor="answer" className={styles.label}>
              답변
            </label>
            <div className={styles.htmlEditor}>
              <ReactQuill
                value={answer}
                onChange={handleAnswerChange}
                modules={editorModules}
                placeholder="FAQ 답변을 입력하세요..."
                theme="snow"
              />
            </div>
            <p className={styles.imageGuide}>
              이미지 삽입은 하단의 이미지 파일 업로드 후 에디터에 추가할 수
              있습니다.
            </p>
          </>
        )}
      </div>

      {/* 파일 업로드 */}
      <div className={styles.formGroup}>
        <label className={styles.label}>이미지 파일</label>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          accept="image/*,video/*"
          className={styles.fileInput}
          style={{ display: "none" }}
        />
        <button
          type="button"
          onClick={triggerFileInput}
          className={styles.uploadButton}
        >
          이미지/비디오 파일 선택
        </button>
      </div>

      {/* 업로드된 파일 목록 */}
      {uploadedFiles.length > 0 && (
        <div className={styles.fileList}>
          <h3 className={styles.fileListTitle}>업로드할 파일</h3>
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
          <h3 className={styles.fileListTitle}>기존 첨부 파일</h3>
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
          {loading ? "저장 중..." : mode === "create" ? "등록" : "수정"}
        </button>
      </div>
    </div>
  );
};

export default FAQEditor;
