import { SizeDetailDto } from "@features/productDetail/services/productDetailServices";
import styles from "./SizeModal.module.css";

interface SizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  sizes: SizeDetailDto[];
}

export const SizeModal = ({
  isOpen,
  onClose,
  selectedSize,
  setSelectedSize,
  sizes,
}: SizeModalProps) => {
  if (!isOpen) return null;

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    onClose();
  };

  const getSizePurchasePrice = (size: string) => {
    const sizeInfo = sizes.find((s) => s.size === size);
    return sizeInfo?.purchasePrice;
  };

  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>사이즈 선택</h2>
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>
        <div className={styles.sizeGrid}>
          <button
            className={`${styles.sizeButton} ${
              selectedSize === "모든 사이즈" ? styles.selected : ""
            }`}
            onClick={() => handleSizeSelect("모든 사이즈")}
          >
            <span className={styles.sizeText}>모든 사이즈</span>
            <span className={styles.priceText}>구매입찰</span>
          </button>
          {sizes.map((size) => (
            <button
              key={size.size}
              className={`${styles.sizeButton} ${
                selectedSize === size.size ? styles.selected : ""
              }`}
              onClick={() => handleSizeSelect(size.size)}
            >
              <span className={styles.sizeText}>{size.size}</span>
              <span className={styles.priceText}>
                {size.purchasePrice &&
                  `${new Intl.NumberFormat("ko-KR").format(
                    size.purchasePrice
                  )}원`}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
