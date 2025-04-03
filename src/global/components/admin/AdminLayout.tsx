import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import AdminFooter from "./AdminFooter";
import { ThemeProvider } from "src/global/context/ThemeContext";
import styles from "./AdminLayout.module.css";

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  // 모바일 화면 감지 및 사이드바 상태 관리
  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth <= 768;
      setIsMobile(isMobileView);

      if (isMobileView) {
        setSidebarOpen(false);
        // On mobile, always show the full sidebar when opened
        setSidebarCollapsed(false);
      } else {
        setSidebarOpen(true);
        // Restore sidebar state from localStorage on desktop
        const savedCollapseState = localStorage.getItem("sidebarCollapsed");
        if (savedCollapseState !== null) {
          setSidebarCollapsed(savedCollapseState === "true");
        }
      }
    };

    // 초기 실행
    handleResize();

    // 리사이즈 이벤트 리스너 등록
    window.addEventListener("resize", handleResize);

    // 클린업
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // 모바일에서 사이드바 토글 함수
  const toggleMobileSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  // 사이드바 확장/축소 토글 함수
  const toggleSidebarCollapse = () => {
    const newState = !isSidebarCollapsed;
    setSidebarCollapsed(newState);
    // Save preference to localStorage
    localStorage.setItem("sidebarCollapsed", String(newState));
  };

  return (
    <ThemeProvider>
      <div className={styles.adminLayout}>
        {/* 모바일에서만 보이는 사이드바 토글 버튼 */}
        {isMobile && (
          <button
            className={`${styles.sidebarToggle} ${
              isSidebarOpen ? styles.open : ""
            }`}
            onClick={toggleMobileSidebar}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        )}

        {/* 사이드바 */}
        <div
          className={`${styles.sidebarWrapper} ${
            isSidebarOpen ? styles.open : ""
          }`}
        >
          <AdminSidebar
            isCollapsed={isSidebarCollapsed}
            toggleSidebar={toggleSidebarCollapse}
          />
          {/* 모바일에서 사이드바 오픈 시 오버레이 */}
          {isMobile && isSidebarOpen && (
            <div
              className={styles.overlay}
              onClick={() => setSidebarOpen(false)}
            ></div>
          )}
        </div>

        {/* 메인 콘텐츠 영역 */}
        <div
          className={`${styles.mainContent} ${
            isSidebarCollapsed ? styles.sidebarCollapsed : ""
          }`}
        >
          <AdminHeader />
          <main className={styles.contentArea}>
            <Outlet />
          </main>
          <AdminFooter isCollapsed={isSidebarCollapsed} />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default AdminLayout;
