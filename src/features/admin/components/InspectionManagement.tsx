import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  InspectionCategory,
  CategoryKoreanMap,
  InspectionStandardResponseDto,
  PageResponseDto,
} from "../types/inspectionStandardsTypes";
import { InspectionStandardService } from "../services/inspectionStandardService";
import { InspectionStandardEditor } from "./InspectionStandardEditor";
import { InspectionStandardViewer } from "./InspectionStandardViewer";
import styles from "./InspectionManagement.module.css";
import { ThemeContext } from "src/global/context/ThemeContext";

// 컴포넌트 Props 정의
interface InspectionManagementProps {
  // 필요시 추가 Props 정의
}

const InspectionManagement: React.FC<InspectionManagementProps> = () => {
  // 테마 컨텍스트 사용
  const { theme } = useContext(ThemeContext);

  // 상태 관리
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<InspectionCategory | null>(null);
  const [standards, setStandards] =
    useState<PageResponseDto<InspectionStandardResponseDto> | null>(null);
  const [selectedStandard, setSelectedStandard] =
    useState<InspectionStandardResponseDto | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [size] = useState<number>(10);

  // 카테고리 배열
  const categories = Object.values(InspectionCategory);

  // 검수 기준 조회 함수
  const fetchStandards = useCallback(
    async (category?: InspectionCategory) => {
      try {
        setLoading(true);
        setError(null);

        let result;
        if (category) {
          result = await InspectionStandardService.getByCategory(
            category,
            page,
            size
          );
        } else {
          result = await InspectionStandardService.getAll(page, size);
        }

        setStandards(result);

        // 자동으로 첫 번째 항목 선택
        if (result.content.length > 0 && !selectedStandard) {
          setSelectedStandard(result.content[0]);
        } else if (result.content.length === 0) {
          setSelectedStandard(null);
        }
      } catch (err) {
        setError("검수 기준을 불러오는 중 오류가 발생했습니다.");
        console.error("Failed to fetch standards:", err);
      } finally {
        setLoading(false);
      }
    },
    [page, size, selectedStandard]
  );

  // 카테고리 변경 시 데이터 조회
  useEffect(() => {
    if (selectedCategory) {
      fetchStandards(selectedCategory);
    } else {
      fetchStandards();
    }
  }, [selectedCategory, fetchStandards]);

  // 카테고리 선택 핸들러
  const handleCategorySelect = (category: InspectionCategory) => {
    setSelectedCategory(category);
    setPage(0);
    setSelectedStandard(null);
  };

  // 생성 모드 시작
  const handleStartCreate = () => {
    setIsCreating(true);
    setIsEditing(false);
    setSelectedStandard(null);
  };

  // 수정 모드 시작
  const handleStartEdit = () => {
    if (selectedStandard) {
      setIsEditing(true);
      setIsCreating(false);
    }
  };

  // 생성/수정 취소
  const handleCancel = () => {
    setIsEditing(false);
    setIsCreating(false);
  };

  // 생성 완료 핸들러
  const handleCreateComplete = (newStandard: InspectionStandardResponseDto) => {
    setIsCreating(false);
    setSelectedStandard(newStandard);
    // 현재 카테고리와 새로 생성된 표준의 카테고리가 일치하면 목록 새로고침
    if (selectedCategory === newStandard.category || !selectedCategory) {
      fetchStandards(selectedCategory || undefined);
    }
  };

  // 수정 완료 핸들러
  const handleUpdateComplete = (
    updatedStandard: InspectionStandardResponseDto
  ) => {
    setIsEditing(false);
    setSelectedStandard(updatedStandard);

    // 현재 카테고리와 업데이트된 표준의 카테고리가 일치하면 목록 새로고침
    if (selectedCategory === updatedStandard.category || !selectedCategory) {
      fetchStandards(selectedCategory || undefined);
    }
  };

  // 삭제 핸들러
  const handleDelete = async () => {
    if (!selectedStandard) return;

    if (window.confirm("정말로 이 검수 기준을 삭제하시겠습니까?")) {
      try {
        setLoading(true);
        await InspectionStandardService.delete(selectedStandard.id);
        setSelectedStandard(null);
        // 목록 새로고침
        fetchStandards(selectedCategory || undefined);
      } catch (err) {
        setError("검수 기준을 삭제하는 중 오류가 발생했습니다.");
        console.error("Failed to delete standard:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  // 페이지 변경 핸들러
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // 날짜 형식 변환 함수
  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div
      className={`${styles.inspectionManagement} ${
        theme === "dark" ? styles.dark : ""
      }`}
    >
      <h1 className={styles.title}>검수 기준 관리</h1>

      {/* 카테고리 선택 영역 */}
      <div className={styles.categoryGrid}>
        {categories.map((category) => (
          <button
            key={category}
            className={`${styles.categoryButton} ${
              selectedCategory === category ? styles.active : ""
            }`}
            onClick={() => handleCategorySelect(category as InspectionCategory)}
          >
            {CategoryKoreanMap[category as InspectionCategory]}
          </button>
        ))}
      </div>

      {/* 에러 메시지 */}
      {error && <div className={styles.error}>{error}</div>}

      {/* 로딩 표시 */}
      {loading && <div className={styles.loading}>로딩 중...</div>}

      {/* 생성/수정 모드 */}
      {isCreating && (
        <InspectionStandardEditor
          mode="create"
          initialCategory={selectedCategory}
          onComplete={handleCreateComplete}
          onCancel={handleCancel}
          theme={theme}
        />
      )}

      {isEditing && selectedStandard && (
        <InspectionStandardEditor
          mode="edit"
          standard={selectedStandard}
          onComplete={handleUpdateComplete}
          onCancel={handleCancel}
          theme={theme}
        />
      )}

      {/* 내용 표시 영역 (생성/수정 모드가 아닐 때) */}
      {!isCreating && !isEditing && (
        <div className={styles.contentArea}>
          {/* 왼쪽: 목록 */}
          <div className={styles.listSection}>
            {standards && standards.content.length > 0 ? (
              <>
                <ul className={styles.standardsList}>
                  {standards.content.map((standard) => (
                    <li
                      key={standard.id}
                      className={`${styles.standardItem} ${
                        selectedStandard?.id === standard.id
                          ? styles.activeItem
                          : ""
                      }`}
                      onClick={() => setSelectedStandard(standard)}
                    >
                      <span className={styles.standardCategory}>
                        {
                          CategoryKoreanMap[
                            standard.category as InspectionCategory
                          ]
                        }
                      </span>
                      <span className={styles.standardId}>#{standard.id}</span>
                      <span className={styles.standardDate}>
                        {formatDate(standard.createdDate)}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* 페이지네이션 */}
                {standards.totalPages > 1 && (
                  <div className={styles.pagination}>
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 0}
                      className={styles.pageButton}
                    >
                      이전
                    </button>
                    <span className={styles.pageInfo}>
                      {page + 1} / {standards.totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page >= standards.totalPages - 1}
                      className={styles.pageButton}
                    >
                      다음
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className={styles.noData}>
                {selectedCategory
                  ? `${CategoryKoreanMap[selectedCategory]} 카테고리에`
                  : ""}{" "}
                등록된 검수 기준이 없습니다.
              </div>
            )}
          </div>

          {/* 오른쪽: 내용 표시 및 액션 버튼 */}
          <div className={styles.viewerSection}>
            {selectedStandard ? (
              <>
                <InspectionStandardViewer
                  standard={selectedStandard}
                  theme={theme}
                />

                <div className={styles.actionButtons}>
                  <button
                    className={`${styles.button} ${styles.editButton}`}
                    onClick={handleStartEdit}
                  >
                    수정
                  </button>
                  <button
                    className={`${styles.button} ${styles.deleteButton}`}
                    onClick={handleDelete}
                  >
                    삭제
                  </button>
                </div>
              </>
            ) : (
              <div className={styles.placeholderText}>
                {standards && standards.content.length > 0
                  ? "왼쪽 목록에서 검수 기준을 선택해주세요."
                  : "검수 기준을 생성해주세요."}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 생성 버튼 (고정 위치, 생성/수정 모드가 아닐 때만 표시) */}
      {!isCreating && !isEditing && (
        <button className={styles.createButton} onClick={handleStartCreate}>
          새 검수 기준 생성
        </button>
      )}
    </div>
  );
};

export default InspectionManagement;
