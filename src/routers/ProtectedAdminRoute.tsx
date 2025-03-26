// ProtectedAdminRoute.tsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAdminAuth } from "src/global/context/AdminAuthContext";

interface Props {
  children: JSX.Element;
}

const ProtectedAdminRoute: React.FC<Props> = ({ children }) => {
  const { isAdminLoggedIn } = useAdminAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 로컬 스토리지 확인을 위한 짧은 딜레이
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) return null; // 로딩 중에는 아무것도 렌더링하지 않음

  if (!isAdminLoggedIn) {
    // 로그인되지 않은 경우 관리자 로그인 페이지로 이동
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;
