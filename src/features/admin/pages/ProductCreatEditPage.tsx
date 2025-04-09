import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiSave, FiArrowLeft, FiTrash2 } from "react-icons/fi";
import { useTheme } from "../../../global/context/ThemeContext";
import {
  ProductCreateRequestDto,
  ProductUpdateRequestDto,
  BrandResponseDto,
  CategoryResponseDto,
  CollectionResponseDto,
  GenderType,
  GenderKoreanMap,
} from "../types/productManagementTypes";
import { ProductService } from "../services/productManagementService";
import LoadingSpinner from "../../../global/components/common/LoadingSpinner";
import ErrorMessage from "../../../global/components/common/ErrorMessage";
import styles from "./ProductCreateEditPage.module.css";

// 타입 정의
type PageMode = "create" | "edit";

const ProductCreateEditPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const mode: PageMode = productId ? "edit" : "create";

  // 폼 상태
  const [formData, setFormData] = useState<ProductCreateRequestDto | ProductUpdateRequestDto>({
    name: "",
    englishName: "",
    releasePrice: 0,
    modelNumber: "",
    releaseDate: "",
    brandName: "",
    mainCategoryName: "",
    categoryName: "",
    collectionName: "",
    gender: GenderType.UNISEX,
  });

  // 드롭다운 옵션 상태
  const [brands, setBrands] = useState<BrandResponseDto[]>([]);
  const [mainCategories, setMainCategories] = useState<CategoryResponseDto[]>([]);
  const [subCategories, setSubCategories] = useState<CategoryResponseDto[]>([]);
  const [collections, setCollections] = useState<CollectionResponseDto[]>([]);

  // 로딩 및 에러 상태
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // 기존 데이터 로드 (수정 모드)
  useEffect(() => {
    const loadFormData = async () => {
      if (mode === "edit" && productId) {
        setIsLoading(true);
        try {
          // 실제로는 여기서 상품 상세 정보를 API로 불러와 formData에 설정해야 합니다.
          // const productData = await ProductService.getProductById(Number(productId));
          // setFormData(productData);
          
          // 지금은 예시 데이터를 사용합니다
          setFormData({
            name: "예시 상품명",
            englishName: "Example Product",
            releasePrice: 150000,
            modelNumber: "ABC-123",
            releaseDate: "2025-01-01",
            brandName: "Nike",
            mainCategoryName: "신발",
            categoryName: "스니커즈",
            collectionName: "Air Force",
            gender: GenderType.UNISEX,
          });
        } catch (err) {
          console.error("상품 정보 로드 실패:", err);
          setError("상품 정보를 불러오는 중 오류가 발생했습니다.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadFormData();
  }, [mode, productId]);

  // 드롭다운 옵션 로드
  useEffect(() => {
    const loadDropdownOptions = async () => {
      setIsLoading(true);
      try {
        // 브랜드 목록 로드
        const brandsList = await ProductService.getBrands();
        setBrands(brandsList);

        // 메인 카테고리 목록 로드
        const mainCategoriesList = await ProductService.getMainCategories();
        setMainCategories(mainCategoriesList);

        // 컬렉션 목록 로드
        const collectionsList = await ProductService.getCollections();
        setCollections(collectionsList);

        // 서브 카테고리는 메인 카테고리 선택 시 로드
      } catch (err) {
        console.error("드롭다운 옵션 로드 실패:", err);
        setError("필요한 데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    loadDropdownOptions();
  }, []);

  // 메인 카테고리 변경 시 서브 카테고리 로드
  useEffect(() => {
    const loadSubCategories = async () => {
      if (formData.mainCategoryName) {
        try {
          const subCategoriesList = await ProductService.getSubCategories(formData.mainCategoryName);
          setSubCategories(subCategoriesList);
          
          // 메인 카테고리가 변경되면 서브 카테고리를 초기화합니다
          if (mode === "create") {
            setFormData((prev) => ({ ...prev, categoryName: "" }));
          }
        } catch (err) {
          console.error("서브 카테고리 로드 실패:", err);
        }
      } else {
        setSubCategories([]);
      }
    };

    loadSubCategories();
  }, [formData.mainCategoryName, mode]);

  // 입력 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // 숫자 입력인 경우 형 변환
    if (name === "releasePrice") {
      setFormData((prev) => ({
        ...prev,
        [name]: parseInt(value) || 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (mode === "create") {
        // 상품 생성 API 호출
        const response = await ProductService.createProduct(formData as ProductCreateRequestDto);
        alert("상품이 성공적으로 등록되었습니다.");
        // 색상 등록 페이지로 이동
        navigate(`/admin/products/color/add/${response.id}`);
      } else if (mode === "edit" && productId) {
        // 상품 수정 API 호출
        await ProductService.updateProduct(Number(productId), formData as ProductUpdateRequestDto);
        alert("상품 정보가 성공적으로 수정되었습니다.");
        navigate(`/admin/products`);
      }
    } catch (err) {
      console.error("폼 제출 실패:", err);
      setError("상품 정보 저장 중 오류가 발생했습니다. 모든 필수 항목을 입력했는지 확인해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 삭제 핸들러
  const handleDelete = async () => {
    if (!productId) return;
    
    if (!window.confirm("정말로 이 상품을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      return;
    }

    setIsLoading(true);
    try {
      await ProductService.deleteProduct(Number(productId));
      alert("상품이 성공적으로 삭제되었습니다.");
      navigate("/admin/products");
    } catch (err) {
      console.error("상품 삭제 실패:", err);
      setError("상품 삭제 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={`${styles.productCreateEdit} ${theme === "dark" ? styles.dark : ""}`}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>
          {mode === "create" ? "상품 등록" : "상품 수정"}
        </h1>
        <div className={styles.headerButtons}>
          <button
            className={styles.backButton}
            onClick={() => navigate("/admin/products")}
            title="목록으로 돌아가기"
          >
            <FiArrowLeft /> 목록으로
          </button>
          {mode === "edit" && (
            <button
              className={styles.deleteButton}
              onClick={handleDelete}
              title="상품 삭제"
            >
              <FiTrash2 /> 삭제
            </button>
          )}
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>기본 정보</h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>
                상품명 <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={styles.input}
                required
                placeholder="상품명을 입력하세요"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="englishName" className={styles.label}>
                영문명 <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="englishName"
                name="englishName"
                value={formData.englishName}
                onChange={handleInputChange}
                className={styles.input}
                required
                placeholder="영문 상품명을 입력하세요"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="releasePrice" className={styles.label}>
                발매가 (원) <span className={styles.required}>*</span>
              </label>
              <input
                type="number"
                id="releasePrice"
                name="releasePrice"
                value={formData.releasePrice}
                onChange={handleInputChange}
                className={styles.input}
                required
                min="0"
                placeholder="발매가를 입력하세요"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="modelNumber" className={styles.label}>
                모델 번호 <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="modelNumber"
                name="modelNumber"
                value={formData.modelNumber}
                onChange={handleInputChange}
                className={styles.input}
                required
                placeholder="모델 번호를 입력하세요"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="releaseDate" className={styles.label}>
                발매일 <span className={styles.required}>*</span>
              </label>
              <input
                type="date"
                id="releaseDate"
                name="releaseDate"
                value={formData.releaseDate}
                onChange={handleInputChange}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="gender" className={styles.label}>
                성별 <span className={styles.required}>*</span>
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className={styles.select}
                required
              >
                {Object.entries(GenderType).map(([key, value]) => (
                  <option key={key} value={value}>
                    {GenderKoreanMap[value as GenderType]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>분류 정보</h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="brandName" className={styles.label}>
                브랜드 <span className={styles.required}>*</span>
              </label>
              <select
                id="brandName"
                name="brandName"
                value={formData.brandName}
                onChange={handleInputChange}
                className={styles.select}
                required
              >
                <option value="">브랜드 선택</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.name}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="mainCategoryName" className={styles.label}>
                메인 카테고리 <span className={styles.required}>*</span>
              </label>
              <select
                id="mainCategoryName"
                name="mainCategoryName"
                value={formData.mainCategoryName}
                onChange={handleInputChange}
                className={styles.select}
                required
              >
                <option value="">메인 카테고리 선택</option>
                {mainCategories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="categoryName" className={styles.label}>
                서브 카테고리 <span className={styles.required}>*</span>
              </label>
              <select
                id="categoryName"
                name="categoryName"
                value={formData.categoryName}
                onChange={handleInputChange}
                className={styles.select}
                required
                disabled={!formData.mainCategoryName}
              >
                <option value="">서브 카테고리 선택</option>
                {subCategories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="collectionName" className={styles.label}>
                컬렉션
              </label>
              <select
                id="collectionName"
                name="collectionName"
                value={formData.collectionName || ""}
                onChange={handleInputChange}
                className={styles.select}
              >
                <option value="">컬렉션 선택 (선택사항)</option>
                {collections.map((collection) => (
                  <option key={collection.id} value={collection.name}>
                    {collection.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className={styles.formActions}>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            <FiSave />
            {isSubmitting ? "처리 중..." : mode === "create" ? "상품 등록" : "변경사항 저장"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductCreateEditPage;