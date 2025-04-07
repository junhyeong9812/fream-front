import React, { useState, useEffect } from "react";
import { FiSearch, FiPlus, FiX } from "react-icons/fi";
import { useTheme } from "../../../global/context/ThemeContext";
import { CollectionService } from "../services/CollectionService";
import {
  CollectionRequestDto,
  CollectionResponseDto,
  SortOption,
} from "../types/brandCollectionTypes";
import LoadingSpinner from "../../../global/components/common/LoadingSpinner";
import ErrorMessage from "../../../global/components/common/ErrorMessage";
import styles from "./CollectionManagementPage.module.css";

const CollectionManagementPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // 상태 관리
  const [collections, setCollections] = useState<CollectionResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentCollection, setCurrentCollection] =
    useState<CollectionResponseDto | null>(null);
  const [collectionName, setCollectionName] = useState<string>("");
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

  // 컬렉션 데이터 로드
  const loadCollections = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await CollectionService.getCollectionsPaging(
        currentPage,
        pageSize,
        sortOption
      );

      setCollections(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (err) {
      console.error("컬렉션 로드 실패:", err);
      setError("컬렉션 데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 로드 및 페이지/정렬 변경 시 데이터 로드
  useEffect(() => {
    loadCollections();
  }, [currentPage, sortOption]);

  // 검색 처리
  const handleSearch = async () => {
    setCurrentPage(0);
    setIsLoading(true);
    setError(null);

    try {
      if (searchKeyword.trim()) {
        const response = await CollectionService.searchCollections(
          searchKeyword,
          0,
          pageSize,
          sortOption
        );
        setCollections(response.content);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
      } else {
        loadCollections();
      }
    } catch (err) {
      console.error("컬렉션 검색 실패:", err);
      setError("컬렉션 검색 중 오류가 발생했습니다.");
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
    loadCollections();
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

  // 컬렉션 추가 모달 열기
  const handleAddCollection = () => {
    setCurrentCollection(null);
    setCollectionName("");
    setFormError(null);
    setShowModal(true);
  };

  // 컬렉션 편집 모달 열기
  const handleEditCollection = (collection: CollectionResponseDto) => {
    setCurrentCollection(collection);
    setCollectionName(collection.name);
    setFormError(null);
    setShowModal(true);
  };

  // 컬렉션 삭제 처리
  const handleDeleteCollection = async (collection: CollectionResponseDto) => {
    if (
      !window.confirm(`컬렉션 "${collection.name}"을(를) 삭제하시겠습니까?`)
    ) {
      return;
    }

    try {
      await CollectionService.deleteCollection(collection.name);
      alert("컬렉션이 삭제되었습니다.");
      loadCollections();
    } catch (err) {
      console.error("컬렉션 삭제 실패:", err);
      alert("컬렉션 삭제 중 오류가 발생했습니다.");
    }
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // 컬렉션 저장 (추가/수정)
  const handleSaveCollection = async () => {
    if (!collectionName.trim()) {
      setFormError("컬렉션명을 입력해주세요.");
      return;
    }

    try {
      if (currentCollection) {
        // 컬렉션 수정
        await CollectionService.updateCollection(currentCollection.id, {
          name: collectionName,
        });
        alert("컬렉션이 수정되었습니다.");
      } else {
        // 컬렉션 추가
        await CollectionService.createCollection({ name: collectionName });
        alert("컬렉션이 추가되었습니다.");
      }

      setShowModal(false);
      loadCollections();
    } catch (err) {
      console.error("컬렉션 저장 실패:", err);
      setFormError("컬렉션 저장 중 오류가 발생했습니다.");
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
    <div
      className={`${styles.collectionManagement} ${isDark ? styles.dark : ""}`}
    >
      <h1 className={styles.pageTitle}>컬렉션 관리</h1>

      <div className={styles.controlsContainer}>
        {/* 검색 영역 */}
        <form onSubmit={handleSearchSubmit} className={styles.searchContainer}>
          <input
            type="text"
            placeholder="컬렉션명 검색"
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
          <button className={styles.addButton} onClick={handleAddCollection}>
            <FiPlus /> 컬렉션 추가
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
          <option value="name,asc">컬렉션명 (오름차순)</option>
          <option value="name,desc">컬렉션명 (내림차순)</option>
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

      {/* 컬렉션 목록 테이블 */}
      {!isLoading && !error && (
        <>
          <div className={styles.collectionTable}>
            {collections.length === 0 ? (
              <div className={styles.emptyState}>
                {searchKeyword
                  ? "검색 결과가 없습니다."
                  : "등록된 컬렉션이 없습니다."}
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th style={{ width: "80px" }}>ID</th>
                    <th>컬렉션명</th>
                    <th className={styles.actionColumn}>작업</th>
                  </tr>
                </thead>
                <tbody>
                  {collections.map((collection) => (
                    <tr key={collection.id}>
                      <td>{collection.id}</td>
                      <td>{collection.name}</td>
                      <td className={styles.actionColumn}>
                        <button
                          className={styles.actionButton}
                          onClick={() => handleEditCollection(collection)}
                        >
                          수정
                        </button>
                        <button
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          onClick={() => handleDeleteCollection(collection)}
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

      {/* 컬렉션 추가/수정 모달 */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContainer}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {currentCollection ? "컬렉션 수정" : "컬렉션 추가"}
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
              <label htmlFor="collectionName" className={styles.formLabel}>
                컬렉션명
              </label>
              <input
                id="collectionName"
                type="text"
                className={styles.formInput}
                placeholder="컬렉션명을 입력하세요"
                value={collectionName}
                onChange={(e) => setCollectionName(e.target.value)}
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
                onClick={handleSaveCollection}
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

export default CollectionManagementPage;
