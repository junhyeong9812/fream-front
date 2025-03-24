import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SellModal.module.css";
import { ProductDetailResponse } from "@features/productDetail/services/productDetailServices";
import { AuthContext } from "src/global/context/AuthContext";

interface SellModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductDetailResponse;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
}

export const SellModal = ({
  isOpen,
  onClose,
  product,
  selectedSize,
  setSelectedSize,
}: SellModalProps) => {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!isOpen || !isLoggedIn) return null;

  const handleSell = (size: string) => {
    setSelectedSize(size);
    // 여기서 colorName도 같이 전달합니다
    navigate(`/sell/${product.id}/${size}?color=${encodeURIComponent(product.colorName)}`);
  };

  const getSizeSalePrice = (size: string) => {
    const sizeInfo = product.sizes.find((s) => s.size === size);
    return sizeInfo?.salePrice || product.releasePrice;
  };

  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>판매하기</h2>
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>
        <div className={styles.productInfo}>
          <img
            src={product.thumbnailImageUrl}
            alt={product.englishName}
            className={styles.productImage}
          />
          <div className={styles.productDetails}>
            <p className={styles.productId}>{product.id}</p>
            <p className={styles.productName}>{product.englishName}</p>
            <p className={styles.productKorName}>{product.name}</p>
          </div>
        </div>
        <div className={styles.sizeGridContainer}>
          <div className={styles.sizeGrid}>
            {product.sizes.map((size) => (
              <button
                key={size.size}
                className={`${styles.sizeButton} ${
                  selectedSize === size.size ? styles.selected : ""
                }`}
                onClick={() => handleSell(size.size)}
              >
                <span className={styles.sizeText}>{size.size}</span>
                <span className={styles.priceText}>
                  {new Intl.NumberFormat("ko-KR").format(
                    getSizeSalePrice(size.size)
                  )}
                  원
                </span>
              </button>
            ))}
          </div>
        </div>
        <button
          className={styles.sellButton}
          onClick={() => selectedSize && handleSell(selectedSize)}
          disabled={!selectedSize}
        >
          {selectedSize
            ? `${new Intl.NumberFormat("ko-KR").format(
                getSizeSalePrice(selectedSize)
              )}원 판매하기`
            : "사이즈를 선택해주세요"}
        </button>
      </div>
    </div>
  );
};
