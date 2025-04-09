import React from "react";
import { Route, Routes } from "react-router-dom";
import AdminFindEmail from "../features/admin/pages/AdminFindEmailPage";
import AdminFindPassword from "../features/admin/pages/AdminFindPasswordPage";
import MonitoringPage from "../features/admin/pages/MonitoringPage";
import AdminPage from "../features/admin/pages/adminPage";
import ProtectedAdminRoute from "./ProtectedAdminRoute";
import { ThemeProvider } from "../global/context/ThemeContext";
import AdminLayout from "src/global/components/admin/AdminLayout";
import AdminLoginPage from "../features/admin/pages/AdminLoginPage";
import InspectionManagement from "../features/admin/pages/InspectionManagementPage";
import NoticeManagementPage from "../features/admin/pages/NoticeManagementPage";
import FAQManagementPage from "../features/admin/pages/FAQManagementPage";
import ProductManagementPage from "../features/admin/pages/ProductManagementPage";
import BrandManagementPage from "../features/admin/pages/BrandManagementPage";
import CollectionManagementPage from "../features/admin/pages/CollectionManagementPage";
import ProductCreateEditPage from "../features/admin/pages/ProductCreateEditPage";
import ProductDetailPage from "../features/admin/pages/ProductDetailPage";
import ProductColorPage from "../features/admin/pages/ProductColorPage";

const AdminRoutes: React.FC = () => {
  return (
    <ThemeProvider>
      <Routes>
        {/* 비보호 라우트 - 헤더, 사이드바, 푸터 없이 페이지만 표시 */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/login/find_email" element={<AdminFindEmail />} />
        <Route
          path="/admin/login/find_password"
          element={<AdminFindPassword />}
        />

        {/* 보호된 관리자 경로 - AdminLayout 적용 */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          <Route index element={<AdminPage />} />

          <Route path="/admin/monitoring" element={<MonitoringPage />} />

          {/* 상품 관리 */}
          <Route path="products" element={<ProductManagementPage />} />
          <Route path="products/add" element={<ProductCreateEditPage />} />
          <Route
            path="products/edit/:productId"
            element={<ProductCreateEditPage />}
          />
          <Route
            path="products/detail/:productId/:colorId"
            element={<ProductDetailPage />}
          />
          <Route
            path="products/color/add/:productId"
            element={<ProductColorPage />}
          />
          <Route
            path="products/color/edit/:productId/:colorId"
            element={<ProductColorPage />}
          />

          <Route
            path="products/categories"
            element={<div>카테고리 관리 페이지</div>}
          />
          <Route path="products/brands" element={<BrandManagementPage />} />
          <Route
            path="products/collections"
            element={<CollectionManagementPage />}
          />

          {/* 주문/배송 관리 */}
          <Route path="orders" element={<div>주문 목록 페이지</div>} />
          <Route
            path="orders/returns"
            element={<div>반품/취소 관리 페이지</div>}
          />
          <Route path="orders/pickup" element={<div>집화 관리 페이지</div>} />
          <Route path="orders/delivery" element={<div>배송 현황 페이지</div>} />

          {/* 스타일 관리 */}
          <Route path="styles" element={<div>스타일 게시물 관리 페이지</div>} />
          <Route
            path="styles/reports"
            element={<div>스타일 신고 관리 페이지</div>}
          />
          <Route path="styles/tags" element={<div>태그 관리 페이지</div>} />

          {/* 회원 관리 */}
          <Route path="users" element={<div>회원 목록 페이지</div>} />
          <Route path="users/grades" element={<div>등급 관리 페이지</div>} />
          <Route path="users/sanctions" element={<div>제재 관리 페이지</div>} />

          {/* 매출 관리 */}
          <Route path="sales" element={<div>매출 현황 페이지</div>} />
          <Route
            path="sales/by-product"
            element={<div>상품별 매출 페이지</div>}
          />
          <Route
            path="sales/by-category"
            element={<div>카테고리별 매출 페이지</div>}
          />

          {/* 고객 지원 */}
          <Route
            path="customer-service/inquiries"
            element={<div>1:1 문의 페이지</div>}
          />
          <Route path="customer-service/faq" element={<FAQManagementPage />} />
          <Route
            path="customer-service/notices"
            element={<NoticeManagementPage />}
          />
          {/* 검수 기준 관리 추가 */}
          <Route
            path="customer-service/inspection-standards"
            element={<InspectionManagement />}
          />

          {/* 설정 */}
          <Route path="settings/site" element={<div>사이트 설정 페이지</div>} />
          <Route
            path="settings/admins"
            element={<div>관리자 계정 페이지</div>}
          />
          <Route path="settings/roles" element={<div>권한 관리 페이지</div>} />

          {/* 도움말 */}
          <Route path="help" element={<div>도움말 페이지</div>} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
};

export default AdminRoutes;
