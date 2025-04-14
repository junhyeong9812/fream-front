import React, { useState } from "react";
import { FiPlusCircle, FiX } from "react-icons/fi";
import styles from "./PointManageModal.module.css";

interface PointManageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number, reason: string, expirationDate?: string) => void;
  currentPoints: number;
  theme: string;
}

const PointManageModal: React.FC<PointManageModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  currentPoints,
  theme,
}) => {
  const [amount, setAmount] = useState<string>("");
  const [isPositive, setIsPositive] = useState<boolean>(true);
  const [reason, setReason] = useState<string>("");
  const [expirationDate, setExpirationDate] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleConfirm = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("유효한 포인트 금액을 입력해주세요.");
      return;
    }

    if (!reason.trim()) {
      setError("지급/차감 사유를 입력해주세요.");
      return;
    }

    // Calculate actual amount (positive for add, negative for subtract)
    const actualAmount = isPositive ? Number(amount) : -Number(amount);

    onConfirm(actualAmount, reason, expirationDate || undefined);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={`${styles.modal} ${theme === "dark" ? styles.dark : ""}`}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            <FiPlusCircle /> 포인트 관리
          </h2>
          <button className={styles.closeButton} onClick={onClose} title="닫기">
            <FiX />
          </button>
        </div>

        <div className={styles.modalContent}>
          <div className={styles.currentPoints}>
            <div className={styles.pointsLabel}>현재 사용 가능 포인트</div>
            <div className={styles.pointsValue}>
              {currentPoints.toLocaleString()} P
            </div>
          </div>

          <div className={styles.pointsActions}>
            <div className={styles.actionButtons}>
              <button
                className={`${styles.actionButton} ${
                  isPositive ? styles.activeAction : ""
                }`}
                onClick={() => setIsPositive(true)}
              >
                포인트 지급
              </button>
              <button
                className={`${styles.actionButton} ${
                  !isPositive ? styles.activeAction : ""
                }`}
                onClick={() => setIsPositive(false)}
              >
                포인트 차감
              </button>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="points-amount" className={styles.formLabel}>
                포인트 금액 <span className={styles.required}>*</span>
              </label>
              <div className={styles.amountInputWrapper}>
                <input
                  id="points-amount"
                  type="number"
                  className={styles.formInput}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="금액 입력"
                  min="1"
                />
                <span className={styles.pointsUnit}>P</span>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="points-reason" className={styles.formLabel}>
                지급/차감 사유 <span className={styles.required}>*</span>
              </label>
              <textarea
                id="points-reason"
                className={styles.formTextarea}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="포인트 지급/차감 사유를 상세히 입력해 주세요"
                rows={3}
              />
            </div>

            {isPositive && (
              <div className={styles.formGroup}>
                <label htmlFor="points-expiration" className={styles.formLabel}>
                  만료일 (선택)
                </label>
                <input
                  id="points-expiration"
                  type="date"
                  className={styles.formInput}
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
                <div className={styles.formHint}>
                  지정하지 않을 경우 기본 정책에 따라 1년 후 만료됩니다.
                </div>
              </div>
            )}

            {error && <div className={styles.formError}>{error}</div>}

            <div className={styles.previewSection}>
              <div className={styles.previewTitle}>변경 미리보기</div>
              <div className={styles.previewContent}>
                <div className={styles.previewItem}>
                  <div className={styles.previewLabel}>현재 포인트</div>
                  <div className={styles.previewValue}>
                    {currentPoints.toLocaleString()} P
                  </div>
                </div>
                <div className={styles.previewItem}>
                  <div className={styles.previewLabel}>변경 포인트</div>
                  <div className={styles.previewValue}>
                    <span
                      className={
                        isPositive ? styles.positiveValue : styles.negativeValue
                      }
                    >
                      {isPositive ? "+" : "-"}
                      {amount ? Number(amount).toLocaleString() : 0} P
                    </span>
                  </div>
                </div>
                <div className={styles.previewDivider}></div>
                <div className={styles.previewItem}>
                  <div className={styles.previewLabel}>변경 후 포인트</div>
                  <div className={styles.previewValue}>
                    {amount
                      ? (
                          currentPoints +
                          (isPositive ? Number(amount) : -Number(amount))
                        ).toLocaleString()
                      : currentPoints.toLocaleString()}{" "}
                    P
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.cancelButton} onClick={onClose}>
            취소
          </button>
          <button
            className={`${styles.confirmButton} ${
              isPositive ? styles.addButton : styles.subtractButton
            }`}
            onClick={handleConfirm}
          >
            {isPositive ? "포인트 지급" : "포인트 차감"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PointManageModal;
