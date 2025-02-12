import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "src/global/context/AuthContext";
import styles from "./headerSellModal.module.css";
import { ProductDetailResponse } from "@features/productDetail/services/productDetailServices";

interface HeaderSellModalProps {
  product: ProductDetailResponse;
  final_size: string;
  setFinal_Size: (size: string) => void;
}

const HeaderSellModal: React.FC<HeaderSellModalProps> = ({
  product,
  final_size,
  setFinal_Size,
}) => {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [sellModal, setSellModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>();

  useEffect(() => {
    if (sellModal && !isLoggedIn) {
      navigate("/login");
    }
  }, [sellModal, isLoggedIn, navigate]);

  useEffect(() => {
    setSelectedSize(final_size);
    setFinal_Size(final_size);
  }, [final_size, setFinal_Size]);

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    setFinal_Size(size);
  };

  const handleSell = () => {
    if (selectedSize) {
      window.location.href = `/sell/${product.id}/${selectedSize}`;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  const getSellPrice = (size: string) => {
    const sizeInfo = product.sizes.find((s) => s.size === size);
    return sizeInfo?.salePrice || product.releasePrice;
  };

  return (
    <>
      <button
        onClick={() => setSellModal(true)}
        style={{
          width: "275px",
          height: "60px",
          display: "flex",
          color: "white",
          backgroundColor: "rgb(65, 185, 121)",
          borderRadius: "10px",
          fontWeight: "bold",
          marginLeft: "10px",
          border: "none",
        }}
      >
        <div
          style={{
            width: "50px",
            marginTop: "16px",
            marginLeft: "12px",
            textAlign: "left",
            fontSize: "20px",
          }}
        >
          판매
        </div>
        <div
          style={{
            width: "1px",
            height: "59px",
            backgroundColor: "rgba(0,0,0,0.1)",
          }}
        ></div>
        <div style={{ marginLeft: "9px" }}>
          <div
            style={{
              fontSize: "17px",
              height: "20px",
              marginTop: "10px",
              textAlign: "left",
            }}
          >
            {formatPrice(product.releasePrice)}원
          </div>
          <div
            style={{
              fontWeight: "lighter",
              fontSize: "12px",
              textAlign: "left",
            }}
          >
            즉시 판매가
          </div>
        </div>
      </button>

      {sellModal && isLoggedIn && (
        <div className={styles.headerModalContainer}>
          <div className={styles.headerModalContent}>
            <div style={{ height: "55px", display: "flex" }}>
              <p
                style={{
                  marginLeft: "200px",
                  marginTop: "20px",
                  fontWeight: "bold",
                  fontSize: "20px",
                }}
              >
                판매하기
              </p>
              <button
                className={styles.closeButton}
                style={{
                  width: "60px",
                  marginLeft: "130px",
                  border: "none",
                  backgroundColor: "white",
                  borderRadius: "20px",
                }}
                onClick={() => setSellModal(false)}
              >
                <p
                  style={{
                    fontSize: "30px",
                    marginTop: "5px",
                    fontWeight: "lighter",
                  }}
                >
                  x
                </p>
              </button>
            </div>

            <div className={styles.headerModalTitle}>
              <img
                src={product.thumbnailImageUrl}
                style={{
                  height: "120px",
                  marginLeft: "30px",
                  backgroundColor: "#f4f4f4",
                }}
                alt="Product"
              />
              <div style={{ marginLeft: "15px", textAlign: "left" }}>
                <div style={{ fontWeight: "bold" }}>{product.id}</div>
                <div style={{ width: "280px" }}>
                  <span style={{ fontWeight: "bold" }}>
                    {product.englishName}
                  </span>
                  <br />
                  <span>{product.name}</span>
                </div>
              </div>
            </div>

            <div className={styles.sizesContainer}>
              {product.sizes.map((sizeInfo) => (
                <button
                  key={sizeInfo.size}
                  className={`${styles.modalSizeButton} ${
                    selectedSize === sizeInfo.size
                      ? styles.activeButton
                      : styles.inactiveButton
                  }`}
                  onClick={() => handleSizeSelect(sizeInfo.size)}
                >
                  <span className={styles.spanFont1}>{sizeInfo.size}</span>
                  <br />
                  <span className={styles.spanFont2}>
                    {formatPrice(getSellPrice(sizeInfo.size))}원
                  </span>
                </button>
              ))}
            </div>

            <div>
              <button
                onClick={handleSell}
                disabled={!selectedSize}
                style={{
                  width: "420px",
                  height: "65px",
                  backgroundColor: selectedSize ? "black" : "lightgray",
                  color: "#fff",
                  fontWeight: "bold",
                  marginTop: "10px",
                  marginLeft: "30px",
                  borderRadius: "10px",
                  cursor: selectedSize ? "pointer" : "not-allowed",
                }}
              >
                {selectedSize
                  ? `${formatPrice(getSellPrice(selectedSize))}원 판매하기`
                  : "사이즈를 선택해주세요"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HeaderSellModal;
