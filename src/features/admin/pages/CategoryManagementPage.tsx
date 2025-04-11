import React, { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import { useTheme } from "../../../global/context/ThemeContext";
import { CategoryService } from "../services/CategoryService";
import {
  CategoryRequestDto,
  CategoryResponseDto,
} from "../types/categoryTypes";
import LoadingSpinner from "../../../global/components/common/LoadingSpinner";
import ErrorMessage from "../../../global/components/common/ErrorMessage";
import styles from "./CategoryManagementPage.module.css";

enum ModalType {
  NONE,
  ADD_MAIN,
  EDIT_MAIN,
  ADD_SUB,
  EDIT_SUB,
}

const CategoryManagementPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // 상태 관리
  const [mainCategories, setMainCategories] = useState<CategoryResponseDto[]>(
    []
  );
  const [subCategories, setSubCategories] = useState<CategoryResponseDto[]>([]);
  const [selectedMainCategory, setSelectedMainCategory] =
    useState<CategoryResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubLoading, setIsSubLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 모달 상태
  const [modalType, setModalType] = useState<ModalType>(ModalType.NONE);
  const [currentCategory, setCurrentCategory] =
    useState<CategoryResponseDto | null>(null);
  const [categoryName, setCategoryName] = useState<string>("");
  const [formError, setFormError] = useState<string | null>(null);

  // 메인 카테고리 데이터 로드
  const loadMainCategories = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await CategoryService.getAllMainCategories();
      setMainCategories(data);
    } catch (err) {
      console.error("메인 카테고리 로드 실패:", err);
      setError("메인 카테고리 데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 서브 카테고리 데이터 로드
  const loadSubCategories = async (mainCategoryName: string) => {
    setIsSubLoading(true);
    setError(null);

    try {
      const data = await CategoryService.getSubCategoriesByMain(
        mainCategoryName
      );
      setSubCategories(data);
    } catch (err) {
      console.error("서브 카테고리 로드 실패:", err);
      setError("서브 카테고리 데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsSubLoading(false);
    }
  };

  // 초기 로드
  useEffect(() => {
    loadMainCategories();
  }, []);

  // 메인 카테고리 선택 시 서브 카테고리 로드
  const handleSelectMainCategory = (category: CategoryResponseDto) => {
    setSelectedMainCategory(category);
    loadSubCategories(category.name);
  };

  // 메인 카테고리 추가 모달 열기
  const handleAddMainCategory = () => {
    setModalType(ModalType.ADD_MAIN);
    setCurrentCategory(null);
    setCategoryName("");
    setFormError(null);
  };

  // 메인 카테고리 수정 모달 열기
  const handleEditMainCategory = (
    category: CategoryResponseDto,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setModalType(ModalType.EDIT_MAIN);
    setCurrentCategory(category);
    setCategoryName(category.name);
    setFormError(null);
  };

  // 서브 카테고리 추가 모달 열기
  const handleAddSubCategory = () => {
    if (!selectedMainCategory) {
      alert("먼저 메인 카테고리를 선택해주세요.");
      return;
    }
    setModalType(ModalType.ADD_SUB);
    setCurrentCategory(null);
    setCategoryName("");
    setFormError(null);
  };

  // 서브 카테고리 수정 모달 열기
  const handleEditSubCategory = (category: CategoryResponseDto) => {
    setModalType(ModalType.EDIT_SUB);
    setCurrentCategory(category);
    setCategoryName(category.name);
    setFormError(null);
  };

  // 메인 카테고리 삭제 처리
  const handleDeleteMainCategory = async (
    category: CategoryResponseDto,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    if (
      !window.confirm(
        `"${category.name}" 메인 카테고리를 삭제하시겠습니까?\n관련된 모든 서브 카테고리도 함께 삭제됩니다.`
      )
    ) {
      return;
    }

    try {
      await CategoryService.deleteCategory(category.id);
      alert("카테고리가 삭제되었습니다.");
      loadMainCategories();
      if (selectedMainCategory?.id === category.id) {
        setSelectedMainCategory(null);
        setSubCategories([]);
      }
    } catch (err) {
      console.error("카테고리 삭제 실패:", err);
      alert("카테고리 삭제 중 오류가 발생했습니다.");
    }
  };

  // 서브 카테고리 삭제 처리
  const handleDeleteSubCategory = async (category: CategoryResponseDto) => {
    if (
      !window.confirm(`"${category.name}" 서브 카테고리를 삭제하시겠습니까?`)
    ) {
      return;
    }

    try {
      await CategoryService.deleteCategory(category.id);
      alert("카테고리가 삭제되었습니다.");
      if (selectedMainCategory) {
        loadSubCategories(selectedMainCategory.name);
      }
    } catch (err) {
      console.error("카테고리 삭제 실패:", err);
      alert("카테고리 삭제 중 오류가 발생했습니다.");
    }
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setModalType(ModalType.NONE);
  };

  // 카테고리 저장 (추가/수정)
  const handleSaveCategory = async () => {
    if (!categoryName.trim()) {
      setFormError("카테고리명을 입력해주세요.");
      return;
    }

    try {
      if (modalType === ModalType.ADD_MAIN) {
        // 메인 카테고리 추가
        const request: CategoryRequestDto = {
          mainCategoryName: categoryName,
        };
        await CategoryService.createCategory(request);
        alert("메인 카테고리가 추가되었습니다.");
        loadMainCategories();
      } else if (modalType === ModalType.EDIT_MAIN && currentCategory) {
        // 메인 카테고리 수정
        const request: CategoryRequestDto = {
          mainCategoryName: categoryName,
        };
        await CategoryService.updateCategory(currentCategory.id, request);
        alert("메인 카테고리가 수정되었습니다.");
        loadMainCategories();
        if (selectedMainCategory?.id === currentCategory.id) {
          setSelectedMainCategory({
            ...selectedMainCategory,
            name: categoryName,
          });
          loadSubCategories(categoryName);
        }
      } else if (modalType === ModalType.ADD_SUB && selectedMainCategory) {
        // 서브 카테고리 추가
        const request: CategoryRequestDto = {
          mainCategoryName: selectedMainCategory.name,
          subCategoryName: categoryName,
        };
        await CategoryService.createCategory(request);
        alert("서브 카테고리가 추가되었습니다.");
        loadSubCategories(selectedMainCategory.name);
      } else if (
        modalType === ModalType.EDIT_SUB &&
        currentCategory &&
        selectedMainCategory
      ) {
        // 서브 카테고리 수정
        const request: CategoryRequestDto = {
          mainCategoryName: selectedMainCategory.name,
          subCategoryName: categoryName,
        };
        await CategoryService.updateCategory(currentCategory.id, request);
        alert("서브 카테고리가 수정되었습니다.");
        loadSubCategories(selectedMainCategory.name);
      }

      handleCloseModal();
    } catch (err) {
      console.error("카테고리 저장 실패:", err);
      setFormError("카테고리 저장 중 오류가 발생했습니다.");
    }
  };

  // 모달 타이틀 렌더링
  const renderModalTitle = () => {
    switch (modalType) {
      case ModalType.ADD_MAIN:
        return "메인 카테고리 추가";
      case ModalType.EDIT_MAIN:
        return "메인 카테고리 수정";
      case ModalType.ADD_SUB:
        return "서브 카테고리 추가";
      case ModalType.EDIT_SUB:
        return "서브 카테고리 수정";
      default:
        return "";
    }
  };

  return (
    <div
      className={`${styles.categoryManagement} ${isDark ? styles.dark : ""}`}
    >
      <h1 className={styles.pageTitle}>카테고리 관리</h1>

      <div className={styles.categoriesContainer}>
        {/* 메인 카테고리 패널 */}
        <div className={styles.mainCategoriesPanel}>
          <div className={styles.panelTitle}>
            <span>메인 카테고리</span>
            <button
              className={styles.addButton}
              onClick={handleAddMainCategory}
            >
              <FiPlus /> 추가
            </button>
          </div>

          {isLoading ? (
            <div className={styles.loadingIndicator}>
              <LoadingSpinner />
            </div>
          ) : error ? (
            <ErrorMessage message={error} />
          ) : mainCategories.length === 0 ? (
            <div className={styles.emptyState}>
              등록된 메인 카테고리가 없습니다.
            </div>
          ) : (
            <div className={styles.categoryList}>
              {mainCategories.map((category) => (
                <div
                  key={category.id}
                  className={`${styles.categoryItem} ${
                    selectedMainCategory?.id === category.id
                      ? styles.active
                      : ""
                  }`}
                  onClick={() => handleSelectMainCategory(category)}
                >
                  <span className={styles.categoryName}>{category.name}</span>
                  <div className={styles.actionButtons}>
                    <button
                      className={styles.actionButton}
                      onClick={(e) => handleEditMainCategory(category, e)}
                      title="수정"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      className={`${styles.actionButton} ${styles.deleteButton}`}
                      onClick={(e) => handleDeleteMainCategory(category, e)}
                      title="삭제"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 서브 카테고리 패널 */}
        <div className={styles.subCategoriesPanel}>
          <div className={styles.panelTitle}>
            <span>
              {selectedMainCategory
                ? `${selectedMainCategory.name}의 서브 카테고리`
                : "서브 카테고리"}
            </span>
            <button
              className={styles.addButton}
              onClick={handleAddSubCategory}
              disabled={!selectedMainCategory}
            >
              <FiPlus /> 추가
            </button>
          </div>

          {!selectedMainCategory ? (
            <div className={styles.emptyState}>
              메인 카테고리를 선택하면 서브 카테고리가 여기에 표시됩니다.
            </div>
          ) : isSubLoading ? (
            <div className={styles.loadingIndicator}>
              <LoadingSpinner />
            </div>
          ) : error ? (
            <ErrorMessage message={error} />
          ) : subCategories.length === 0 ? (
            <div className={styles.emptyState}>
              등록된 서브 카테고리가 없습니다.
            </div>
          ) : (
            <div className={styles.categoryList}>
              {subCategories.map((category) => (
                <div key={category.id} className={styles.categoryItem}>
                  <span className={styles.categoryName}>{category.name}</span>
                  <div className={styles.actionButtons}>
                    <button
                      className={styles.actionButton}
                      onClick={() => handleEditSubCategory(category)}
                      title="수정"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      className={`${styles.actionButton} ${styles.deleteButton}`}
                      onClick={() => handleDeleteSubCategory(category)}
                      title="삭제"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 카테고리 추가/수정 모달 */}
      {modalType !== ModalType.NONE && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContainer}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{renderModalTitle()}</h2>
              <button
                className={styles.closeButton}
                onClick={handleCloseModal}
                aria-label="닫기"
              >
                <FiX />
              </button>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="categoryName" className={styles.formLabel}>
                카테고리명
              </label>
              <input
                id="categoryName"
                type="text"
                className={styles.formInput}
                placeholder="카테고리명을 입력하세요"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
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
                onClick={handleSaveCategory}
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

export default CategoryManagementPage;
