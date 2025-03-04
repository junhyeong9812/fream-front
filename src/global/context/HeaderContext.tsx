import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { fetchTodayAccessCount } from "../components/header/services/accessLogQueryService";

interface HeaderContextType {
  headerHeight: number;
  todayAccessCount: number;
  refreshAccessCount: () => Promise<void>;
}

const HeaderContext = createContext<HeaderContextType>({
  headerHeight: 0,
  todayAccessCount: 0,
  refreshAccessCount: async () => {}
});

export const HeaderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [headerHeight, setHeaderHeight] = useState(0);
  const [todayAccessCount, setTodayAccessCount] = useState(0);

  // 접속자 수 갱신 함수
  const refreshAccessCount = useCallback(async () => {
    try {
      const count = await fetchTodayAccessCount();
      setTodayAccessCount(count);
    } catch (error) {
      console.error("접속자 수 갱신 실패:", error);
    }
  }, []);

  // 헤더 높이 관련 로직
  useEffect(() => {
    const updateHeaderHeight = () => {
      const header = document.querySelector("header");
      if (header) {
        setHeaderHeight(header.offsetHeight);
        // CSS 변수도 설정
        document.documentElement.style.setProperty(
          "--global-header-height",
          `${header.offsetHeight}px`
        );
      }
    };

    updateHeaderHeight();

    const resizeObserver = new ResizeObserver(() => {
      updateHeaderHeight();
    });

    const header = document.querySelector("header");
    if (header) {
      resizeObserver.observe(header);
    }

    window.addEventListener("load", updateHeaderHeight);
    window.addEventListener("resize", updateHeaderHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("load", updateHeaderHeight);
      window.removeEventListener("resize", updateHeaderHeight);
    };
  }, []);

  // 초기 접속자 수 로드
  useEffect(() => {
    refreshAccessCount();
  }, [refreshAccessCount]);

  return (
    <HeaderContext.Provider value={{ 
      headerHeight, 
      todayAccessCount, 
      refreshAccessCount 
    }}>
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeader = () => useContext(HeaderContext);