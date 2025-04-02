import React, { useContext } from "react";
import styles from "./AdminPage.module.css";
import {
  FiUsers,
  FiShoppingBag,
  FiDollarSign,
  FiShoppingCart,
} from "react-icons/fi";
import { ThemeContext } from "src/global/context/ThemeContext";

const AdminPage: React.FC = () => {
  const { theme } = useContext(ThemeContext);

  // 더미 데이터 - 실제로는 API에서 가져오는 값으로 대체
  const recentOrders = [
    {
      id: "ORD-2025-00123",
      customer: "김철수",
      product: "Nike Air Max",
      date: "2025-04-02",
      amount: 189000,
      status: "결제완료",
    },
    {
      id: "ORD-2025-00122",
      customer: "이영희",
      product: "Adidas Ultra Boost",
      date: "2025-04-02",
      amount: 210000,
      status: "배송중",
    },
    {
      id: "ORD-2025-00121",
      customer: "박지민",
      product: "New Balance 990",
      date: "2025-04-01",
      amount: 178000,
      status: "배송완료",
    },
    {
      id: "ORD-2025-00120",
      customer: "최준호",
      product: "Jordan 1 Retro",
      date: "2025-04-01",
      amount: 320000,
      status: "결제완료",
    },
  ];

  return (
    <div className={`${theme === "dark" ? styles.dark : ""}`}>
      <h2 className={styles.pageTitle}>대시보드</h2>

      <div className={styles.dashboardContainer}>
        <div className={styles.dashboardCard}>
          <h4 className={styles.cardTitle}>
            <FiDollarSign style={{ marginRight: "8px" }} /> 총 판매액
          </h4>
          <div className={styles.cardValue}>₩12,345,678</div>
        </div>

        <div className={styles.dashboardCard}>
          <h4 className={styles.cardTitle}>
            <FiUsers style={{ marginRight: "8px" }} /> 총 사용자 수
          </h4>
          <div className={styles.cardValue}>5,432</div>
        </div>

        <div className={styles.dashboardCard}>
          <h4 className={styles.cardTitle}>
            <FiShoppingBag style={{ marginRight: "8px" }} /> 총 상품 수
          </h4>
          <div className={styles.cardValue}>1,234</div>
        </div>

        <div className={styles.dashboardCard}>
          <h4 className={styles.cardTitle}>
            <FiShoppingCart style={{ marginRight: "8px" }} /> 총 주문 수
          </h4>
          <div className={styles.cardValue}>4,321</div>
        </div>
      </div>

      <div className={styles.analyticsSection}>
        <h3 className={styles.sectionTitle}>최근 주문</h3>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>주문 번호</th>
                <th>고객명</th>
                <th>상품명</th>
                <th>주문일</th>
                <th>금액</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.product}</td>
                  <td>{order.date}</td>
                  <td>{order.amount.toLocaleString()}원</td>
                  <td>{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
