import React, { useState, useEffect, useRef } from "react";
import {
  NoticeCategory,
  CategoryKoreanMap,
  NoticeResponseDto,
  NoticeCreateRequestDto,
  NoticeUpdateRequestDto,
} from "../types/noticeManagementTypes";
import { NoticeService } from "../services/noticeManagementService";
import styles from "./NoticeEditor.module.css";

// HTML 에디터 라이브러리 사용 (React-Quill로 예시)
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface NoticeEditorProps {
  mode: "create" | "edit";
  initialNotice?: NoticeResponseDto;
  theme: "light" | "dark";
  onComplete: () => void;
  onCancel: () => void;
}

const NoticeEditor: React.FC<NoticeEditorProps> = ({
  mode,
  initialNotice,
  theme,
  onComplete,
  onCancel,
}) => {
  // 가능한 카테고리 변환 함수
  const getCategoryFromString = (categoryStr: string): NoticeCategory => {
    // 유효한 NoticeCategory 값인지 확인
    return Object.values(NoticeCategory).includes(categoryStr as NoticeCategory)
      ? (categoryStr as NoticeCategory)
      : NoticeCategory.ANNOUNCEMENT; // 기본값
  };

  // 상태 관리
  const [title, setTitle] = useState<string>(initialNotice?.title || "");
  const [content, setContent] = useState<string>(initialNotice?.content || "");
  const [category, setCategory] = useState<NoticeCategory>(
    initialNotice?.category
      ? getCategoryFromString(initialNotice.category)
      : NoticeCategory.ANNOUNCEMENT
  );
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>(
    initialNotice?.imageUrls || []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 카테고리 배열
  const categories = Object.values(NoticeCategory);

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
    setCategory(event.target.value as NoticeCategory);
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

      // 입력값 검증
      if (!title.trim()) {
        setError("제목을 입력해주세요.");
        return;
      }

      if (!content.trim()) {
        setError("내용을 입력해주세요.");
        return;
      }

      if (mode === "create") {
        // 생성 요청 객체 구성
        const createData: NoticeCreateRequestDto = {
          title,
          content,
          category,
          files: uploadedFiles,
        };

        // 저장 API 호출
        await NoticeService.createNotice(createData);
        alert("공지사항이 등록되었습니다.");
        onComplete();
      } else if (mode === "edit" && initialNotice) {
        // 수정 요청 객체 구성
        const updateData: NoticeUpdateRequestDto = {
          title,
          content,
          category,
          existingImageUrls,
          newFiles: uploadedFiles,
        };

        // 수정 API 호출
        await NoticeService.updateNotice(initialNotice.id, updateData);
        alert("공지사항이 수정되었습니다.");
        onComplete();
      }
    } catch (err) {
      console.error("Failed to save notice:", err);
      setError("공지사항을 저장하는 중 오류가 발생했습니다.");
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
        {mode === "create" ? "새 공지사항 작성" : "공지사항 수정"}
      </h2>

      {/* 제목 입력 */}
      <div className={styles.formGroup}>
        <label htmlFor="title" className={styles.label}>
          제목
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="공지사항 제목을 입력하세요"
          className={styles.titleInput}
        />
      </div>

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
              <h3 className={styles.previewTitle}>{title || "제목 없음"}</h3>
              <span className={styles.previewCategory}>
                {CategoryKoreanMap[category]}
              </span>
            </div>
            <div
              className={styles.previewContent}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        ) : (
          <>
            <label htmlFor="content" className={styles.label}>
              내용
            </label>
            <div className={styles.htmlEditor}>
              <ReactQuill
                value={content}
                onChange={handleContentChange}
                modules={editorModules}
                placeholder="공지사항 내용을 입력하세요..."
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

export default NoticeEditor;
