import React, { useState, useEffect } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import AdminFooter from "./AdminFooter";
import { ThemeProvider } from "src/global/context/ThemeContext";
import styles from "./AdminLayout.module.css";

interface SubmenuPosition {
  top: number;
  left: number;
}

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(() => {
    // Check localStorage for saved preference, default to false
    const savedState = localStorage.getItem("sidebarCollapsed");
    return savedState === "true";
  });

  // 하위 메뉴 모달 상태 관리
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [submenuPosition, setSubmenuPosition] = useState<SubmenuPosition>({
    top: 0,
    left: 0,
  });
  const [activeSubmenuData, setActiveSubmenuData] = useState<any>(null);

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

  // 페이지 이동 시 모달 닫기
  useEffect(() => {
    setActiveSubmenu(null);
  }, [location.pathname]);

  // 외부 클릭 시 모달 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const modalElement = document.getElementById("submenu-modal-container");
      const target = event.target as Node;

      if (activeSubmenu && modalElement && !modalElement.contains(target)) {
        // 사이드바 내부의 화살표 버튼 클릭은 무시 (이미 토글 처리됨)
        const sidebarElement = document.querySelector(
          `.${styles.adminSidebar}`
        );
        if (sidebarElement && sidebarElement.contains(target)) {
          return;
        }

        setActiveSubmenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeSubmenu, styles.adminSidebar]);

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
    // 축소/확장 시 하위 메뉴 모달 닫기
    setActiveSubmenu(null);
  };

  // 하위 메뉴 활성화 함수
  const handleSubmenuActivate = (
    menuId: string,
    position: SubmenuPosition,
    menuData: any
  ) => {
    setActiveSubmenu(menuId);
    setSubmenuPosition(position);
    setActiveSubmenuData(menuData);
  };

  // 하위 메뉴 비활성화 함수
  const handleSubmenuDeactivate = () => {
    setActiveSubmenu(null);
  };

  // 모달 위치를 계산하는 함수
  const calculateModalPosition = () => {
    // 모바일에서는 다른 위치 계산
    if (isMobile) {
      return {
        top: `${submenuPosition.top}px`,
        left: "70px",
      };
    }

    // 기본 위치 계산
    return {
      top: `${submenuPosition.top}px`,
      left: isSidebarCollapsed ? "70px" : "280px",
    };
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
            activeSubmenu={activeSubmenu}
            onSubmenuActivate={handleSubmenuActivate}
            onSubmenuDeactivate={handleSubmenuDeactivate}
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

        {/* 하위 메뉴 모달 (레이아웃 레벨에서 렌더링) */}
        {activeSubmenu && activeSubmenuData && (
          <div
            id="submenu-modal-container"
            className={styles.submenuModalContainer}
            style={calculateModalPosition()}
          >
            <div className={styles.submenuModal}>
              <div className={styles.submenuModalHeader}>
                {activeSubmenuData.title}
              </div>
              <ul className={styles.submenuModalList}>
                {activeSubmenuData.submenus.map((submenu: any) => (
                  <li key={submenu.id} className={styles.submenuItem}>
                    <Link
                      to={submenu.link}
                      className={`${styles.submenuLink} ${
                        location.pathname.startsWith(submenu.link)
                          ? styles.active
                          : ""
                      }`}
                      onClick={handleSubmenuDeactivate}
                    >
                      {submenu.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </ThemeProvider>
  );
};

export default AdminLayout;
