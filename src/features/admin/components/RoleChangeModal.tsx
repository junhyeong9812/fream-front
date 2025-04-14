import React, { useState } from "react";
import { FiShield, FiX } from "react-icons/fi";
import styles from "./RoleChangeModal.module.css";

interface RoleChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (role: string, reason: string) => void; // 수정: gradeId -> role
  currentRole: string;
  theme: string;
}

const RoleChangeModal: React.FC<RoleChangeModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  currentRole,
  theme,
}) => {
  const [selectedRole, setSelectedRole] = useState<string>(
    currentRole || "USER"
  );
  const [reason, setReason] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError("변경 사유를 입력해주세요.");
      return;
    }

    onConfirm(selectedRole, reason);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={`${styles.modal} ${theme === "dark" ? styles.dark : ""}`}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            <FiShield /> 사용자 권한 변경
          </h2>
          <button className={styles.closeButton} onClick={onClose} title="닫기">
            <FiX />
          </button>
        </div>

        <div className={styles.modalContent}>
          <p className={styles.modalDescription}>
            {selectedRole === "ADMIN"
              ? "관리자 권한을 부여하면 해당 사용자는 관리자 페이지에 접근하여 시스템을 관리할 수 있게 됩니다."
              : "일반 사용자 권한으로 변경하면 해당 사용자는 관리자 페이지에 접근할 수 없게 됩니다."}
          </p>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              권한 <span className={styles.required}>*</span>
            </label>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="role"
                  value="USER"
                  checked={selectedRole === "USER"}
                  onChange={() => setSelectedRole("USER")}
                  className={styles.radioInput}
                />
                <div className={styles.radioText}>
                  <span className={styles.radioTitle}>일반 사용자</span>
                  <span className={styles.radioDescription}>
                    일반적인 서비스 이용 권한
                  </span>
                </div>
              </label>

              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="role"
                  value="ADMIN"
                  checked={selectedRole === "ADMIN"}
                  onChange={() => setSelectedRole("ADMIN")}
                  className={styles.radioInput}
                />
                <div className={styles.radioText}>
                  <span className={styles.radioTitle}>관리자</span>
                  <span className={styles.radioDescription}>
                    시스템 관리 권한 및 모든 기능 접근 가능
                  </span>
                </div>
              </label>
            </div>
          </div>

          {selectedRole === "ADMIN" && (
            <div className={styles.warningMessage}>
              <strong>주의:</strong> 관리자 권한 부여는 신중하게 결정해주세요.
              관리자는 시스템의 모든 데이터와 설정에 접근할 수 있습니다.
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="role-reason" className={styles.formLabel}>
              변경 사유 <span className={styles.required}>*</span>
            </label>
            <textarea
              id="role-reason"
              className={styles.formTextarea}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="권한 변경 사유를 상세히 입력해 주세요"
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
              selectedRole === "ADMIN" ? styles.adminButton : ""
            }`}
            onClick={handleConfirm}
          >
            권한 변경
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleChangeModal;
