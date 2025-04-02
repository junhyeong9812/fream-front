import React, { useContext } from "react";
import { Link } from "react-router-dom";
import styles from "./AdminFooter.module.css";
import { ThemeContext } from "src/global/context/ThemeContext";

const AdminFooter: React.FC = () => {
  const { theme } = useContext(ThemeContext);
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`${styles.adminFooter} ${theme === "dark" ? styles.dark : ""}`}
    >
      <div className={styles.footerContent}>
        <div className={styles.footerLinks}>
          <Link to="/info">회사소개</Link>
          <Link to="/recruit">인재채용</Link>
          <Link to="/proposal">제휴제안</Link>
          <Link to="/terms">이용약관</Link>
          <Link to="/privacy">개인정보처리방침</Link>
          <Link to="/service-security">서비스 가입 사실 확인</Link>
        </div>

        <div className={styles.companyInfo}>
          <p>
            크림 주식회사 · 대표 000 | 사업자등록번호: 000-00-00000{" "}
            <a href="/business-info">사업자정보확인</a>
          </p>
          <p>
            통신판매업: 제 2021-00000호 | 사업장소재지: 000시 00구 00동 00길 00
          </p>
        </div>

        <div className={styles.copyright}>
          © {currentYear} Fream Admin. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;
