import React, { useState, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";
import {
  BrandResponseDto,
  CategoryResponseDto,
  CollectionResponseDto,
  GenderType,
  GenderKoreanMap,
  ProductSearchDto,
} from "../types/productManagementTypes";
import { ProductService } from "../services/productManagementService";
import styles from "./ProductFilter.module.css";

interface ProductFilterProps {
  onApplyFilter: (filter: ProductSearchDto) => void;
  theme: "light" | "dark";
}

const ProductFilter: React.FC<ProductFilterProps> = ({
  onApplyFilter,
  theme,
}) => {
  // 필터 상태
  const [filter, setFilter] = useState<ProductSearchDto>({});

  // 데이터 로딩 상태
  const [loading, setLoading] = useState<boolean>(true);

  // 필터 데이터
  const [brands, setBrands] = useState<BrandResponseDto[]>([]);
  const [mainCategories, setMainCategories] = useState<CategoryResponseDto[]>(
    []
  );
  const [subCategories, setSubCategories] = useState<CategoryResponseDto[]>([]);
  const [collections, setCollections] = useState<CollectionResponseDto[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);

  // 선택된 메인 카테고리
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>("");

  // 필터 데이터 로드
  useEffect(() => {
    const loadFilterData = async () => {
      setLoading(true);
      try {
        // 브랜드, 메인 카테고리, 컬렉션 데이터 로드
        const [brandsData, mainCategoriesData, collectionsData] =
          await Promise.all([
            ProductService.getBrands(),
            ProductService.getMainCategories(),
            ProductService.getCollections(),
          ]);

        setBrands(brandsData);
        setMainCategories(mainCategoriesData);
        setCollections(collectionsData);

        // 필터 데이터 로드
        const filterData = await ProductService.getFilterData();
        setColors(filterData.colors || []);
        setSizes(filterData.sizes || []);
      } catch (error) {
        console.error("필터 데이터 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFilterData();
  }, []);

  // 메인 카테고리 변경 시 서브 카테고리 로드
  useEffect(() => {
    const loadSubCategories = async () => {
      if (!selectedMainCategory) {
        setSubCategories([]);
        return;
      }

      try {
        const subCategoriesData = await ProductService.getSubCategories(
          selectedMainCategory
        );
        setSubCategories(subCategoriesData);
      } catch (error) {
        console.error("서브 카테고리 로드 실패:", error);
        setSubCategories([]);
      }
    };

    loadSubCategories();
  }, [selectedMainCategory]);

  // 필터 변경 핸들러
  const handleFilterChange = (key: keyof ProductSearchDto, value: any) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
  };

  // 메인 카테고리 변경 핸들러
  const handleMainCategoryChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setSelectedMainCategory(value);

    // 메인 카테고리가 변경되면 기존 카테고리 필터 초기화
    setFilter((prev) => ({ ...prev, categoryIds: [] }));
  };

  // 카테고리 선택 핸들러
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(e.target.value);
    if (isNaN(value) || value <= 0) {
      handleFilterChange("categoryIds", []);
    } else {
      handleFilterChange("categoryIds", [value]);
    }
  };

  // 브랜드 선택 핸들러
  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(e.target.value);
    if (isNaN(value) || value <= 0) {
      handleFilterChange("brandIds", []);
    } else {
      handleFilterChange("brandIds", [value]);
    }
  };

  // 컬렉션 선택 핸들러
  const handleCollectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(e.target.value);
    if (isNaN(value) || value <= 0) {
      handleFilterChange("collectionIds", []);
    } else {
      handleFilterChange("collectionIds", [value]);
    }
  };

  // 성별 선택 핸들러
  const handleGenderToggle = (gender: GenderType) => {
    setFilter((prev) => {
      const currentGenders = prev.genders || [];
      const genderIndex = currentGenders.indexOf(gender);

      let updatedGenders;
      if (genderIndex === -1) {
        // 추가
        updatedGenders = [...currentGenders, gender];
      } else {
        // 제거
        updatedGenders = [...currentGenders];
        updatedGenders.splice(genderIndex, 1);
      }

      return { ...prev, genders: updatedGenders };
    });
  };

  // 최소 가격 입력 핸들러
  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : undefined;
    handleFilterChange("minPrice", value);
  };

  // 최대 가격 입력 핸들러
  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : undefined;
    handleFilterChange("maxPrice", value);
  };

  // 필터 적용 핸들러
  const handleApplyFilter = () => {
    onApplyFilter(filter);
  };

  // 필터 초기화 핸들러
  const handleResetFilter = () => {
    setFilter({});
    setSelectedMainCategory("");
  };

  // 성별 선택 여부 확인
  const isGenderSelected = (gender: GenderType) => {
    return filter.genders?.includes(gender) || false;
  };

  return (
    <div
      className={`${styles.filterContainer} ${
        theme === "dark" ? styles.dark : ""
      }`}
    >
      <div className={styles.filterHeader}>
        <h3 className={styles.filterTitle}>상품 필터</h3>
        <button className={styles.resetButton} onClick={handleResetFilter}>
          필터 초기화
        </button>
      </div>

      <div className={styles.filterRow}>
        {/* 메인 카테고리 필터 */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>메인 카테고리</label>
          <div className={styles.selectContainer}>
            <select
              className={styles.select}
              value={selectedMainCategory}
              onChange={handleMainCategoryChange}
              disabled={loading}
            >
              <option value="">전체</option>
              {mainCategories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            <span className={styles.selectArrow}>
              <FiChevronDown />
            </span>
          </div>
        </div>

        {/* 서브 카테고리 필터 */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>서브 카테고리</label>
          <div className={styles.selectContainer}>
            <select
              className={styles.select}
              value={filter.categoryIds?.[0] || ""}
              onChange={handleCategoryChange}
              disabled={!selectedMainCategory || loading}
            >
              <option value="">전체</option>
              {subCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <span className={styles.selectArrow}>
              <FiChevronDown />
            </span>
          </div>
        </div>

        {/* 브랜드 필터 */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>브랜드</label>
          <div className={styles.selectContainer}>
            <select
              className={styles.select}
              value={filter.brandIds?.[0] || ""}
              onChange={handleBrandChange}
              disabled={loading}
            >
              <option value="">전체</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
            <span className={styles.selectArrow}>
              <FiChevronDown />
            </span>
          </div>
        </div>

        {/* 컬렉션 필터 */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>컬렉션</label>
          <div className={styles.selectContainer}>
            <select
              className={styles.select}
              value={filter.collectionIds?.[0] || ""}
              onChange={handleCollectionChange}
              disabled={loading}
            >
              <option value="">전체</option>
              {collections.map((collection) => (
                <option key={collection.id} value={collection.id}>
                  {collection.name}
                </option>
              ))}
            </select>
            <span className={styles.selectArrow}>
              <FiChevronDown />
            </span>
          </div>
        </div>
      </div>

      <div className={styles.filterRow}>
        {/* 성별 필터 */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>성별</label>
          <div className={styles.genderSelector}>
            {Object.values(GenderType).map((gender) => (
              <button
                key={gender}
                className={`${styles.genderButton} ${
                  isGenderSelected(gender) ? styles.active : ""
                }`}
                onClick={() => handleGenderToggle(gender)}
              >
                {GenderKoreanMap[gender]}
              </button>
            ))}
          </div>
        </div>

        {/* 가격 범위 필터 */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>가격 범위</label>
          <div className={styles.priceRangeContainer}>
            <input
              type="number"
              placeholder="최소 가격"
              className={styles.priceInput}
              value={filter.minPrice || ""}
              onChange={handleMinPriceChange}
              min={0}
            />
            <span className={styles.priceSeparator}>~</span>
            <input
              type="number"
              placeholder="최대 가격"
              className={styles.priceInput}
              value={filter.maxPrice || ""}
              onChange={handleMaxPriceChange}
              min={0}
            />
          </div>
        </div>
      </div>

      <button
        className={styles.applyButton}
        onClick={handleApplyFilter}
        disabled={loading}
      >
        필터 적용
      </button>
    </div>
  );
};

export default ProductFilter;
