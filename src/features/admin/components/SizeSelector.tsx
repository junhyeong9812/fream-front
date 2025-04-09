import React, { useState } from "react";
import { FiCheck } from "react-icons/fi";
import styles from "./SizeSelector.module.css";

type CategoryType = "CLOTHING" | "SHOES" | "ACCESSORIES";

interface SizeSelectorProps {
  categoryType: CategoryType;
  selectedSizes: string[];
  onChange: (sizes: string[]) => void;
}

const SizeSelector: React.FC<SizeSelectorProps> = ({
  categoryType,
  selectedSizes,
  onChange,
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  // 카테고리별 사이즈 옵션
  const sizeOptions: Record<CategoryType, string[]> = {
    CLOTHING: [
      "XXS",
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL",
      "XXXL",
      "28",
      "29",
      "30",
      "31",
      "32",
      "33",
      "34",
      "35",
      "36",
    ],
    SHOES: [
      "230",
      "235",
      "240",
      "245",
      "250",
      "255",
      "260",
      "265",
      "270",
      "275",
      "280",
      "285",
      "290",
      "295",
      "300",
      "305",
      "310",
    ],
    ACCESSORIES: ["ONE_SIZE"],
  };

  // 현재 카테고리의 사이즈 옵션
  const currentSizeOptions = sizeOptions[categoryType];

  // 사이즈 선택 토글
  const toggleSize = (size: string) => {
    if (selectedSizes.includes(size)) {
      onChange(selectedSizes.filter((s) => s !== size));
    } else {
      onChange([...selectedSizes, size]);
    }
  };

  // 모든 사이즈 선택
  const selectAll = () => {
    onChange([...currentSizeOptions]);
  };

  // 모든 사이즈 선택 해제
  const deselectAll = () => {
    onChange([]);
  };

  // 선택된 사이즈 텍스트
  const getSelectedSizesText = () => {
    if (selectedSizes.length === 0) {
      return "사이즈를 선택해주세요";
    } else if (selectedSizes.length === currentSizeOptions.length) {
      return "모든 사이즈";
    } else if (selectedSizes.length <= 3) {
      return selectedSizes.join(", ");
    } else {
      return `${selectedSizes.length}개 사이즈 선택됨`;
    }
  };

  return (
    <div className={styles.sizeSelector}>
      <div className={styles.sizeDisplay} onClick={() => setShowModal(true)}>
        <span>{getSelectedSizesText()}</span>
      </div>

      {showModal && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setShowModal(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>사이즈 선택</h3>
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.actionButton}
                  onClick={selectAll}
                >
                  전체 선택
                </button>
                <button
                  type="button"
                  className={styles.actionButton}
                  onClick={deselectAll}
                >
                  전체 해제
                </button>
              </div>
            </div>
            <div className={styles.sizesGrid}>
              {currentSizeOptions.map((size) => (
                <div
                  key={size}
                  className={`${styles.sizeItem} ${
                    selectedSizes.includes(size) ? styles.selected : ""
                  }`}
                  onClick={() => toggleSize(size)}
                >
                  {size}
                  {selectedSizes.includes(size) && (
                    <span className={styles.checkmark}>
                      <FiCheck />
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.confirmButton}
                onClick={() => setShowModal(false)}
              >
                확인 ({selectedSizes.length}개 선택)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SizeSelector;
