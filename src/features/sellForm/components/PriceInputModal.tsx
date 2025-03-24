import React, { useState, useEffect } from "react";
import styles from "./PriceInputModal.module.css";

interface PriceInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (price: number) => void;
  currentPrice: number | null;
  marketPrice: number; // 참고 시세가
}

const PriceInputModal: React.FC<PriceInputModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentPrice,
  marketPrice,
}) => {
  const [price, setPrice] = useState<string>("");
  const [error, setError] = useState<string>("");

  // 현재 가격으로 초기화
  useEffect(() => {
    if (currentPrice !== null) {
      setPrice(currentPrice.toString());
    }
  }, [currentPrice, isOpen]);

  // 입력값 처리
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // 숫자만 허용
    setPrice(value);

    // 유효성 검사
    if (value === "") {
      setError("판매가를 입력해주세요.");
    } else if (parseInt(value) < 1000) {
      setError("최소 판매가는 1,000원 이상이어야 합니다.");
    } else {
      setError("");
    }
  };

  // 저장 처리
  const handleSave = () => {
    if (price === "" || parseInt(price) < 1000) {
      setError("유효한 판매가를 입력해주세요.");
      return;
    }

    onSave(parseInt(price));
  };

  // 가격 포맷 함수
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>판매가 설정</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.modalContent}>
          <div className={styles.priceInfoContainer}>
            <div className={styles.priceInfoRow}>
              <div className={styles.priceInfoLabel}>현재 시세</div>
              <div className={styles.priceInfoValue}>
                {formatPrice(marketPrice)}원
              </div>
            </div>
          </div>

          <div className={styles.inputContainer}>
            <label className={styles.inputLabel}>판매가</label>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                value={price}
                onChange={handleInputChange}
                className={error ? styles.inputError : styles.input}
                placeholder="판매 희망가를 입력하세요"
              />
              <span className={styles.wonSymbol}>원</span>
            </div>
            {error && <p className={styles.errorText}>{error}</p>}
          </div>

          <div className={styles.priceExamples}>
            <p className={styles.exampleTitle}>추천 가격</p>
            <div className={styles.exampleButtons}>
              {/* 현재 시세의 ±5% 및 ±10% 버튼 */}
              <button
                onClick={() =>
                  setPrice(Math.round(marketPrice * 0.9).toString())
                }
                className={styles.exampleButton}
              >
                {formatPrice(Math.round(marketPrice * 0.9))}원
              </button>
              <button
                onClick={() =>
                  setPrice(Math.round(marketPrice * 0.95).toString())
                }
                className={styles.exampleButton}
              >
                {formatPrice(Math.round(marketPrice * 0.95))}원
              </button>
              <button
                onClick={() => setPrice(marketPrice.toString())}
                className={styles.exampleButton}
              >
                {formatPrice(marketPrice)}원
              </button>
              <button
                onClick={() =>
                  setPrice(Math.round(marketPrice * 1.05).toString())
                }
                className={styles.exampleButton}
              >
                {formatPrice(Math.round(marketPrice * 1.05))}원
              </button>
              <button
                onClick={() =>
                  setPrice(Math.round(marketPrice * 1.1).toString())
                }
                className={styles.exampleButton}
              >
                {formatPrice(Math.round(marketPrice * 1.1))}원
              </button>
            </div>
          </div>

          <div className={styles.noteContainer}>
            <p className={styles.note}>
              • 입찰 희망가가 낮을수록 판매 체결 가능성이 높아집니다.
            </p>
            <p className={styles.note}>
              • 시세보다 높은 가격으로 설정할 경우 판매가 늦어질 수 있습니다.
            </p>
            <p className={styles.note}>
              • 판매가는 1,000원 이상부터 설정할 수 있습니다.
            </p>
          </div>

          <div className={styles.buttonContainer}>
            <button className={styles.cancelButton} onClick={onClose}>
              취소
            </button>
            <button
              className={styles.saveButton}
              onClick={handleSave}
              disabled={!!error || price === ""}
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceInputModal;
