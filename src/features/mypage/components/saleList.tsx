import React from "react";
import styled from "styled-components";
import { SaleBidResponseDto } from "../types/mypageTypes"; // DTO 파일 import

const SaleListContainer = styled.div`
  margin-top: 20px;
`;

const SaleItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-top: 1px solid #ebebeb;
  border-bottom: 1px solid #ebebeb;
`;

const ImageWrapper = styled.div`
  flex: 0 0 80px;
  height: 80px;
  background-color: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProductInfo = styled.div`
  flex: 1;
  margin-left: 10px;

  .product-name {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .product-size {
    font-size: 14px;
    color: #777;
  }
`;

const SaleDate = styled.div`
  flex: 0 0 100px;
  text-align: center;
  font-size: 14px;
  color: #777;
`;

const StatusContainer = styled.div`
  flex: 0 0 120px;
  text-align: right;

  .status {
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 5px;
    color: #222;
  }

  .style-upload {
    font-size: 14px;
    color: #007aff;
    cursor: pointer;
    text-decoration: underline;

    &:hover {
      color: #0056b3;
    }
  }
`;

const SaleList: React.FC<{ sales: SaleBidResponseDto[] }> = ({ sales }) => {
  return (
    <SaleListContainer>
      {sales.map((sale) => (
        <SaleItem key={sale.saleBidId}>
          <ImageWrapper>
            <img src={sale.thumbnailImageUrl} alt={sale.productName} />
          </ImageWrapper>
          <ProductInfo>
            <div className="product-name">{sale.productName}</div>
            <div className="product-size">{sale.size}</div>
          </ProductInfo>
          <SaleDate>{sale.createdDate.toLocaleDateString()}</SaleDate>
          <StatusContainer>
            <div className="status">{sale.shipmentStatus}</div>
            {sale.shipmentStatus === "배송완료" && (
              <div className="style-upload">스타일 올리기</div>
            )}
          </StatusContainer>
        </SaleItem>
      ))}
    </SaleListContainer>
  );
};

export default SaleList;
