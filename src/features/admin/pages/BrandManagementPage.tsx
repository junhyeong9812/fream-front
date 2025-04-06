import React, { useState, useEffect } from "react";
import { FiSearch, FiPlus, FiX } from "react-icons/fi";
import { useTheme } from "../../../global/context/ThemeContext";
import { BrandService } from "../services/BrandService";
import {
  BrandRequestDto,
  BrandResponseDto,
  SortOption,
} from "../types/brandCollectionTypes";
import LoadingSpinner from "../../../global/components/common/LoadingSpinner";
import ErrorMessage from "../../../global/components/common/ErrorMessage";
import styles from "./BrandManagementPage.module.css";

const BrandManagementPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // 상태 관리
  const [brands, setBrands] = useState<BrandResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentBrand, setCurrentBrand] = useState<BrandResponseDto | null>(
    null
  );
  const [brandName, setBrandName] = useState<string>("");
  const [formError, setFormError] = useState<string | null>(null);

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  const pageSize = 10;

  // 정렬 상태
  const [sortOption, setSortOption] = useState<SortOption>({
    field: "name",
    order: "asc",
  });

  // 브랜드 데이터 로드
  const loadBrands = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await BrandService.getBrandsPaging(
        currentPage,
        pageSize,
        sortOption
      );

      setBrands(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (err) {
      console.error("브랜드 로드 실패:", err);
      setError("브랜드 데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 로드 및 페이지/정렬 변경 시 데이터 로드
  useEffect(() => {
    loadBrands();
  }, [currentPage, sortOption]);

  // 검색 처리
  const handleSearch = async () => {
    setCurrentPage(0);
    setIsLoading(true);
    setError(null);

    try {
      if (searchKeyword.trim()) {
        const response = await BrandService.searchBrands(
          searchKeyword,
          0,
          pageSize,
          sortOption
        );
        setBrands(response.content);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
      } else {
        loadBrands();
      }
    } catch (err) {
      console.error("브랜드 검색 실패:", err);
      setError("브랜드 검색 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 검색어 변경 핸들러
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  // 검색 폼 제출 핸들러
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  // 검색어 초기화 핸들러
  const handleClearSearch = () => {
    setSearchKeyword("");
    loadBrands();
  };

  // 정렬 변경 핸들러
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const [field, order] = value.split(",");
    setSortOption({
      field,
      order: order as "asc" | "desc",
    });
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 브랜드 추가 모달 열기
  const handleAddBrand = () => {
    setCurrentBrand(null);
    setBrandName("");
    setFormError(null);
    setShowModal(true);
  };

  // 브랜드 편집 모달 열기
  const handleEditBrand = (brand: BrandResponseDto) => {
    setCurrentBrand(brand);
    setBrandName(brand.name);
    setFormError(null);
    setShowModal(true);
  };

  // 브랜드 삭제 처리
  const handleDeleteBrand = async (brand: BrandResponseDto) => {
    if (!window.confirm(`브랜드 "${brand.name}"을(를) 삭제하시겠습니까?`)) {
      return;
    }

    try {
      await BrandService.deleteBrand(brand.name);
      alert("브랜드가 삭제되었습니다.");
      loadBrands();
    } catch (err) {
      console.error("브랜드 삭제 실패:", err);
      alert("브랜드 삭제 중 오류가 발생했습니다.");
    }
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // 브랜드 저장 (추가/수정)
  const handleSaveBrand = async () => {
    if (!brandName.trim()) {
      setFormError("브랜드명을 입력해주세요.");
      return;
    }

    try {
      if (currentBrand) {
        // 브랜드 수정
        await BrandService.updateBrand(currentBrand.id, { name: brandName });
        alert("브랜드가 수정되었습니다.");
      } else {
        // 브랜드 추가
        await BrandService.createBrand({ name: brandName });
        alert("브랜드가 추가되었습니다.");
      }

      setShowModal(false);
      loadBrands();
    } catch (err) {
      console.error("브랜드 저장 실패:", err);
      setFormError("브랜드 저장 중 오류가 발생했습니다.");
    }
  };

  // 페이지네이션 렌더링
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageButtons = [];
    const displayedPages = 5;
    const halfDisplayed = Math.floor(displayedPages / 2);

    let startPage = Math.max(0, currentPage - halfDisplayed);
    let endPage = Math.min(totalPages - 1, startPage + displayedPages - 1);

    if (endPage - startPage < displayedPages - 1) {
      startPage = Math.max(0, endPage - displayedPages + 1);
    }

    // 처음 페이지 버튼
    if (currentPage > 0) {
      pageButtons.push(
        <button
          key="first"
          className={styles.pageButton}
          onClick={() => handlePageChange(0)}
        >
          {"<<"}
        </button>
      );

      // 이전 페이지 버튼
      pageButtons.push(
        <button
          key="prev"
          className={styles.pageButton}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          {"<"}
        </button>
      );
    }

    // 페이지 번호 버튼
    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <button
          key={i}
          className={`${styles.pageButton} ${
            currentPage === i ? styles.active : ""
          }`}
          onClick={() => handlePageChange(i)}
        >
          {i + 1}
        </button>
      );
    }

    // 다음 페이지 버튼
    if (currentPage < totalPages - 1) {
      pageButtons.push(
        <button
          key="next"
          className={styles.pageButton}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          {">"}
        </button>
      );

      // 마지막 페이지 버튼
      pageButtons.push(
        <button
          key="last"
          className={styles.pageButton}
          onClick={() => handlePageChange(totalPages - 1)}
        >
          {">>"}
        </button>
      );
    }

    return <div className={styles.pagination}>{pageButtons}</div>;
  };

  return (
    <div className={`${styles.brandManagement} ${isDark ? styles.dark : ""}`}>
      <h1 className={styles.pageTitle}>브랜드 관리</h1>

      <div className={styles.controlsContainer}>
        {/* 검색 영역 */}
        <form onSubmit={handleSearchSubmit} className={styles.searchContainer}>
          <input
            type="text"
            placeholder="브랜드명 검색"
            value={searchKeyword}
            onChange={handleSearchInputChange}
            className={styles.searchInput}
          />
          {searchKeyword && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={handleClearSearch}
              aria-label="검색어 지우기"
            >
              <FiX />
            </button>
          )}
          <button
            type="submit"
            className={styles.searchButton}
            aria-label="검색"
          >
            <FiSearch />
          </button>
        </form>

        {/* 추가 버튼 */}
        <div className={styles.actionsContainer}>
          <button className={styles.addButton} onClick={handleAddBrand}>
            <FiPlus /> 브랜드 추가
          </button>
        </div>
      </div>

      {/* 정렬 옵션 */}
      <div className={styles.sortContainer}>
        <span className={styles.sortLabel}>정렬:</span>
        <select
          className={styles.sortSelect}
          value={`${sortOption.field},${sortOption.order}`}
          onChange={handleSortChange}
        >
          <option value="name,asc">브랜드명 (오름차순)</option>
          <option value="name,desc">브랜드명 (내림차순)</option>
          <option value="id,asc">ID (오름차순)</option>
          <option value="id,desc">ID (내림차순)</option>
        </select>
      </div>

      {/* 데이터 로딩 중 */}
      {isLoading && (
        <div className={styles.loadingContainer}>
          <LoadingSpinner />
        </div>
      )}

      {/* 에러 메시지 */}
      {error && <ErrorMessage message={error} />}

      {/* 브랜드 목록 테이블 */}
      {!isLoading && !error && (
        <>
          <div className={styles.brandTable}>
            {brands.length === 0 ? (
              <div className={styles.emptyState}>
                {searchKeyword
                  ? "검색 결과가 없습니다."
                  : "등록된 브랜드가 없습니다."}
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th style={{ width: "80px" }}>ID</th>
                    <th>브랜드명</th>
                    <th className={styles.actionColumn}>작업</th>
                  </tr>
                </thead>
                <tbody>
                  {brands.map((brand) => (
                    <tr key={brand.id}>
                      <td>{brand.id}</td>
                      <td>{brand.name}</td>
                      <td className={styles.actionColumn}>
                        <button
                          className={styles.actionButton}
                          onClick={() => handleEditBrand(brand)}
                        >
                          수정
                        </button>
                        <button
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          onClick={() => handleDeleteBrand(brand)}
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* 페이지네이션 */}
          {renderPagination()}
        </>
      )}

      {/* 브랜드 추가/수정 모달 */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContainer}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {currentBrand ? "브랜드 수정" : "브랜드 추가"}
              </h2>
              <button
                className={styles.closeButton}
                onClick={handleCloseModal}
                aria-label="닫기"
              >
                <FiX />
              </button>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="brandName" className={styles.formLabel}>
                브랜드명
              </label>
              <input
                id="brandName"
                type="text"
                className={styles.formInput}
                placeholder="브랜드명을 입력하세요"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
              />
              {formError && <div className={styles.errorText}>{formError}</div>}
            </div>
            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={handleCloseModal}
              >
                취소
              </button>
              <button
                type="button"
                className={styles.saveButton}
                onClick={handleSaveBrand}
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandManagementPage;
