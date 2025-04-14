import React, { useState } from "react";
import { FiLock, FiUnlock, FiX } from "react-icons/fi";
import styles from "./StatusChangeModal.module.css";

interface StatusChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (status: boolean, reason: string) => void;
  currentStatus: boolean;
  theme: string;
}

const StatusChangeModal: React.FC<StatusChangeModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  currentStatus,
  theme,
}) => {
  const [reason, setReason] = useState<string>("");
  const [error, setError] = useState<string>("");

  const newStatus = !currentStatus;

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError("변경 사유를 입력해주세요.");
      return;
    }

    onConfirm(newStatus, reason);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={`${styles.modal} ${theme === "dark" ? styles.dark : ""}`}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {newStatus ? (
              <>
                <FiUnlock /> 계정 활성화
              </>
            ) : (
              <>
                <FiLock /> 계정 비활성화
              </>
            )}
          </h2>
          <button className={styles.closeButton} onClick={onClose} title="닫기">
            <FiX />
          </button>
        </div>

        <div className={styles.modalContent}>
          <p className={styles.modalDescription}>
            {newStatus
              ? "사용자 계정을 활성화하시겠습니까? 계정이 활성화되면 사용자는 모든 서비스를 정상적으로 이용할 수 있습니다."
              : "사용자 계정을 비활성화하시겠습니까? 계정이 비활성화되면 사용자는 로그인 및 서비스 이용이 제한됩니다."}
          </p>

          <div className={styles.formGroup}>
            <label htmlFor="status-reason" className={styles.formLabel}>
              변경 사유 <span className={styles.required}>*</span>
            </label>
            <textarea
              id="status-reason"
              className={styles.formTextarea}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="변경 사유를 상세히 입력해 주세요"
              rows={4}
            />
            {error && <div className={styles.formError}>{error}</div>}
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.cancelButton} onClick={onClose}>
            취소
          </button>
          <button
            className={`${styles.confirmButton} ${
              newStatus ? styles.activateButton : styles.deactivateButton
            }`}
            onClick={handleConfirm}
          >
            {newStatus ? "활성화" : "비활성화"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusChangeModal;
