import React from "react";
import styled from "styled-components";
import {
  OrderBidResponseDto,
  OrderStatus,
  OrderStatusKorean,
} from "../types/order";

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
  // 날짜 포맷 헬퍼 함수
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // 주문 상태 표시 헬퍼 함수
  const getOrderStatusDisplay = (order: OrderBidResponseDto): string => {
    // 백엔드에서 문자열로 오는 orderStatus를 OrderStatus enum 타입으로 변환
    const orderStatus = order.orderStatus as keyof typeof OrderStatusKorean;

    // 상태에 해당하는 한글 텍스트 반환
    return OrderStatusKorean[orderStatus] || order.orderStatus;
  };

  return (
    <OrderListContainer>
      {orders.map((order) => (
        <OrderItem key={order.orderBidId}>
          <ImageWrapper>
            <img
              src={order.imageUrl || "https://via.placeholder.com/80"}
              alt={order.productName}
            />
          </ImageWrapper>
          <ProductInfo>
            <div className="product-name">{order.productName}</div>
            <div className="product-size">{order.size}</div>
          </ProductInfo>
          <OrderDate>{formatDate(order.createdDate)}</OrderDate>
          <StatusContainer>
            <div className="status">{getOrderStatusDisplay(order)}</div>
            {order.orderStatus === OrderStatus.COMPLETED && (
              <a href="/#" className="style-upload">
                스타일 올리기
              </a>
            )}
          </StatusContainer>
        </OrderItem>
      ))}
    </OrderListContainer>
  );
};

export default OrderList;
