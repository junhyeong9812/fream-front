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
  const [selectedOption, setSelectedOption] = useState<string>(currentOption);

  const requestOptions = [
    "요청사항 없음",
    "문 앞에 놓아주세요",
    "경비실에 맡겨 주세요",
    "파손 위험 상품입니다. 배송 시 주의해주세요",
  ];

  const handleApply = () => {
    onSave(selectedOption);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>배송 요청사항</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.modalBody}>
          {requestOptions.map((option) => (
            <button
              key={option}
              className={styles.optionButton}
              onClick={() => setSelectedOption(option)}
            >
              <div className={styles.optionContent}>
                <div
                  className={`${styles.optionText} ${
                    selectedOption === option ? styles.selected : ""
                  }`}
                >
                  {option}
                </div>
                {selectedOption === option && (
                  <div className={styles.checkIcon}>✔</div>
                )}
              </div>
              <div className={styles.divider} />
            </button>
          ))}
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.cancelButton} onClick={onClose}>
            취소
          </button>
          <button className={styles.applyButton} onClick={handleApply}>
            적용하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestModal;
