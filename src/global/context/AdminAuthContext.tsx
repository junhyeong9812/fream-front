import React, { createContext, useState, useEffect, ReactNode } from "react";
import {
  checkAdminLoginStatus,
  refreshAdminToken,
  adminLogout as logoutService,
  isAdminTokenValid,
} from "../../features/admin/services/adminAuthService";

// 인터페이스 정의
interface AdminAuthContextType {
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  adminLogout: () => Promise<void>;
  refreshAdminToken: () => Promise<boolean>;
  isLoading: boolean;
}

// 기본값 생성
const defaultContext: AdminAuthContextType = {
  isAdminLoggedIn: false,
  setIsAdminLoggedIn: () => {},
  adminLogout: async () => {},
  refreshAdminToken: async () => false,
  isLoading: true,
};

// Context 생성
export const AdminAuthContext =
  createContext<AdminAuthContextType>(defaultContext);

// Props 인터페이스
interface AdminAuthProviderProps {
  children: ReactNode;
}

// Provider 컴포넌트
export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({
  children,
}) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 컴포넌트 마운트 시 로그인 상태 확인
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);

      try {
        // 로그인 상태 및 토큰 유효성 확인
        const isLoggedIn = await checkAdminLoginStatus();
        setIsAdminLoggedIn(isLoggedIn);
      } catch (error) {
        console.error("관리자 인증 초기화 오류:", error);
        setIsAdminLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // 토큰 자동 갱신 및 주기적 검사 설정
  useEffect(() => {
    let tokenCheckInterval: NodeJS.Timeout;

    if (isAdminLoggedIn) {
      // 토큰 유효성을 주기적으로 확인하는 타이머 (5분마다)
      tokenCheckInterval = setInterval(async () => {
        // 토큰 유효성 확인
        if (!isAdminTokenValid()) {
          // 토큰이 만료되면 리프레시 시도
          const refreshed = await refreshAdminTokenHandler();

          // 리프레시 실패 시 로그아웃
          if (!refreshed) {
            await adminLogout();
          }
        }
      }, 5 * 60 * 1000); // 5분마다
    }

    return () => {
      if (tokenCheckInterval) {
        clearInterval(tokenCheckInterval);
      }
    };
  }, [isAdminLoggedIn]);

  // 토큰 갱신 함수
  const refreshAdminTokenHandler = async (): Promise<boolean> => {
    try {
      const result = await refreshAdminToken();
      return result;
    } catch (error) {
      console.error("토큰 갱신 중 오류:", error);
      return false;
    }
  };

  // 로그아웃 함수
  const adminLogout = async (): Promise<void> => {
    try {
      await logoutService();
    } catch (error) {
      console.error("로그아웃 중 오류:", error);
    } finally {
      setIsAdminLoggedIn(false);
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAdminLoggedIn,
        setIsAdminLoggedIn,
        adminLogout,
        refreshAdminToken: refreshAdminTokenHandler,
        isLoading,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

// 커스텀 훅
export const useAdminAuth = () => React.useContext(AdminAuthContext);
