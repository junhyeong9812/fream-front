import React, { createContext, useState, useEffect, ReactNode } from "react";

// 인터페이스 정의
interface AdminAuthContextType {
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  adminLogout: () => void;
}

// 기본값 생성
const defaultContext: AdminAuthContextType = {
  isAdminLoggedIn: false,
  setIsAdminLoggedIn: () => {},
  adminLogout: () => {},
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

  // 컴포넌트 마운트 시 로컬 스토리지에서 로그인 상태 확인
  useEffect(() => {
    const storedAdminLoggedIn =
      localStorage.getItem("isAdminLoggedIn") === "true";
    setIsAdminLoggedIn(storedAdminLoggedIn);
  }, []);

  // 로그인 상태 변경 시 로컬 스토리지 업데이트
  useEffect(() => {
    localStorage.setItem("isAdminLoggedIn", isAdminLoggedIn.toString());
  }, [isAdminLoggedIn]);

  // 로그아웃 함수
  const adminLogout = () => {
    // TODO: 서버에 로그아웃 요청하는 API 호출 추가
    localStorage.removeItem("isAdminLoggedIn");
    setIsAdminLoggedIn(false);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAdminLoggedIn,
        setIsAdminLoggedIn,
        adminLogout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

// 커스텀 훅
export const useAdminAuth = () => React.useContext(AdminAuthContext);
