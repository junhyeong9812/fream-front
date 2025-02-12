import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./BuyModal.module.css";
import { AuthContext } from "src/global/context/AuthContext";
import { ProductDetailResponse } from "@features/productDetail/services/productDetailServices";

interface BuyModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductDetailResponse;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
}

export const BuyModal = ({
  isOpen,
  onClose,
  product,
  selectedSize,
  setSelectedSize,
}: BuyModalProps) => {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleBuy = (size: string) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    setSelectedSize(size);
    navigate(`/buy/${product.id}/${size}`);
  };

  const getSizePurchasePrice = (size: string) => {
    const sizeInfo = product.sizes.find((s) => s.size === size);
    return sizeInfo?.purchasePrice || product.releasePrice;
  };

  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>구매하기</h2>
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>
        <div className={styles.productInfo}>
          <img
            src={product.thumbnailImageUrl}
            alt={product.name}
            className={styles.productImage}
          />
          <div className={styles.productDetails}>
            <p className={styles.productId}>{product.id}</p>
            <p className={styles.productName}>{product.englishName}</p>
            <p className={styles.productKorName}>{product.name}</p>
          </div>
        </div>
        <div className={styles.sizeGrid}>
          {product.sizes.map((size) => (
            <button
              key={size.size}
              className={`${styles.sizeButton} ${
                selectedSize === size.size ? styles.selected : ""
              }`}
              onClick={() => handleBuy(size.size)}
            >
              <span className={styles.sizeText}>{size.size}</span>
              <span className={styles.priceText}>
                {new Intl.NumberFormat("ko-KR").format(
                  getSizePurchasePrice(size.size)
                )}
                원
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
