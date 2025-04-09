import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiSave, FiArrowLeft, FiPlus, FiX, FiImage } from "react-icons/fi";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useTheme } from "../../../global/context/ThemeContext";
import {
  ProductColorCreateRequestDto,
  ProductColorUpdateRequestDto,
} from "../types/productManagementTypes";
import { AdminProductService } from "../services/adminProductService";
import { ProductColorService } from "../services/productColorService";
import LoadingSpinner from "../../../global/components/common/LoadingSpinner";
import ErrorMessage from "../../../global/components/common/ErrorMessage";
import SizeSelector from "../components/SizeSelector";
import styles from "./ProductColorPage.module.css";

// 타입 정의
type PageMode = "create" | "edit";
type CategoryType = "CLOTHING" | "SHOES" | "ACCESSORIES";

// Quill 에디터 모듈 설정
const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ color: [] }, { background: [] }],
    ["link", "image"],
    ["clean"],
  ],
};

const ProductColorPage: React.FC = () => {
  const { productId, colorId } = useParams<{
    productId: string;
    colorId: string;
  }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const mode: PageMode = colorId ? "edit" : "create";

  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const imagesInputRef = useRef<HTMLInputElement>(null);
  const detailImagesInputRef = useRef<HTMLInputElement>(null);

  // 상품 기본 정보
  const [productInfo, setProductInfo] = useState<any>(null);
  const [categoryType, setCategoryType] = useState<CategoryType>("SHOES");

  // 색상 정보 상태
  const [colorName, setColorName] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  // 이미지 관련 상태
  const [thumbnailImage, setThumbnailImage] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
  const [imagesPreviews, setImagesPreviews] = useState<string[]>([]);
  const [detailImages, setDetailImages] = useState<File[]>([]);
  const [detailImagesPreviews, setDetailImagesPreviews] = useState<string[]>(
    []
  );

  // 기존 이미지 상태 (수정 모드)
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [existingDetailImages, setExistingDetailImages] = useState<string[]>(
    []
  );

  // 로딩 및 에러 상태
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // 색상 옵션
  const colorOptions = [
    { value: "BLACK", label: "블랙" },
    { value: "GREY", label: "그레이" },
    { value: "WHITE", label: "화이트" },
    { value: "IVORY", label: "아이보리" },
    { value: "BEIGE", label: "베이지" },
    { value: "BROWN", label: "브라운" },
    { value: "KHAKI", label: "카키" },
    { value: "GREEN", label: "그린" },
    { value: "LIGHT_GREEN", label: "라이트그린" },
    { value: "MINT", label: "민트" },
    { value: "NAVY", label: "네이비" },
    { value: "BLUE", label: "블루" },
    { value: "SKY_BLUE", label: "스카이블루" },
    { value: "PURPLE", label: "퍼플" },
    { value: "PINK", label: "핑크" },
    { value: "RED", label: "레드" },
    { value: "ORANGE", label: "오렌지" },
    { value: "YELLOW", label: "옐로우" },
    { value: "SILVER", label: "실버" },
    { value: "GOLD", label: "골드" },
    { value: "MIX", label: "믹스" },
  ];

  // 상품 정보 로드
  useEffect(() => {
    if (productId) {
      setIsLoading(true);
      try {
        const loadProductData = async () => {
          // 관리자용 API를 통해 상품 정보 로드
          const productData =
            await AdminProductService.getProductDetailForAdmin(
              Number(productId)
            );

          setProductInfo(productData);

          // 카테고리 타입 설정
          if (productData.mainCategoryName === "신발") {
            setCategoryType("SHOES");
          } else if (productData.mainCategoryName === "의류") {
            setCategoryType("CLOTHING");
          } else {
            setCategoryType("ACCESSORIES");
          }
        };

        loadProductData();
      } catch (err) {
        console.error("상품 정보 로드 실패:", err);
        setError("상품 정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    }
  }, [productId]);

  // 색상 정보 로드 (수정 모드)
  useEffect(() => {
    const loadColorData = async () => {
      if (mode === "edit" && productId && colorId) {
        setIsLoading(true);
        try {
          // 색상 상세 정보를 API로 불러옴
          const colorData =
            await AdminProductService.getProductColorDetailForAdmin(
              Number(colorId)
            );

          setColorName(colorData.colorName);
          setContent(colorData.content);
          setSelectedSizes(colorData.sizes);

          // 기존 이미지 설정
          if (colorData.images && colorData.images.length > 0) {
            const imageUrls = colorData.images.map((img: any) => img.imageUrl);
            setExistingImages(imageUrls);
          }

          if (colorData.detailImages && colorData.detailImages.length > 0) {
            const detailImageUrls = colorData.detailImages.map(
              (img: any) => img.imageUrl
            );
            setExistingDetailImages(detailImageUrls);
          }

          // 썸네일 이미지 설정
          if (colorData.thumbnailImageUrl) {
            setThumbnailPreview(
              `/products/query/${productId}/images?imageName=${colorData.thumbnailImageUrl}`
            );
          }
        } catch (err) {
          console.error("색상 정보 로드 실패:", err);
          setError("색상 정보를 불러오는 중 오류가 발생했습니다.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadColorData();
  }, [mode, productId, colorId]);

  // 썸네일 이미지 변경 핸들러
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnailImage(file);

      // 이미지 미리보기 생성
      const reader = new FileReader();
      reader.onload = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 일반 이미지 추가 핸들러
  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setImages((prev) => [...prev, ...newFiles]);

      // 이미지 미리보기 생성
      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          setImagesPreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // 상세 이미지 추가 핸들러
  const handleDetailImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setDetailImages((prev) => [...prev, ...newFiles]);

      // 이미지 미리보기 생성
      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          setDetailImagesPreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // 일반 이미지 삭제 핸들러
  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagesPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // 상세 이미지 삭제 핸들러
  const handleRemoveDetailImage = (index: number) => {
    setDetailImages((prev) => prev.filter((_, i) => i !== index));
    setDetailImagesPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // 기존 일반 이미지 삭제 핸들러
  const handleRemoveExistingImage = (filename: string) => {
    setExistingImages((prev) => prev.filter((name) => name !== filename));
  };

  // 기존 상세 이미지 삭제 핸들러
  const handleRemoveExistingDetailImage = (filename: string) => {
    setExistingDetailImages((prev) => prev.filter((name) => name !== filename));
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!colorName) {
      setError("색상을 선택해주세요.");
      return;
    }

    if (selectedSizes.length === 0) {
      setError("최소 하나 이상의 사이즈를 선택해주세요.");
      return;
    }

    if (!thumbnailImage && !thumbnailPreview) {
      setError("대표 이미지를 등록해주세요.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();

      if (mode === "create") {
        // 색상 생성 요청 DTO
        const requestDto: ProductColorCreateRequestDto = {
          colorName,
          content,
          sizes: selectedSizes,
        };

        // JSON으로 변환해서 FormData에 추가
        formData.append(
          "requestDto",
          new Blob([JSON.stringify(requestDto)], { type: "application/json" })
        );

        // 이미지 파일 추가
        if (thumbnailImage) {
          formData.append("thumbnailImage", thumbnailImage);
        }

        if (images.length > 0) {
          images.forEach((image) => {
            formData.append("images", image);
          });
        }

        if (detailImages.length > 0) {
          detailImages.forEach((image) => {
            formData.append("detailImages", image);
          });
        }

        // API 호출
        await ProductColorService.createProductColor(
          Number(productId),
          formData
        );
        alert("상품 색상이 성공적으로 등록되었습니다.");
        navigate(`/admin/products/detail/${productId}`);
      } else if (mode === "edit" && productId && colorId) {
        // 색상 수정 요청 DTO
        const requestDto: ProductColorUpdateRequestDto = {
          colorName,
          content,
          existingImages,
          existingDetailImages,
          sizes: selectedSizes,
        };

        // JSON으로 변환해서 FormData에 추가
        formData.append(
          "requestDto",
          new Blob([JSON.stringify(requestDto)], { type: "application/json" })
        );

        // 이미지 파일 추가 (변경된 경우만)
        if (thumbnailImage) {
          formData.append("thumbnailImage", thumbnailImage);
        }

        if (images.length > 0) {
          images.forEach((image) => {
            formData.append("newImages", image);
          });
        }

        if (detailImages.length > 0) {
          detailImages.forEach((image) => {
            formData.append("newDetailImages", image);
          });
        }

        // API 호출
        await ProductColorService.updateProductColor(Number(colorId), formData);
        alert("상품 색상이 성공적으로 수정되었습니다.");
        navigate(`/admin/products/detail/${productId}`);
      }
    } catch (err) {
      console.error("폼 제출 실패:", err);
      setError("색상 정보 저장 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 사이즈 선택 변경 핸들러
  const handleSizeChange = (sizes: string[]) => {
    setSelectedSizes(sizes);
  };

  if (isLoading && !productInfo) {
    return <LoadingSpinner />;
  }

  return (
    <div
      className={`${styles.productColorPage} ${
        theme === "dark" ? styles.dark : ""
      }`}
    >
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>
          {mode === "create" ? "색상 등록" : "색상 수정"}
          {productInfo && (
            <span className={styles.productName}> - {productInfo.name}</span>
          )}
        </h1>
        <div className={styles.headerButtons}>
          <button
            className={styles.backButton}
            onClick={() => navigate(`/admin/products/detail/${productId}`)}
            title="뒤로 가기"
          >
            <FiArrowLeft /> 뒤로 가기
          </button>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* 상품 기본 정보 표시 */}
        {productInfo && (
          <div className={styles.productInfoSection}>
            <div className={styles.productBasicInfo}>
              <h3>
                {productInfo.name} <span>({productInfo.englishName})</span>
              </h3>
              <p>브랜드: {productInfo.brandName}</p>
              <p>
                카테고리: {productInfo.mainCategoryName} &gt;{" "}
                {productInfo.categoryName}
              </p>
              <p>모델번호: {productInfo.modelNumber}</p>
              <p>발매가: {productInfo.releasePrice.toLocaleString()}원</p>
            </div>
          </div>
        )}

        {/* 색상 정보 */}
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>색상 정보</h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="colorName" className={styles.label}>
                색상 <span className={styles.required}>*</span>
              </label>
              <select
                id="colorName"
                value={colorName}
                onChange={(e) => setColorName(e.target.value)}
                className={styles.select}
                required
              >
                <option value="">색상 선택</option>
                {colorOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                사이즈 <span className={styles.required}>*</span>
              </label>
              <SizeSelector
                categoryType={categoryType}
                selectedSizes={selectedSizes}
                onChange={handleSizeChange}
              />
            </div>
          </div>
        </div>

        {/* 이미지 업로드 */}
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>이미지</h2>

          {/* 대표 이미지 업로드 */}
          <div className={styles.thumbnailSection}>
            <h3 className={styles.subSectionTitle}>
              대표 이미지 <span className={styles.required}>*</span>
            </h3>
            <div className={styles.thumbnailContainer}>
              {thumbnailPreview ? (
                <div className={styles.thumbnailPreview}>
                  <img src={thumbnailPreview} alt="대표 이미지 미리보기" />
                  <button
                    type="button"
                    className={styles.removeThumbnailButton}
                    onClick={() => {
                      setThumbnailImage(null);
                      setThumbnailPreview("");
                    }}
                  >
                    <FiX />
                  </button>
                </div>
              ) : (
                <div
                  className={styles.thumbnailUpload}
                  onClick={() => thumbnailInputRef.current?.click()}
                >
                  <FiImage size={32} />
                  <span>대표 이미지 선택</span>
                </div>
              )}
              <input
                type="file"
                ref={thumbnailInputRef}
                onChange={handleThumbnailChange}
                accept="image/*"
                style={{ display: "none" }}
              />
            </div>
          </div>

          {/* 일반 이미지 업로드 */}
          <div className={styles.imagesSection}>
            <h3 className={styles.subSectionTitle}>추가 이미지</h3>
            <div className={styles.imagesGrid}>
              {/* 기존 이미지 (수정 모드) */}
              {existingImages.map((image, index) => (
                <div key={`existing-${index}`} className={styles.imagePreview}>
                  <img
                    src={`/products/query/${productId}/images?imageName=${image}`}
                    alt={`추가 이미지 ${index + 1}`}
                  />
                  <button
                    type="button"
                    className={styles.removeImageButton}
                    onClick={() => handleRemoveExistingImage(image)}
                  >
                    <FiX />
                  </button>
                </div>
              ))}

              {/* 새 이미지 미리보기 */}
              {imagesPreviews.map((preview, index) => (
                <div key={`new-${index}`} className={styles.imagePreview}>
                  <img
                    src={preview}
                    alt={`추가 이미지 ${existingImages.length + index + 1}`}
                  />
                  <button
                    type="button"
                    className={styles.removeImageButton}
                    onClick={() => handleRemoveImage(index)}
                  >
                    <FiX />
                  </button>
                </div>
              ))}

              {/* 이미지 추가 버튼 */}
              <div
                className={styles.addImageButton}
                onClick={() => imagesInputRef.current?.click()}
              >
                <FiPlus size={24} />
                <span>이미지 추가</span>
              </div>
              <input
                type="file"
                ref={imagesInputRef}
                onChange={handleImagesChange}
                accept="image/*"
                multiple
                style={{ display: "none" }}
              />
            </div>
          </div>

          {/* 상세 이미지 업로드 */}
          <div className={styles.detailImagesSection}>
            <h3 className={styles.subSectionTitle}>상세 이미지</h3>
            <div className={styles.imagesGrid}>
              {/* 기존 상세 이미지 (수정 모드) */}
              {existingDetailImages.map((image, index) => (
                <div
                  key={`existing-detail-${index}`}
                  className={styles.imagePreview}
                >
                  <img
                    src={`/products/query/${productId}/images?imageName=${image}`}
                    alt={`상세 이미지 ${index + 1}`}
                  />
                  <button
                    type="button"
                    className={styles.removeImageButton}
                    onClick={() => handleRemoveExistingDetailImage(image)}
                  >
                    <FiX />
                  </button>
                </div>
              ))}

              {/* 새 상세 이미지 미리보기 */}
              {detailImagesPreviews.map((preview, index) => (
                <div
                  key={`new-detail-${index}`}
                  className={styles.imagePreview}
                >
                  <img
                    src={preview}
                    alt={`상세 이미지 ${
                      existingDetailImages.length + index + 1
                    }`}
                  />
                  <button
                    type="button"
                    className={styles.removeImageButton}
                    onClick={() => handleRemoveDetailImage(index)}
                  >
                    <FiX />
                  </button>
                </div>
              ))}

              {/* 상세 이미지 추가 버튼 */}
              <div
                className={styles.addImageButton}
                onClick={() => detailImagesInputRef.current?.click()}
              >
                <FiPlus size={24} />
                <span>상세 이미지 추가</span>
              </div>
              <input
                type="file"
                ref={detailImagesInputRef}
                onChange={handleDetailImagesChange}
                accept="image/*"
                multiple
                style={{ display: "none" }}
              />
            </div>
          </div>
        </div>

        {/* 상세 설명 (리치 텍스트 에디터) */}
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>상품 상세 설명</h2>
          <div className={styles.editorContainer}>
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={quillModules}
              className={theme === "dark" ? styles.darkEditor : ""}
            />
          </div>
        </div>

        <div className={styles.formActions}>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            <FiSave />
            {isSubmitting
              ? "처리 중..."
              : mode === "create"
              ? "색상 등록"
              : "변경사항 저장"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductColorPage;
