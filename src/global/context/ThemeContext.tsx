import React, { createContext, useState, useEffect, ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const defaultThemeContext: ThemeContextType = {
  theme: "light",
  toggleTheme: () => {},
};

export const ThemeContext =
  createContext<ThemeContextType>(defaultThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // 로컬 스토리지에서 테마 설정 불러오기
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("adminTheme");
    return (savedTheme as Theme) || "light";
  });

  // 테마 변경 함수
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("adminTheme", newTheme);

    // HTML 요소에 테마 클래스 적용
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark-theme");
    } else {
      document.documentElement.classList.remove("dark-theme");
    }
  };

  // 초기 렌더링 시 테마 적용
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark-theme");
    } else {
      document.documentElement.classList.remove("dark-theme");
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 테마 훅
export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
