import React from "react";
import styled from "styled-components";
import { OrderBidResponseDto } from "../types/mypageTypes";
// DTO 파일 import

const OrderListContainer = styled.div`
  margin-top: 20px;
`;

const OrderItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-top: 1px solid #ebebeb;
  border-bottom: 1px solid #ebebeb;
`;
// &:last-child {
//     border-bottom: none;
//   }

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

const OrderDate = styled.div`
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

const OrderList: React.FC<{ orders: OrderBidResponseDto[] }> = ({ orders }) => {
  return (
    <OrderListContainer>
      {orders.map((order) => (
        <OrderItem key={order.orderBidId}>
          <ImageWrapper>
            <img src={order.imageUrl} alt={order.productName} />
          </ImageWrapper>
          <ProductInfo>
            <div className="product-name">{order.productName}</div>
            <div className="product-size">{order.size}</div>
          </ProductInfo>
          <OrderDate>{order.createdDate.toLocaleDateString()}</OrderDate>
          <StatusContainer>
            <div className="status">{order.shipmentStatus}</div>
            {order.shipmentStatus === "배송완료" && (
              <div className="style-upload">스타일 올리기</div>
            )}
          </StatusContainer>
        </OrderItem>
      ))}
    </OrderListContainer>
  );
};

export default OrderList;
