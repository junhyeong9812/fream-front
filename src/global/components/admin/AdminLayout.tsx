import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import AdminFooter from "./AdminFooter";
import { ThemeProvider } from "../../context/ThemeContext";
import styles from "./AdminLayout.module.css";

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // 모바일 화면 감지
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
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

  // 사이드바 토글 함수
  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
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
            onClick={toggleSidebar}
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
          <AdminSidebar />
          {/* 모바일에서 사이드바 오픈 시 오버레이 */}
          {isMobile && isSidebarOpen && (
            <div
              className={styles.overlay}
              onClick={() => setSidebarOpen(false)}
            ></div>
          )}
        </div>

        {/* 메인 콘텐츠 영역 */}
        <div className={styles.mainContent}>
          <AdminHeader />
          <main className={styles.contentArea}>
            <Outlet />
          </main>
          <AdminFooter />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default AdminLayout;
