import React from "react";
import styled from "styled-components";

const DashboardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const DashboardCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const CardTitle = styled.h4`
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
`;

const CardValue = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #2c7be5;
`;

const AdminPage: React.FC = () => {
  return (
    <div>
      <h2>대시보드</h2>
      <DashboardContainer>
        <DashboardCard>
          <CardTitle>총 판매액</CardTitle>
          <CardValue>₩12,345,678</CardValue>
        </DashboardCard>
        <DashboardCard>
          <CardTitle>총 사용자 수</CardTitle>
          <CardValue>5,432</CardValue>
        </DashboardCard>
        <DashboardCard>
          <CardTitle>총 상품 수</CardTitle>
          <CardValue>1,234</CardValue>
        </DashboardCard>
        <DashboardCard>
          <CardTitle>총 주문 수</CardTitle>
          <CardValue>4,321</CardValue>
        </DashboardCard>
      </DashboardContainer>
    </div>
  );
};

export default AdminPage;
