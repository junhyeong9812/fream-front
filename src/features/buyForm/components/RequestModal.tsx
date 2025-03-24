import React, { useState } from "react";
import styles from "./RequestModal.module.css";

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (request: string) => void;
  currentOption: string;
}

const RequestModal: React.FC<RequestModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentOption,
}) => {
  // 요청사항 옵션
  const requestOptions = [
    "요청사항 없음",
    "문 앞에 놓아주세요",
    "경비실에 맡겨 주세요",
    "파손 위험 상품입니다. 배송 시 주의해주세요",
  ];

  const [selectedRequest, setSelectedRequest] = useState<string>(currentOption);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(selectedRequest);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>배송 요청사항</h3>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.modalBody}>
          {requestOptions.map((option, index) => (
            <React.Fragment key={index}>
              <button
                className={styles.optionButton}
                onClick={() => setSelectedRequest(option)}
              >
                <div className={styles.optionText}>
                  <span
                    className={`${styles.optionLabel} ${
                      selectedRequest === option ? styles.selectedOption : ""
                    }`}
                  >
                    {option}
                  </span>
                </div>
                {selectedRequest === option && (
                  <div className={styles.checkmark}>✔</div>
                )}
              </button>
              {index < requestOptions.length - 1 && (
                <div className={styles.divider}></div>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className={styles.buttonGroup}>
          <button onClick={onClose} className={styles.cancelButton}>
            취소
          </button>
          <button onClick={handleSave} className={styles.saveButton}>
            적용하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestModal;
