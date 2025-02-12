import { useEffect, useState } from "react";
import styles from "./productdetailHeader.module.css";
import HeaderBuyModal from "./modals/HeaderBuyModal";
import HeaderSellModal from "./modals/HeaderSellModal";
import { ProductDetailResponse } from "@features/productDetail/services/productDetailServices";

interface ProductDetailHeaderProps {
  product: ProductDetailResponse;
  final_size: string;
  setFinal_Size: (size: string) => void;
}

const ProductDetailHeader = ({
  product,
  final_size,
  setFinal_Size,
}: ProductDetailHeaderProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // 기존 헤더의 높이 (100px)를 고려하여 스크롤 위치 판단
      setIsVisible(window.scrollY > 100);
    };

    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const formatGender = (gender: string) => {
    if (product.brandName === "MAN") {
      return "";
    } else if (product.brandName === "WOMAN") {
      return "(W)";
    } else {
      return "";
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={styles.detailHeaderContainer}>
      <div className={styles.scrollContainer}>
        <div style={{ width: "660px", display: "flex" }}>
          <div>
            <img
              src={product.thumbnailImageUrl}
              style={{
                width: "65px",
                height: "65px",
                marginTop: "10px",
                borderRadius: "10px",
                backgroundColor: "#f4f4f4",
              }}
              alt="Product"
            />
          </div>
          <div style={{ marginLeft: "8px", marginTop: "12px" }}>
            <div style={{ fontSize: "18px" }}>
              {formatGender(product.brandName)}
              {product.englishName}
            </div>
            <div style={{ fontSize: "14px", color: "rgba(0,0,0,0.5)" }}>
              {formatGender(product.brandName)}
              {product.name}
            </div>
          </div>
        </div>
        <div style={{ width: "540px", display: "flex", marginTop: "14px" }}>
          <HeaderBuyModal
            product={product}
            final_size={final_size}
            setFinal_Size={setFinal_Size}
          />
          <HeaderSellModal
            product={product}
            final_size={final_size}
            setFinal_Size={setFinal_Size}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailHeader;
