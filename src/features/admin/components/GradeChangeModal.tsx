import React, { useState, useEffect } from "react";
import { FiAward, FiX } from "react-icons/fi";
import { UserGradeService } from "../services/userGradeService";
import { UserGrade } from "../types/userManagementTypes";
import styles from "./GradeChangeModal.module.css";

interface GradeChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (gradeId: number, reason: string) => void;
  currentGrade?: number;
  theme: string;
}

const GradeChangeModal: React.FC<GradeChangeModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  currentGrade,
  theme,
}) => {
  const [grades, setGrades] = useState<UserGrade[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<number | "">("");
  const [reason, setReason] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Load grades
  useEffect(() => {
    const loadGrades = async () => {
      setLoading(true);
      try {
        const response = await UserGradeService.getAllGrades();
        setGrades(response);

        // Set current grade as selected if available
        if (currentGrade !== undefined) {
          setSelectedGrade(currentGrade);
        } else if (response.length > 0) {
          setSelectedGrade(response[0].id);
        }
      } catch (err) {
        console.error("등급 정보 로드 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      loadGrades();
    }
  }, [isOpen, currentGrade]);

  const handleConfirm = () => {
    // Validate inputs
    if (selectedGrade === "") {
      setError("등급을 선택해주세요.");
      return;
    }

    if (!reason.trim()) {
      setError("변경 사유를 입력해주세요.");
      return;
    }

    onConfirm(Number(selectedGrade), reason);
  };

  const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGrade(e.target.value ? Number(e.target.value) : "");
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={`${styles.modal} ${theme === "dark" ? styles.dark : ""}`}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            <FiAward /> 판매자 등급 변경
          </h2>
          <button className={styles.closeButton} onClick={onClose} title="닫기">
            <FiX />
          </button>
        </div>

        <div className={styles.modalContent}>
          <p className={styles.modalDescription}>
            판매자 등급을 변경하면 해당 사용자의 판매 수수료 및 각종 혜택이
            변경됩니다.
          </p>

          <div className={styles.formGroup}>
            <label htmlFor="grade-select" className={styles.formLabel}>
              변경할 등급 <span className={styles.required}>*</span>
            </label>
            <select
              id="grade-select"
              className={styles.formSelect}
              value={selectedGrade}
              onChange={handleGradeChange}
              disabled={loading}
            >
              <option value="">등급 선택</option>
              {grades.map((grade) => (
                <option key={grade.id} value={grade.id}>
                  Lv.{grade.level} - {grade.name}
                </option>
              ))}
            </select>
          </div>

          {selectedGrade !== "" && (
            <div className={styles.selectedGradeInfo}>
              {grades
                .filter((grade) => grade.id === Number(selectedGrade))
                .map((grade) => (
                  <div key={grade.id}>
                    <h4 className={styles.gradeTitle}>
                      Lv.{grade.level} - {grade.name}
                    </h4>
                    <div className={styles.gradeDetail}>
                      <p>
                        <strong>포인트 적립률:</strong> {grade.pointRate}%
                      </p>
                      <p>
                        <strong>추가 혜택:</strong> {grade.benefits}
                      </p>
                      <p>
                        <strong>등급 조건:</strong>{" "}
                        {grade.minPurchaseAmount
                          ? `${grade.minPurchaseAmount.toLocaleString()}원 이상 구매`
                          : "관리자 지정"}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="grade-reason" className={styles.formLabel}>
              변경 사유 <span className={styles.required}>*</span>
            </label>
            <textarea
              id="grade-reason"
              className={styles.formTextarea}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="등급 변경 사유를 상세히 입력해 주세요"
              rows={4}
            />
            {error && <div className={styles.formError}>{error}</div>}
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.cancelButton} onClick={onClose}>
            취소
          </button>
          <button className={styles.confirmButton} onClick={handleConfirm}>
            등급 변경
          </button>
        </div>
      </div>
    </div>
  );
};

export default GradeChangeModal;
