import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiUpload, FiX } from "react-icons/fi";
import { useTheme } from "../../../global/context/ThemeContext";
import { EventService } from "../services/eventService";
import { EventDetailDto, UpdateEventRequestDto } from "../types/eventTypes";
import LoadingSpinner from "../../../global/components/common/LoadingSpinner";
import ErrorMessage from "../../../global/components/common/ErrorMessage";
import styles from "./EventEditPage.module.css";
import pageStyles from "./EventManagementPage.module.css";

const EventEditPage: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();

  // 상태 관리
  const [formData, setFormData] = useState<UpdateEventRequestDto>({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    keepImageFileNames: [],
  });
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [simpleImageFiles, setSimpleImageFiles] = useState<File[]>([]);
  const [simpleImagePreviews, setSimpleImagePreviews] = useState<
    Array<{ url: string; fileName: string; isExisting: boolean }>
  >([]);

  const [eventData, setEventData] = useState<EventDetailDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // 이벤트 데이터 로드
  useEffect(() => {
    const loadEventData = async () => {
      setIsLoading(true);
      try {
        if (!eventId) {
          setError("이벤트 ID가 유효하지 않습니다.");
          return;
        }

        const data = await EventService.getEventDetail(parseInt(eventId, 10));
        setEventData(data);

        // 폼 데이터 초기화
        setFormData({
          title: data.title,
          description: data.description,
          startDate: formatDateForInput(data.startDate),
          endDate: formatDateForInput(data.endDate),
          keepImageFileNames: [],
        });

        // 썸네일 미리보기 설정
        if (data.thumbnailUrl) {
          setThumbnailPreview(data.thumbnailUrl);
        }

        // 심플이미지 미리보기 설정
        if (data.simpleImageUrls && data.simpleImageUrls.length > 0) {
          const previews = data.simpleImageUrls.map((url) => {
            // URL에서 파일명 추출
            const fileName = extractFileNameFromUrl(url);
            return {
              url: url,
              fileName: fileName,
              isExisting: true, // 기존 이미지 표시
            };
          });
          setSimpleImagePreviews(previews);

          // 유지할 이미지 파일명 초기 설정
          const fileNames = previews.map((preview) => preview.fileName);
          setFormData((prev) => ({
            ...prev,
            keepImageFileNames: fileNames,
          }));
        }
      } catch (error) {
        console.error("이벤트 데이터 로드 실패:", error);
        setError("이벤트 정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    loadEventData();
  }, [eventId]);

  // 날짜 포맷 변환 (ISO 형식을 input datetime-local 형식으로)
  const formatDateForInput = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    // yyyy-MM-ddThh:mm 형식으로 반환
    return date.toISOString().slice(0, 16);
  };

  // URL에서 파일명 추출
  const extractFileNameFromUrl = (url: string): string => {
    // "/api/files/event/123/filename.jpg" 형식에서 "filename.jpg" 추출
    const parts = url.split("/");
    return parts[parts.length - 1];
  };

  // 입력 필드 변경 핸들러
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // 에러 메시지 초기화
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  // 썸네일 파일 변경 핸들러
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnailFile(file);

      // 파일 미리보기 URL 생성
      const previewUrl = URL.createObjectURL(file);
      setThumbnailPreview(previewUrl);

      // 에러 메시지 초기화
      if (formErrors["thumbnailFile"]) {
        setFormErrors({
          ...formErrors,
          thumbnailFile: "",
        });
      }
    }
  };

  // 심플 이미지 파일 변경 핸들러
  const handleSimpleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSimpleImageFiles((prevFiles) => [...prevFiles, ...files]);

      // 파일 미리보기 URL 생성
      const newPreviews = files.map((file) => ({
        url: URL.createObjectURL(file),
        fileName: file.name, // 새 파일은 원본 파일명 사용
        isExisting: false, // 새로 추가된 이미지 표시
      }));

      setSimpleImagePreviews((prevPreviews) => [
        ...prevPreviews,
        ...newPreviews,
      ]);
    }
  };

  // 심플 이미지 제거 핸들러
  const handleRemoveSimpleImage = (index: number) => {
    const imageToRemove = simpleImagePreviews[index];

    // 기존 이미지인 경우, keepImageFileNames에서 제거
    if (imageToRemove.isExisting) {
      setFormData((prev) => ({
        ...prev,
        keepImageFileNames: prev.keepImageFileNames.filter(
          (fileName) => fileName !== imageToRemove.fileName
        ),
      }));
    } else {
      // 새로 추가된 이미지인 경우, simpleImageFiles에서 제거
      const newImageIndex = simpleImagePreviews
        .filter((img) => !img.isExisting)
        .findIndex((img) => img.url === imageToRemove.url);

      if (newImageIndex !== -1) {
        setSimpleImageFiles((prevFiles) => {
          const newFiles = [...prevFiles];
          newFiles.splice(newImageIndex, 1);
          return newFiles;
        });
      }
    }

    // 미리보기 URL 해제 및 상태 업데이트
    URL.revokeObjectURL(imageToRemove.url);
    setSimpleImagePreviews((prevPreviews) =>
      prevPreviews.filter((_, i) => i !== index)
    );
  };

  // 폼 유효성 검사
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = "이벤트 제목을 입력해주세요.";
    }

    if (!formData.description.trim()) {
      errors.description = "이벤트 설명을 입력해주세요.";
    }

    if (!formData.startDate) {
      errors.startDate = "시작일을 선택해주세요.";
    }

    if (!formData.endDate) {
      errors.endDate = "종료일을 선택해주세요.";
    } else if (
      formData.startDate &&
      new Date(formData.startDate) > new Date(formData.endDate)
    ) {
      errors.endDate = "종료일은 시작일보다 이후로 설정해주세요.";
    }

    // 썸네일이 없고, 기존 썸네일도 없는 경우 에러
    if (!thumbnailFile && !thumbnailPreview) {
      errors.thumbnailFile = "썸네일 이미지를 업로드해주세요.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !eventId) {
      return;
    }

    setSubmitLoading(true);

    try {
      await EventService.updateEvent(
        parseInt(eventId, 10),
        formData,
        thumbnailFile || undefined,
        simpleImageFiles.length > 0 ? simpleImageFiles : undefined
      );

      alert("이벤트가 성공적으로 수정되었습니다.");
      navigate(`/admin/events/detail/${eventId}`);
    } catch (err) {
      console.error("이벤트 수정 실패:", err);
      setError("이벤트 수정 중 오류가 발생했습니다.");
    } finally {
      setSubmitLoading(false);
    }
  };

  // 취소 핸들러
  const handleCancel = () => {
    if (
      window.confirm(
        "이벤트 수정을 취소하시겠습니까? 변경한 내용은 저장되지 않습니다."
      )
    ) {
      navigate(`/admin/events/detail/${eventId}`);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div
        className={`${pageStyles.eventManagement} ${
          theme === "dark" ? pageStyles.dark : ""
        }`}
      >
        <ErrorMessage message={error} />
        <button
          className={pageStyles.backButton}
          onClick={() => navigate(`/admin/events/detail/${eventId}`)}
        >
          <FiArrowLeft /> 상세 페이지로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div
      className={`${pageStyles.eventManagement} ${
        theme === "dark" ? pageStyles.dark : ""
      }`}
    >
      <div className={pageStyles.pageTitle}>
        <button
          className={styles.backArrow}
          onClick={() => navigate(`/admin/events/detail/${eventId}`)}
          title="상세 페이지로 돌아가기"
        >
          <FiArrowLeft />
        </button>
        이벤트 수정
      </div>

      <form
        onSubmit={handleSubmit}
        className={`${styles.formContainer} ${
          theme === "dark" ? styles.dark : ""
        }`}
      >
        <h2 className={styles.formTitle}>이벤트 정보</h2>

        <div className={styles.formGrid}>
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label className={styles.formLabel}>이벤트 제목</label>
            <input
              type="text"
              name="title"
              className={styles.formInput}
              value={formData.title}
              onChange={handleInputChange}
              placeholder="이벤트 제목을 입력하세요"
            />
            {formErrors.title && (
              <div className={styles.errorMessage}>{formErrors.title}</div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>브랜드</label>
            <input
              type="text"
              className={styles.formInput}
              value={eventData?.brandName || ""}
              disabled
            />
            <small className={styles.helperText}>
              브랜드는 변경할 수 없습니다.
            </small>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>시작일</label>
            <input
              type="datetime-local"
              name="startDate"
              className={styles.formInput}
              value={formData.startDate}
              onChange={handleInputChange}
            />
            {formErrors.startDate && (
              <div className={styles.errorMessage}>{formErrors.startDate}</div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>종료일</label>
            <input
              type="datetime-local"
              name="endDate"
              className={styles.formInput}
              value={formData.endDate}
              onChange={handleInputChange}
            />
            {formErrors.endDate && (
              <div className={styles.errorMessage}>{formErrors.endDate}</div>
            )}
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label className={styles.formLabel}>이벤트 설명</label>
            <textarea
              name="description"
              className={styles.formTextarea}
              value={formData.description}
              onChange={handleInputChange}
              placeholder="이벤트 상세 설명을 입력하세요"
            ></textarea>
            {formErrors.description && (
              <div className={styles.errorMessage}>
                {formErrors.description}
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>썸네일 이미지</label>
            <label className={styles.imageUploadLabel}>
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleThumbnailChange}
              />
              <FiUpload /> 썸네일 변경
            </label>
            {formErrors.thumbnailFile && (
              <div className={styles.errorMessage}>
                {formErrors.thumbnailFile}
              </div>
            )}
            {thumbnailPreview && (
              <div className={styles.thumbnailPreview}>
                <img
                  src={thumbnailPreview}
                  alt="썸네일 미리보기"
                  className={styles.thumbnailPreviewImage}
                />
              </div>
            )}
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label className={styles.formLabel}>이벤트 이미지</label>
            <label className={styles.imageUploadLabel}>
              <input
                type="file"
                accept="image/*"
                multiple
                style={{ display: "none" }}
                onChange={handleSimpleImagesChange}
              />
              <FiUpload /> 이미지 추가
            </label>

            {simpleImagePreviews.length > 0 && (
              <div className={styles.simpleImagePreview}>
                {simpleImagePreviews.map((preview, index) => (
                  <div key={index} className={styles.simpleImageItem}>
                    <img src={preview.url} alt={`이미지 ${index + 1}`} />
                    <button
                      type="button"
                      className={styles.removeImageButton}
                      onClick={() => handleRemoveSimpleImage(index)}
                    >
                      <FiX />
                    </button>
                    {preview.isExisting && (
                      <div className={styles.existingImageBadge}>기존</div>
                    )}
                  </div>
                ))}
                <label
                  className={styles.imageUploadPlaceholder}
                  htmlFor="add-more-images"
                >
                  <FiUpload />
                  <input
                    id="add-more-images"
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: "none" }}
                    onChange={handleSimpleImagesChange}
                  />
                </label>
              </div>
            )}
          </div>
        </div>

        <div className={styles.formAction}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={handleCancel}
            disabled={submitLoading}
          >
            취소
          </button>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={submitLoading}
          >
            {submitLoading ? "수정 중..." : "이벤트 수정"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventEditPage;
