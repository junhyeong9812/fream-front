import React from "react";
import styles from "./LoginPromptModal.module.css";

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
  actionType: "buy" | "sell" | "wish";
}

export const LoginPromptModal: React.FC<LoginPromptModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  actionType,
}) => {
  if (!isOpen) return null;

  const actionText = {
    buy: "구매",
    sell: "판매",
    wish: "관심상품 추가",
  }[actionType];

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>로그인이 필요합니다</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.modalContent}>
          <p>{actionText}하려면 로그인이 필요합니다.</p>
          <p>로그인 하시겠습니까?</p>

          <div className={styles.buttonContainer}>
            <button className={styles.cancelButton} onClick={onClose}>
              취소
            </button>
            <button className={styles.loginButton} onClick={onLogin}>
              로그인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPromptModal;
