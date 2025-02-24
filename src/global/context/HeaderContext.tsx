import React, { createContext, useContext, useState, useEffect } from "react";

interface HeaderContextType {
  headerHeight: number;
}

const HeaderContext = createContext<HeaderContextType>({ headerHeight: 0 });

export const HeaderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [headerHeight, setHeaderHeight] = useState(0);

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

  return (
    <HeaderContext.Provider value={{ headerHeight }}>
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeader = () => useContext(HeaderContext);
