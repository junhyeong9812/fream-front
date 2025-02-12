import { useState } from "react";
import styles from "./WishModal.module.css";
import { SizeDetailDto } from "@features/productDetail/services/productDetailServices";

interface WishModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
  sizes: SizeDetailDto[];
  onWishSubmit: (selectedSizes: string[]) => void;
}

export const WishModal = ({
  isOpen,
  onClose,
  productId,
  sizes,
  onWishSubmit,
}: WishModalProps) => {
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  if (!isOpen) return null;

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleSubmit = () => {
    onWishSubmit(selectedSizes);
    onClose();
  };

  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>관심 상품 저장</h2>
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>
        <div className={styles.sizeGrid}>
          {sizes.map((size) => (
            <button
              key={size.size}
              className={`${styles.sizeButton} ${
                selectedSizes.includes(size.size) ? styles.selected : ""
              }`}
              onClick={() => toggleSize(size.size)}
            >
              {size.size}
            </button>
          ))}
        </div>
        <div className={styles.modalFooter}>
          <button onClick={onClose} className={styles.cancelButton}>
            취소
          </button>
          <button onClick={handleSubmit} className={styles.submitButton}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
};
