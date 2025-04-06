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
import { adminLogout } from "src/features/admin/services/adminAuthService";

const AdminHeader: React.FC = () => {
  const navigate = useNavigate();
  const { isAdminLoggedIn, setIsAdminLoggedIn } = useAdminAuth(); // setIsAdminLoggedIn을 가져옴
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleLogout = async () => {
    try {
      // adminAuthService에서 가져온 adminLogout 함수 사용
      const result = await adminLogout();

      if (result) {
        // 로그아웃 성공 시 상태 업데이트
        setIsAdminLoggedIn(false);
        alert("관리자 로그아웃되었습니다.");
        navigate("/admin/login");
      } else {
        // 서버 요청은 실패했지만, 로컬의 로그인 상태는 제거됨
        // (adminLogout 함수 내부에서 localStorage 항목 제거)
        setIsAdminLoggedIn(false);
        alert(
          "로그아웃 처리 중 서버 오류가 발생했습니다. 다시 로그인해주세요."
        );
        navigate("/admin/login");
      }
    } catch (error) {
      console.error("로그아웃 오류:", error);
      // 오류 발생 시 사용자에게 알림
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
