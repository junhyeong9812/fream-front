import React, { useState, useContext, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiChevronDown,
  FiChevronRight,
  FiShoppingBag,
  FiTruck,
  FiImage,
  FiUsers,
  FiBarChart2,
  FiSettings,
  FiDollarSign,
  FiMessageSquare,
  FiAlertCircle,
  FiHelpCircle,
  FiChevronLeft,
  FiChevronRight as FiChevronRightIcon,
} from "react-icons/fi";
import styles from "./AdminSidebar.module.css";
import { ThemeContext } from "src/global/context/ThemeContext";

interface MenuItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  link?: string;
  submenus?: Array<{
    id: string;
    title: string;
    link: string;
  }>;
}

interface AdminSidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  activeSubmenu: string | null;
  onSubmenuActivate: (
    menuId: string,
    position: { top: number; left: number },
    menuData: any
  ) => void;
  onSubmenuDeactivate: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isCollapsed,
  toggleSidebar,
  activeSubmenu,
  onSubmenuActivate,
  onSubmenuDeactivate,
}) => {
  const location = useLocation();
  const { theme } = useContext(ThemeContext);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // 사이드바 메뉴 데이터
  const menuItems: MenuItem[] = [
    {
      id: "dashboard",
      title: "대시보드",
      icon: <FiBarChart2 />,
      link: "/admin",
    },
    {
      id: "products",
      title: "상품 관리",
      icon: <FiShoppingBag />,
      submenus: [
        { id: "product-list", title: "상품 목록", link: "/admin/products" },
        { id: "product-add", title: "상품 등록", link: "/admin/products/add" },
        {
          id: "product-categories",
          title: "카테고리 관리",
          link: "/admin/products/categories",
        },
        {
          id: "product-brands",
          title: "브랜드 관리",
          link: "/admin/products/brands",
        },
      ],
    },
    {
      id: "orders",
      title: "주문/배송 관리",
      icon: <FiTruck />,
      submenus: [
        { id: "order-list", title: "주문 목록", link: "/admin/orders" },
        {
          id: "order-returns",
          title: "반품/취소 관리",
          link: "/admin/orders/returns",
        },
        {
          id: "order-pickup",
          title: "집화 관리",
          link: "/admin/orders/pickup",
        },
        {
          id: "order-delivery",
          title: "배송 현황",
          link: "/admin/orders/delivery",
        },
      ],
    },
    {
      id: "styles",
      title: "스타일 관리",
      icon: <FiImage />,
      submenus: [
        { id: "style-posts", title: "게시물 관리", link: "/admin/styles" },
        {
          id: "style-report",
          title: "신고 관리",
          link: "/admin/styles/reports",
        },
        { id: "style-tags", title: "태그 관리", link: "/admin/styles/tags" },
      ],
    },
    {
      id: "users",
      title: "회원 관리",
      icon: <FiUsers />,
      submenus: [
        { id: "user-list", title: "회원 목록", link: "/admin/users" },
        { id: "user-grades", title: "등급 관리", link: "/admin/users/grades" },
        {
          id: "user-sanctions",
          title: "제재 관리",
          link: "/admin/users/sanctions",
        },
      ],
    },
    {
      id: "sales",
      title: "매출 관리",
      icon: <FiDollarSign />,
      submenus: [
        { id: "sales-summary", title: "매출 현황", link: "/admin/sales" },
        {
          id: "sales-by-product",
          title: "상품별 매출",
          link: "/admin/sales/by-product",
        },
        {
          id: "sales-by-category",
          title: "카테고리별 매출",
          link: "/admin/sales/by-category",
        },
      ],
    },
    {
      id: "customer-service",
      title: "고객 지원",
      icon: <FiMessageSquare />,
      submenus: [
        {
          id: "cs-inquiries",
          title: "1:1 문의",
          link: "/admin/customer-service/inquiries",
        },
        {
          id: "cs-faq",
          title: "FAQ 관리",
          link: "/admin/customer-service/faq",
        },
        {
          id: "cs-notices",
          title: "공지사항 관리",
          link: "/admin/customer-service/notices",
        },
        {
          id: "cs-inspection",
          title: "검수 기준 관리",
          link: "/admin/customer-service/inspection-standards",
        },
      ],
    },
    {
      id: "monitoring",
      title: "모니터링",
      icon: <FiAlertCircle />,
      link: "/admin/monitoring",
    },
    {
      id: "settings",
      title: "설정",
      icon: <FiSettings />,
      submenus: [
        {
          id: "setting-site",
          title: "사이트 설정",
          link: "/admin/settings/site",
        },
        {
          id: "setting-admin",
          title: "관리자 계정",
          link: "/admin/settings/admins",
        },
        {
          id: "setting-roles",
          title: "권한 관리",
          link: "/admin/settings/roles",
        },
      ],
    },
    {
      id: "help",
      title: "도움말",
      icon: <FiHelpCircle />,
      link: "/admin/help",
    },
  ];

  // 메뉴 확장/축소 토글 함수
  const toggleMenu = (menuId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (isCollapsed) {
      // 축소 모드에서는 모달 방식으로 처리
      return;
    }

    setExpandedMenus((prevState) =>
      prevState.includes(menuId)
        ? prevState.filter((id) => id !== menuId)
        : [...prevState, menuId]
    );
  };

  // 현재 경로가 메뉴 아이템과 일치하는지 확인
  const isActive = (link: string) => {
    if (link === "/admin" && location.pathname === "/admin") {
      return true;
    }
    return location.pathname.startsWith(link) && link !== "/admin";
  };

  // 축소 상태에서 하위 메뉴 토글 처리
  const toggleSubmenu = (
    menuId: string,
    item: MenuItem,
    event: React.MouseEvent
  ) => {
    event.preventDefault();
    event.stopPropagation();

    const menuElement = menuRefs.current[menuId];
    if (!menuElement) return;

    const rect = menuElement.getBoundingClientRect();

    if (activeSubmenu === menuId) {
      onSubmenuDeactivate();
    } else {
      onSubmenuActivate(menuId, { top: rect.top, left: rect.left }, item);
    }
  };

  return (
    <div
      className={`${styles.adminSidebar} ${
        theme === "dark" ? styles.dark : ""
      } ${isCollapsed ? styles.collapsed : ""}`}
    >
      <div className={styles.logoContainer}>
        <Link to="/admin" className={styles.logoLink}>
          <span className={styles.logoText}>{isCollapsed ? "F" : "Fream"}</span>
          {!isCollapsed && <span className={styles.adminBadge}>Admin</span>}
        </Link>
        <button
          className={styles.collapseButton}
          onClick={toggleSidebar}
          title={isCollapsed ? "확장" : "축소"}
        >
          {isCollapsed ? <FiChevronRightIcon /> : <FiChevronLeft />}
        </button>
      </div>

      {!isCollapsed && (
        <div className={styles.profileContainer}>
          <div className={styles.profileImage}>
            <img
              src="/admin-avatar.png"
              alt="Admin"
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/150";
              }}
            />
          </div>
          <div className={styles.profileInfo}>
            <div className={styles.adminName}>관리자</div>
            <div className={styles.adminRole}>시스템 관리자</div>
          </div>
        </div>
      )}

      <nav className={styles.navigation}>
        <ul className={styles.menuList}>
          {menuItems.map((item) => (
            <li
              key={item.id}
              className={`${styles.menuItem} ${
                isActive(item.link || "") ? styles.active : ""
              }`}
            >
              {item.submenus ? (
                <div
                  ref={(el) => (menuRefs.current[item.id] = el)}
                  className={styles.submenuContainer}
                >
                  <div
                    className={`${styles.menuHeader} ${
                      expandedMenus.includes(item.id) ? styles.expanded : ""
                    } ${activeSubmenu === item.id ? styles.activeSubmenu : ""}`}
                    onClick={(e) => toggleMenu(item.id, e)}
                  >
                    <div className={styles.menuIconAndTitle}>
                      <span className={styles.menuIcon}>{item.icon}</span>
                      {!isCollapsed && (
                        <span className={styles.menuTitle}>{item.title}</span>
                      )}
                    </div>
                    {isCollapsed ? (
                      <span
                        className={styles.collapsedExpandIcon}
                        onClick={(e) => toggleSubmenu(item.id, item, e)}
                      >
                        <FiChevronRightIcon />
                      </span>
                    ) : (
                      <span className={styles.expandIcon}>
                        {expandedMenus.includes(item.id) ? (
                          <FiChevronDown />
                        ) : (
                          <FiChevronRight />
                        )}
                      </span>
                    )}
                  </div>

                  {/* 확장 모드에서의 하위 메뉴 표시 */}
                  {!isCollapsed && expandedMenus.includes(item.id) && (
                    <ul className={styles.submenuList}>
                      {item.submenus.map((submenu) => (
                        <li key={submenu.id} className={styles.submenuItem}>
                          <Link
                            to={submenu.link}
                            className={`${styles.submenuLink} ${
                              isActive(submenu.link) ? styles.active : ""
                            }`}
                          >
                            {submenu.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  to={item.link || "#"}
                  className={`${styles.menuLink} ${
                    isActive(item.link || "") ? styles.active : ""
                  }`}
                >
                  <span className={styles.menuIcon}>{item.icon}</span>
                  {!isCollapsed && (
                    <span className={styles.menuTitle}>{item.title}</span>
                  )}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
