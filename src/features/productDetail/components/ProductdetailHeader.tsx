import { useEffect, useState } from "react";
import styles from "./productdetailHeader.module.css";

interface ProductDetailHeaderProps {
  detail_main_image: string[];
  main_info_shoes: {
    gender: string;
    nameEng: string;
    nameKor: string;
  };
  final_size: string;
  setFinal_Size: (size: string) => void;
}

const ProductDetailHeader = ({
  detail_main_image,
  main_info_shoes,
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
    if (gender === "MAN") {
      return "";
    } else if (gender === "WOMAN") {
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
              src={detail_main_image[0]}
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
              {formatGender(main_info_shoes.gender)}
              {main_info_shoes.nameEng}
            </div>
            <div style={{ fontSize: "14px", color: "rgba(0,0,0,0.5)" }}>
              {formatGender(main_info_shoes.gender)}
              {main_info_shoes.nameKor}
            </div>
          </div>
        </div>
        <div style={{ width: "540px", display: "flex", marginTop: "14px" }}>
          {/* 필요한 추가 컴포넌트 헤더바이모달 /헤더바이셀은 추가 필요*/}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailHeader;
