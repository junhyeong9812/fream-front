import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./BuySuccessPage.module.css";

const BuySuccessPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, productInfo, sizeInfo, totalAmount } = location.state || {};

  // 가격 포맷 함수
  const formatPrice = (price: number | undefined): string => {
    if (price === undefined) return "0";
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  return (
    <div className={styles.successContainer}>
      <div className={styles.successContent}>
        <div className={styles.header}>
          <h1 className={styles.title}>즉시 구매가 완료되었습니다.</h1>
          <p className={styles.subtitle}>
            구매한 상품은 전문가의 검수 완료 후,
            <br />
            안전하게 배송될 예정입니다.
          </p>
        </div>

        {productInfo && (
          <div className={styles.productInfo}>
            <img
              src={productInfo.thumbnailImageUrl}
              alt={productInfo.name}
              className={styles.productImage}
            />
          </div>
        )}

        <button
          className={styles.detailButton}
          onClick={() => navigate(`/my/purchase/${orderId}`)}
        >
          구매 내역 상세보기
        </button>

        <p className={styles.warningText}>즉시 구매는 취소가 불가능합니다.</p>

        <div className={styles.separator} />

        <div className={styles.paymentSummary}>
          <div className={styles.paymentHeader}>
            <h2 className={styles.paymentTitle}>총 결제금액</h2>
          </div>
          <div className={styles.totalAmount}>{formatPrice(totalAmount)}원</div>
        </div>

        <div className={styles.separator} />

        <div className={styles.paymentDetails}>
          <div className={styles.detailRow}>
            <div className={styles.detailLabel}>즉시 구매가</div>
            <div className={styles.detailValue}>
              {productInfo && sizeInfo
                ? formatPrice(sizeInfo.purchasePrice)
                : "0"}
              원
            </div>
          </div>
          <div className={styles.detailRow}>
            <div className={styles.detailLabelMuted}>검수비</div>
            <div className={styles.detailValue}>무료</div>
          </div>
          <div className={styles.detailRow}>
            <div className={styles.detailLabelMuted}>수수료</div>
            <div className={styles.detailValue}>0원</div>
          </div>
          <div className={styles.detailRow}>
            <div className={styles.detailLabelMuted}>배송비</div>
            <div className={styles.detailValue}>3,000원</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuySuccessPage;
