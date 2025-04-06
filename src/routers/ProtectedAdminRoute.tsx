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
        console.log("ProtectedAdminRoute: 인증 검증 시작", { isAdminLoggedIn });

        // 현재 컨텍스트 상태 확인
        if (isAdminLoggedIn) {
          console.log(
            "ProtectedAdminRoute: 로그인 상태 확인됨, 토큰 유효성 검사 중"
          );

          // 토큰 유효성 확인
          if (!isAdminTokenValid()) {
            console.log("ProtectedAdminRoute: 토큰 만료됨, 리프레시 시도");

            // 토큰이 만료된 경우, 리프레시 시도
            const refreshed = await refreshAdminToken();

            if (!refreshed) {
              console.log("ProtectedAdminRoute: 토큰 리프레시 실패");
              // 리프레시 실패 시 로그아웃 상태로 전환
              setIsAdminLoggedIn(false);
            } else {
              console.log("ProtectedAdminRoute: 토큰 리프레시 성공");
            }
          } else {
            console.log("ProtectedAdminRoute: 토큰 유효함");
          }
        } else {
          console.log("ProtectedAdminRoute: 로그인 상태 아님, 재확인 중");

          // 로그인 상태 재확인 (로컬 스토리지 기반)
          const isLoggedIn = await checkAdminLoginStatus();
          console.log("ProtectedAdminRoute: 로그인 상태 재확인 결과", {
            isLoggedIn,
          });

          setIsAdminLoggedIn(isLoggedIn);
        }
      } catch (error) {
        console.error("ProtectedAdminRoute: 인증 검증 중 오류:", error);
        setIsAdminLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [isAdminLoggedIn, setIsAdminLoggedIn]);

  if (loading) {
    // 로딩 중 표시
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
    console.log(
      "ProtectedAdminRoute: 로그인되지 않음, 로그인 페이지로 리다이렉트"
    );
    // 로그인되지 않은 경우 관리자 로그인 페이지로 이동
    return <Navigate to="/admin/login" replace />;
  }

  console.log("ProtectedAdminRoute: 인증 성공, 자식 컴포넌트 렌더링");
  return children;
};

export default ProtectedAdminRoute;
