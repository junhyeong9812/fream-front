import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiUpload, FiX } from "react-icons/fi";
import { useTheme } from "../../../global/context/ThemeContext";
import { EventService } from "../services/eventService";
import { BrandResponseDto } from "../types/brandCollectionTypes";
import { CreateEventRequestDto } from "../types/eventTypes";
import LoadingSpinner from "../../../global/components/common/LoadingSpinner";
import ErrorMessage from "../../../global/components/common/ErrorMessage";
import styles from "../styles/EventCreatePage.module.css";
import pageStyles from "../styles/EventManagementPage.module.css";
import { BrandService } from "../services/BrandService";

const EventCreatePage: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  // 상태 관리
  const [formData, setFormData] = useState<CreateEventRequestDto>({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    brandId: 0,
  });
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [simpleImageFiles, setSimpleImageFiles] = useState<File[]>([]);
  const [simpleImagePreviews, setSimpleImagePreviews] = useState<string[]>([]);

  const [brands, setBrands] = useState<BrandResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // 브랜드 데이터 로드
  useEffect(() => {
    const loadBrands = async () => {
      setIsLoading(true);
      try {
        const brandData = await BrandService.getAllBrands();
        setBrands(brandData);

        // 브랜드가 있으면 첫 번째 브랜드를 기본값으로 설정
        if (brandData.length > 0) {
          setFormData((prev) => ({
            ...prev,
            brandId: brandData[0].id,
          }));
        }
      } catch (error) {
        console.error("브랜드 로드 실패:", error);
        setError("브랜드 정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    loadBrands();
  }, []);

  // 입력 필드 변경 핸들러
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: name === "brandId" ? parseInt(value, 10) : value,
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
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setSimpleImagePreviews((prevPreviews) => [
        ...prevPreviews,
        ...newPreviews,
      ]);
    }
  };

  // 심플 이미지 제거 핸들러
  const handleRemoveSimpleImage = (index: number) => {
    setSimpleImageFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));

    // 미리보기 URL 해제 및 상태 업데이트
    URL.revokeObjectURL(simpleImagePreviews[index]);
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

    if (!formData.brandId) {
      errors.brandId = "브랜드를 선택해주세요.";
    }

    if (!thumbnailFile) {
      errors.thumbnailFile = "썸네일 이미지를 업로드해주세요.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitLoading(true);

    try {
      const eventId = await EventService.createEvent(
        formData,
        thumbnailFile || undefined,
        simpleImageFiles.length > 0 ? simpleImageFiles : undefined
      );

      alert("이벤트가 성공적으로 등록되었습니다.");
      navigate(`/admin/events/detail/${eventId}`);
    } catch (err) {
      console.error("이벤트 등록 실패:", err);
      setError("이벤트 등록 중 오류가 발생했습니다.");
    } finally {
      setSubmitLoading(false);
    }
  };

  // 취소 핸들러
  const handleCancel = () => {
    if (
      window.confirm(
        "이벤트 등록을 취소하시겠습니까? 입력한 내용은 저장되지 않습니다."
      )
    ) {
      navigate("/admin/events");
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
          onClick={() => navigate("/admin/events")}
        >
          <FiArrowLeft /> 목록으로 돌아가기
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
          className={pageStyles.backButton}
          onClick={() => navigate("/admin/events")}
          title="목록으로 돌아가기"
        >
          <FiArrowLeft />
        </button>
        이벤트 등록
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
            <select
              name="brandId"
              className={styles.formSelect}
              value={formData.brandId || ""}
              onChange={handleInputChange}
            >
              <option value="">브랜드 선택</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
            {formErrors.brandId && (
              <div className={styles.errorMessage}>{formErrors.brandId}</div>
            )}
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
              <FiUpload /> 썸네일 업로드
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
            <label className={styles.formLabel}>심플 이미지 (선택)</label>
            <label className={styles.imageUploadLabel}>
              <input
                type="file"
                accept="image/*"
                multiple
                style={{ display: "none" }}
                onChange={handleSimpleImagesChange}
              />
              <FiUpload /> 이미지 업로드
            </label>

            {simpleImagePreviews.length > 0 && (
              <div className={styles.simpleImagePreview}>
                {simpleImagePreviews.map((preview, index) => (
                  <div key={index} className={styles.simpleImageItem}>
                    <img src={preview} alt={`이미지 ${index + 1}`} />
                    <button
                      type="button"
                      className={styles.removeImageButton}
                      onClick={() => handleRemoveSimpleImage(index)}
                    >
                      <FiX />
                    </button>
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
            {submitLoading ? "등록 중..." : "이벤트 등록"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventCreatePage;
