// src/global/context/AuthContext.tsx
import React, { createContext, useEffect, useState } from "react";

interface AuthContextProps {
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
}

export const AuthContext = createContext<AuthContextProps>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // 초기 로딩 상태 추가

  useEffect(() => {
    // 컴포넌트 마운트 시점에 로컬스토리지를 확인
    const stored = localStorage.getItem("IsLoggedIn");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as { value: string; expire: number };
        const now = new Date().getTime();

        if (parsed.value === "true" && parsed.expire > now) {
          // 아직 만료되지 않았다면 로그인 상태로 전환
          setIsLoggedIn(true);
        } else {
          // 만료되었거나 값이 이상하면 로컬스토리지에서 제거
          localStorage.removeItem("IsLoggedIn");
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error parsing IsLoggedIn:", error);
        localStorage.removeItem("IsLoggedIn");
        setIsLoggedIn(false);
      }
    }
    setLoading(false); // 상태 로딩 완료
  }, []);

  // (선택) 매 분마다 만료 체크하고 싶다면, setInterval을 둘 수도 있음
  // 다만, 보통은 페이지 리로딩/새로고침 시점에만 검사해도 충분.
  if (loading) return null; // 데이터가 로드될 때까지 화면 렌더링 방지

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};
