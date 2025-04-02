import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiBell,
  FiMail,
  FiMoon,
  FiSun,
  FiLogIn,
  FiLogOut,
} from "react-icons/fi";
import { useAdminAuth } from "src/global/context/AdminAuthContext";
import styles from "./AdminHeader.module.css";
import { ThemeContext } from "src/global/context/ThemeContext";

const AdminHeader: React.FC = () => {
  const navigate = useNavigate();
  const { isAdminLoggedIn, setIsAdminLoggedIn } = useAdminAuth();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleLogout = async () => {
    try {
      // 실제 로그아웃 처리 로직 (API 호출 등)
      // ...

      // 로그아웃 후 상태 업데이트 및 리디렉션
      localStorage.removeItem("AdminLoggedIn");
      setIsAdminLoggedIn(false);
      alert("관리자 로그아웃되었습니다.");
      navigate("/admin/login");
    } catch (error) {
      console.error("로그아웃 오류:", error);
      alert("로그아웃 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <header
      className={`${styles.adminHeader} ${theme === "dark" ? styles.dark : ""}`}
    >
      <div className={styles.headerContent}>
        <div className={styles.rightControls}>
          <button className={styles.iconButton} title="알림">
            <FiBell />
            <span className={styles.notificationBadge}></span>
          </button>
          <button className={styles.iconButton} title="메시지">
            <FiMail />
          </button>
          <button
            className={styles.iconButton}
            onClick={toggleTheme}
            title={theme === "light" ? "다크모드로 전환" : "라이트모드로 전환"}
          >
            {theme === "light" ? <FiMoon /> : <FiSun />}
          </button>
          {isAdminLoggedIn ? (
            <button
              className={styles.iconButton}
              onClick={handleLogout}
              title="로그아웃"
            >
              <FiLogOut />
            </button>
          ) : (
            <button
              className={styles.iconButton}
              onClick={() => navigate("/admin/login")}
              title="로그인"
            >
              <FiLogIn />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
