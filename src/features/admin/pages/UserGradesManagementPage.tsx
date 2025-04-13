import React, { useState, useEffect } from "react";
import { FiEdit, FiPlusCircle } from "react-icons/fi";
import { useTheme } from "../../../global/context/ThemeContext";
import { UserGradeService } from "../services/userGradeService";
import { UserGrade } from "../types/userManagementTypes";
import LoadingSpinner from "../../../global/components/common/LoadingSpinner";
import ErrorMessage from "../../../global/components/common/ErrorMessage";
import GradeModal from "../components/GradeModal";
import styles from "./UserGradesManagementPage.module.css";

const UserGradesManagementPage: React.FC = () => {
  const { theme } = useTheme();

  // State management
  const [grades, setGrades] = useState<UserGrade[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentGrade, setCurrentGrade] = useState<UserGrade | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  // Load grades on component mount
  useEffect(() => {
    loadGrades();
  }, []);

  // Load grades function
  const loadGrades = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await UserGradeService.getAllGrades();
      setGrades(response);
    } catch (err) {
      console.error("Failed to load grades:", err);
      setError("등급 정보를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // Open modal to create new grade
  const handleCreateGrade = () => {
    setCurrentGrade(null);
    setIsCreating(true);
    setIsModalOpen(true);
  };

  // Open modal to edit existing grade
  const handleEditGrade = (grade: UserGrade) => {
    setCurrentGrade(grade);
    setIsCreating(false);
    setIsModalOpen(true);
  };

  // Handle save from modal
  const handleSaveGrade = async (grade: UserGrade) => {
    setIsLoading(true);
    setError(null);

    try {
      if (isCreating) {
        await UserGradeService.createGrade(grade);
      } else {
        await UserGradeService.updateGrade(grade);
      }

      // Reload grades after save
      await loadGrades();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to save grade:", err);
      setError("등급 저장 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`${styles.gradesManagement} ${
        theme === "dark" ? styles.dark : ""
      }`}
    >
      <h1 className={styles.pageTitle}>회원 등급 관리</h1>

      {/* Header with action button */}
      <div className={styles.headerControls}>
        <p className={styles.pageDescription}>
          회원 등급을 관리하고 각 등급별 혜택을 설정할 수 있습니다.
        </p>
        <button className={styles.createButton} onClick={handleCreateGrade}>
          <FiPlusCircle /> 새 등급 생성
        </button>
      </div>

      {/* Grades list */}
      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <div className={styles.gradesContainer}>
          <table className={styles.gradesTable}>
            <thead>
              <tr>
                <th>등급</th>
                <th>등급명</th>
                <th>설명</th>
                <th>최소 구매액</th>
                <th>적립률</th>
                <th>혜택</th>
                <th>대상 회원 수</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((grade) => (
                <tr key={grade.id}>
                  <td>{grade.level}</td>
                  <td>{grade.name}</td>
                  <td>{grade.description}</td>
                  <td>{grade.minPurchaseAmount?.toLocaleString()}원</td>
                  <td>{grade.pointRate}%</td>
                  <td>{grade.benefits}</td>
                  <td>{grade.userCount?.toLocaleString()}</td>
                  <td>
                    <button
                      className={styles.editButton}
                      onClick={() => handleEditGrade(grade)}
                    >
                      <FiEdit /> 수정
                    </button>
                  </td>
                </tr>
              ))}
              {grades.length === 0 && (
                <tr>
                  <td colSpan={8} className={styles.noData}>
                    등록된 등급이 없습니다. 새 등급을 생성해주세요.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Grade edit/create modal */}
      {isModalOpen && (
        <GradeModal
          grade={currentGrade}
          isCreating={isCreating}
          onSave={handleSaveGrade}
          onCancel={() => setIsModalOpen(false)}
          theme={theme}
        />
      )}
    </div>
  );
};

export default UserGradesManagementPage;
