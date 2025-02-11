import React, { useState, useMemo } from "react";
import { Home, Bell, X } from "lucide-react";
import {
  NotificationDTO,
  NotificationCategory,
  NotificationType,
} from "../../../types/notification";
import "./NotificationModal.css";

interface NotificationModalProps {
  closeModal: () => void;
  notifications: NotificationDTO[];
  onNotificationClick: (id: number) => void;
}

const NoData: React.FC<{ tab: NotificationCategory }> = ({ tab }) => (
  <div className="no-data-container">
    <Bell />
    <p>{tab === NotificationCategory.SHOP ? "쇼핑 알림" : "스타일 알림"}</p>
    <p>
      {tab === NotificationCategory.SHOP
        ? "쇼핑에 대한 알림은 여기에 표시됩니다."
        : "스타일에 대한 알림은 여기에 표시됩니다."}
    </p>
  </div>
);

const NotificationModal: React.FC<NotificationModalProps> = ({
  closeModal,
  notifications,
  onNotificationClick,
}) => {
  const [activeTab, setActiveTab] = useState<NotificationCategory>(
    NotificationCategory.SHOP
  );
  const [activeFilter, setActiveFilter] = useState<NotificationType | "전체">(
    "전체"
  );

  const notificationFilters: Array<NotificationType | "전체"> = [
    "전체",
    NotificationType.TRADE,
    NotificationType.BID,
    NotificationType.STORAGE,
    NotificationType.INTEREST,
    NotificationType.BENEFIT,
    NotificationType.OTHER,
  ];

  const filteredNotifications = useMemo(() => {
    return notifications.filter(
      (notification) =>
        activeTab === notification.category &&
        (activeFilter === "전체" || notification.type === activeFilter)
    );
  }, [notifications, activeTab, activeFilter]);

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* 헤더 영역 */}
        <div className="modal-header">
          <button onClick={closeModal}>✖</button>
          <span>알림</span>
          <button onClick={closeModal}>
            <Home />
          </button>
        </div>

        {/* 탭 영역 */}
        <div className="modal-nav">
          {Object.values(NotificationCategory).map((category) => (
            <button
              key={category}
              className={activeTab === category ? "active" : ""}
              onClick={() => setActiveTab(category)}
            >
              {category === NotificationCategory.SHOP ? "쇼핑" : "스타일"}
            </button>
          ))}
        </div>

        {/* SHOP 탭에서만 필터 버튼 */}
        {activeTab === NotificationCategory.SHOP && (
          <div className="filter-buttons">
            {notificationFilters.map((filter) => (
              <button key={filter} onClick={() => setActiveFilter(filter)}>
                {filter}
              </button>
            ))}
          </div>
        )}

        <div className="notification-settings">
          알림 설정 및 삭제는 앱에서 가능합니다.
        </div>

        {/* 알림 리스트 or 데이터 없음 */}
        {filteredNotifications.length > 0 ? (
          <div className="notification-section">
            <h4>지난 알림</h4>
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-item ${
                  !notification.isRead ? "unread" : ""
                }`}
                onClick={() => onNotificationClick(notification.id)}
              >
                <Bell />
                <div>
                  <p>{notification.message}</p>
                  <span>
                    {new Date(notification.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <NoData tab={activeTab} />
        )}
      </div>
    </div>
  );
};

export default NotificationModal;
// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { FiHome, FiBell } from "react-icons/fi";
// import "./NotificationModal.css";

// interface NotificationModalProps {
//   closeModal: () => void;
// }

// const NoData: React.FC<{ tab: string }> = ({ tab }) => (
//   <div className="no-data-container">
//     <FiBell />
//     <p>{tab === "SHOP" ? "쇼핑 알림" : "스타일 알림"}</p>
//     <p>
//       {tab === "SHOP"
//         ? "쇼핑에 대한 알림은 여기에 표시됩니다."
//         : "스타일에 대한 알림은 여기에 표시됩니다."}
//     </p>
//   </div>
// );

// const NotificationModal: React.FC<NotificationModalProps> = ({
//   closeModal,
// }) => {
//   const [activeTab, setActiveTab] = useState("SHOP");
//   const notifications =
//     activeTab === "SHOP"
//       ? [
//           { id: 1, message: "로그인 보안 알림", time: "10시간 전" },
//           { id: 2, message: "상품이 추가되었습니다.", time: "2024년 6월 14일" },
//         ]
//       : []; // 스타일 탭은 예시로 빈 배열

//   return (
//     <div className="modal-overlay">
//       <div className="modal-container">
//         {/* 헤더 영역 */}
//         <div className="modal-header">
//           <button onClick={closeModal}>✖</button>
//           <span>알림</span>
//           <Link to="/">
//             <FiHome />
//           </Link>
//         </div>

//         {/* 탭 영역 */}
//         <div className="modal-nav">
//           <button
//             className={activeTab === "SHOP" ? "active" : ""}
//             onClick={() => setActiveTab("SHOP")}
//           >
//             쇼핑
//           </button>
//           <button
//             className={activeTab === "STYLE" ? "active" : ""}
//             onClick={() => setActiveTab("STYLE")}
//           >
//             스타일
//           </button>
//         </div>

//         {/* SHOP 탭에서만 필터 버튼 */}
//         {activeTab === "SHOP" && (
//           <div className="filter-buttons">
//             {[
//               "전체",
//               "거래",
//               "입찰",
//               "보관판매",
//               "관심/발매",
//               "혜택",
//               "기타",
//             ].map((filter) => (
//               <button key={filter}>{filter}</button>
//             ))}
//           </div>
//         )}

//         <div className="notification-settings">
//           알림 설정 및 삭제는 앱에서 가능합니다.
//         </div>

//         {/* 알림 리스트 or 데이터 없음 */}
//         {notifications.length > 0 ? (
//           <div className="notification-section">
//             <h4>지난 알림</h4>
//             {notifications.map((notification) => (
//               <div className="notification-item" key={notification.id}>
//                 <FiBell />
//                 <div>
//                   <p>{notification.message}</p>
//                   <span>{notification.time}</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <NoData tab={activeTab} />
//         )}
//       </div>
//     </div>
//   );
// };

// export default NotificationModal;
