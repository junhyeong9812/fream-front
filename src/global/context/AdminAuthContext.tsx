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

  // 토큰 자동 갱신 및 주기적 검사 설정
  useEffect(() => {
    let tokenCheckInterval: NodeJS.Timeout;

    if (isAdminLoggedIn) {
      console.log("AdminAuthContext: 로그인 상태, 토큰 검사 타이머 설정");

      // 토큰 유효성을 주기적으로 확인하는 타이머 (5분마다)
      tokenCheckInterval = setInterval(async () => {
        // 토큰 유효성 확인
        const isValid = await isAdminTokenValid();
        if (!isValid) {
          console.log("AdminAuthContext: 토큰 만료 감지, 리프레시 시도");

          // 토큰이 만료된 경우, 리프레시 시도
          const refreshed = await refreshAdminTokenHandler();

          // 리프레시 실패 시 로그아웃
          if (!refreshed) {
            console.log("AdminAuthContext: 토큰 리프레시 실패, 로그아웃 처리");
            await adminLogout();
          } else {
            console.log("AdminAuthContext: 토큰 리프레시 성공");
          }
        }
      }, 5 * 60 * 1000); // 5분마다
    }

    return () => {
      if (tokenCheckInterval) {
        clearInterval(tokenCheckInterval);
        console.log("AdminAuthContext: 토큰 검사 타이머 정리");
      }
    };
  }, [isAdminLoggedIn]);

  // 상태 변화 디버깅
  useEffect(() => {
    console.log("AdminAuthContext: 로그인 상태 변경", { isAdminLoggedIn });
  }, [isAdminLoggedIn]);

  // 토큰 갱신 함수
  const refreshAdminTokenHandler = async (): Promise<boolean> => {
    try {
      console.log("AdminAuthContext: 토큰 갱신 요청");
      const result = await refreshAdminToken();
      console.log("AdminAuthContext: 토큰 갱신 결과", { result });
      return result;
    } catch (error) {
      console.error("AdminAuthContext: 토큰 갱신 중 오류:", error);
      return false;
    }
  };

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
    refreshAdminToken: refreshAdminTokenHandler,
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
