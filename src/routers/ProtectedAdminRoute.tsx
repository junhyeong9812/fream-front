import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAdminAuth } from "src/global/context/AdminAuthContext";
import {
  checkAdminLoginStatus,
  isAdminTokenValid,
  refreshAdminToken,
} from "../features/admin/services/adminAuthService";

interface Props {
  children: JSX.Element;
}

const ProtectedAdminRoute: React.FC<Props> = ({ children }) => {
  const { isAdminLoggedIn, setIsAdminLoggedIn } = useAdminAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // 현재 컨텍스트 상태 확인
        if (isAdminLoggedIn) {
          // 토큰 유효성 확인
          if (!isAdminTokenValid()) {
            // 토큰이 만료된 경우 리프레시 시도
            const refreshed = await refreshAdminToken();
            if (!refreshed) {
              // 리프레시 실패 시 로그아웃 상태로 전환
              setIsAdminLoggedIn(false);
            }
          }
        } else {
          // 로그인 상태 재확인 (로컬 스토리지 기반)
          const isLoggedIn = await checkAdminLoginStatus();
          setIsAdminLoggedIn(isLoggedIn);
        }
      } catch (error) {
        console.error("인증 검증 중 오류:", error);
        setIsAdminLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [isAdminLoggedIn, setIsAdminLoggedIn]);

  if (loading) {
    // 로딩 중 표시 (원하는 로딩 표시 컴포넌트로 대체 가능)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="spinner" role="status"></div>
          <p className="mt-2">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!isAdminLoggedIn) {
    // 로그인되지 않은 경우 관리자 로그인 페이지로 이동
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;
