import "../css/product.css";
import React from "react";
import { productProps } from "../types/commonTypes";
import { PiBookmarkSimpleThin } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

const Product: React.FC<productProps> = ({ product }) => {
  const navigate = useNavigate();

  const handleProductClick = () => {
    navigate(`/products/${product.id}?color=${product.colorName}`);
  };
  return (
    <div className="product_container">
      {product.transaction === "0" ? (
        <></>
      ) : (
        <div className="product_transaction">거래 {product.transaction}</div>
      )}
      <div className="product_bookmark">
        <PiBookmarkSimpleThin />
      </div>
      <img
        style={{ backgroundColor: product.backgroundcolor }}
        className="product_img"
        src={product.img}
        alt=""
      />
      <div className="product_content">
        <div className="product_brand">{product.brand}</div>
        <p className="product_name">{product.name}</p>
        {product.coupon || product.earn ? (
          <div className="product_tag_content">
            {product.coupon && <div className="product_tag_coupon">쿠폰</div>}
            {product.earn && <div className="product_tag_earn">적립</div>}
          </div>
        ) : (
          <></>
        )}
        <div className="product_price">{product.price}원</div>
        {product.buy ? (
          <p className="product_text">즉시 구매가</p>
        ) : (
          <p className="product_text">구매가</p>
        )}
      </div>
    </div>
  );
};

export default Product;
