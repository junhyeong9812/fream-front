import React, { createContext, useState, useEffect, ReactNode } from "react";
import {
  checkAdminLoginStatus,
  adminLogout as logoutService,
} from "../../features/admin/services/adminAuthService";

// 인터페이스 정의
interface AdminAuthContextType {
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  adminLogout: () => Promise<void>;
  isLoading: boolean;
}

// 기본값 생성
const defaultContext: AdminAuthContextType = {
  isAdminLoggedIn: false,
  setIsAdminLoggedIn: () => {},
  adminLogout: async () => {},
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
      console.log("AdminAuthContext: 인증 초기화 시작");

      try {
        // 로그인 상태 확인
        const isLoggedIn = await checkAdminLoginStatus();
        console.log("AdminAuthContext: 로그인 상태 확인 결과", { isLoggedIn });

        setIsAdminLoggedIn(isLoggedIn);
      } catch (error) {
        console.error("AdminAuthContext: 관리자 인증 초기화 오류:", error);
        setIsAdminLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // 상태 변화 디버깅
  useEffect(() => {
    console.log("AdminAuthContext: 로그인 상태 변경", { isAdminLoggedIn });
  }, [isAdminLoggedIn]);

  // 로그아웃 함수
  const adminLogout = async (): Promise<void> => {
    try {
      console.log("AdminAuthContext: 로그아웃 시작");
      await logoutService();
      console.log("AdminAuthContext: 로그아웃 완료");
    } catch (error) {
      console.error("AdminAuthContext: 로그아웃 중 오류:", error);
    } finally {
      setIsAdminLoggedIn(false);
    }
  };

  const contextValue = {
    isAdminLoggedIn,
    setIsAdminLoggedIn,
    adminLogout,
    isLoading,
  };

  return (
    <AdminAuthContext.Provider value={contextValue}>
      {children}
    </AdminAuthContext.Provider>
  );
};

// 커스텀 훅
export const useAdminAuth = () => React.useContext(AdminAuthContext);
