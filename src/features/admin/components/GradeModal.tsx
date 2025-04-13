import React, { useState, useEffect } from "react";
import { FiX, FiSave } from "react-icons/fi";
import { UserGrade } from "../types/userManagementTypes";
import styles from "./GradeModal.module.css";

interface GradeModalProps {
  grade: UserGrade | null;
  isCreating: boolean;
  onSave: (grade: UserGrade) => void;
  onCancel: () => void;
  theme: string;
}

const GradeModal: React.FC<GradeModalProps> = ({
  grade,
  isCreating,
  onSave,
  onCancel,
  theme,
}) => {
  // Form state
  const [formData, setFormData] = useState<UserGrade>({
    id: 0,
    level: 1,
    name: "",
    description: "",
    minPurchaseAmount: 0,
    pointRate: 1,
    benefits: "",
  });

  // Initialize form data with grade if provided
  useEffect(() => {
    if (grade) {
      setFormData({
        ...grade,
      });
    }
  }, [grade]);

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "level" || name === "minPurchaseAmount" || name === "pointRate"
          ? parseInt(value, 10)
          : value,
    }));
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div
      className={`${styles.modalOverlay} ${
        theme === "dark" ? styles.dark : ""
      }`}
    >
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>{isCreating ? "새 등급 생성" : "등급 수정"}</h2>
          <button className={styles.closeButton} onClick={onCancel}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label htmlFor="level">등급 레벨</label>
            <input
              type="number"
              id="level"
              name="level"
              value={formData.level}
              onChange={handleChange}
              min={1}
              max={10}
              required
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="name">등급명</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={styles.formInput}
              placeholder="예: 브론즈, 실버, 골드"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">설명</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={styles.formTextarea}
              placeholder="등급에 대한 설명을 입력하세요"
              rows={3}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="minPurchaseAmount">최소 구매액 (원)</label>
            <input
              type="number"
              id="minPurchaseAmount"
              name="minPurchaseAmount"
              value={formData.minPurchaseAmount}
              onChange={handleChange}
              min={0}
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="pointRate">적립률 (%)</label>
            <input
              type="number"
              id="pointRate"
              name="pointRate"
              value={formData.pointRate}
              onChange={handleChange}
              min={0}
              max={100}
              step={0.1}
              required
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="benefits">혜택</label>
            <textarea
              id="benefits"
              name="benefits"
              value={formData.benefits}
              onChange={handleChange}
              className={styles.formTextarea}
              placeholder="이 등급에서 제공하는 혜택을 입력하세요"
              rows={4}
            />
          </div>

          <div className={styles.modalActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onCancel}
            >
              취소
            </button>
            <button type="submit" className={styles.saveButton}>
              <FiSave /> 저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GradeModal;
