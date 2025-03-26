import AdminLoginPage from "../features/admin/pages/AdminLoginPage";
import AdminLayout from "../features/admin/pages/AdminLayout";
import AdminPage from "../features/admin/pages/adminPage";
import React from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedAdminRoute from "./ProtectedAdminRoute";

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 관리자 로그인 페이지 - 보호되지 않음 */}
      <Route path="/login" element={<AdminLoginPage />} />

      {/* 보호된 관리자 경로들 */}
      <Route
        path="/"
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
