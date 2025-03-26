import React from "react";
import styled from "styled-components";
import { Outlet } from "react-router-dom";

const AdminContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f5f5f5;
`;

const AdminSidebar = styled.div`
  width: 250px;
  background-color: #212529;
  color: white;
  padding: 20px 0;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
`;

const AdminHeader = styled.div`
  height: 64px;
  background-color: white;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  padding: 0 20px;
  justify-content: space-between;
`;

const AdminContent = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const ContentArea = styled.div`
  padding: 20px;
  flex-grow: 1;
`;

const SidebarTitle = styled.div`
  padding: 15px 20px;
  font-size: 20px;
  font-weight: bold;
  border-bottom: 1px solid #444;
  margin-bottom: 20px;
`;

const SidebarMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SidebarMenuItem = styled.li`
  padding: 12px 20px;
  cursor: pointer;
  &:hover {
    background-color: #343a40;
  }
`;

const AdminLayout: React.FC = () => {
  return (
    <AdminContainer>
      <AdminSidebar>
        <SidebarTitle>관리자 대시보드</SidebarTitle>
        <SidebarMenu>
          <SidebarMenuItem>대시보드</SidebarMenuItem>
          <SidebarMenuItem>사용자 관리</SidebarMenuItem>
          <SidebarMenuItem>상품 관리</SidebarMenuItem>
          <SidebarMenuItem>주문 관리</SidebarMenuItem>
          <SidebarMenuItem>통계</SidebarMenuItem>
          <SidebarMenuItem>설정</SidebarMenuItem>
        </SidebarMenu>
      </AdminSidebar>
      <AdminContent>
        <AdminHeader>
          <h3>관리자 페이지</h3>
          <div>관리자님 환영합니다</div>
        </AdminHeader>
        <ContentArea>
          <Outlet />
        </ContentArea>
      </AdminContent>
    </AdminContainer>
  );
};

export default AdminLayout;
