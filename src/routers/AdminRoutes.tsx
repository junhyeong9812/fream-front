import AdminLoginPage from "../features/admin/pages/AdminLoginPage";
import AdminLayout from "../features/admin/pages/AdminLayout";
import AdminPage from "../features/admin/pages/adminPage";
import React from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedAdminRoute from "./ProtectedAdminRoute";
import AdminFindEmail from "../features/admin/pages/AdminFindEmailPage";
import AdminFindPassword from "../features/admin/pages/AdminFindPasswordPage";
import MonitoringPage from "../features/admin/pages/MonitoringPage";

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 관리자 로그인 페이지 - 보호되지 않음 */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin/login/find_email" element={<AdminFindEmail />} />
      <Route
        path="/admin/login/find_password"
        element={<AdminFindPassword />}
      />
      <Route path="monitoring" element={<MonitoringPage />} />
      {/* 보호된 관리자 경로들 */}
      <Route
        path="/admin"
        element={
          <ProtectedAdminRoute>
            <AdminLayout />
          </ProtectedAdminRoute>
        }
      >
        <Route index element={<AdminPage />} />
        {/* <Route path="users" element={<AdminUsersPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="stats" element={<AdminStatsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} /> */}
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
