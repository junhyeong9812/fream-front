import React from "react";
import { FiEye, FiUser } from "react-icons/fi";
import { UserSearchResponseDto } from "../types/userManagementTypes";
import styles from "./UserList.module.css";

interface UserListProps {
  users: UserSearchResponseDto[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onViewUser: (user: UserSearchResponseDto) => void;
  theme: string;
}

const UserList: React.FC<UserListProps> = ({
  users,
  currentPage,
  totalPages,
  onPageChange,
  onViewUser,
  theme,
}) => {
  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // 페이지네이션 렌더링
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    // 현재 페이지 그룹 계산 (5개씩 그룹화)
    const currentGroup = Math.floor(currentPage / 5);
    const startPage = currentGroup * 5;
    const endPage = Math.min(startPage + 4, totalPages - 1);

    const pageNumbers = [];

    // 이전 그룹 버튼
    if (currentGroup > 0) {
      pageNumbers.push(
        <button
          key="prev-group"
          onClick={() => onPageChange(startPage - 1)}
          className={styles.pageButton}
        >
          &lt;&lt;
        </button>
      );
    }

    // 이전 페이지 버튼
    if (currentPage > 0) {
      pageNumbers.push(
        <button
          key="prev-page"
          onClick={() => onPageChange(currentPage - 1)}
          className={styles.pageButton}
        >
          &lt;
        </button>
      );
    }

    // 페이지 번호 버튼
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`${styles.pageButton} ${
            currentPage === i ? styles.activePage : ""
          }`}
        >
          {i + 1}
        </button>
      );
    }

    // 다음 페이지 버튼
    if (currentPage < totalPages - 1) {
      pageNumbers.push(
        <button
          key="next-page"
          onClick={() => onPageChange(currentPage + 1)}
          className={styles.pageButton}
        >
          &gt;
        </button>
      );
    }

    // 다음 그룹 버튼
    if (endPage < totalPages - 1) {
      pageNumbers.push(
        <button
          key="next-group"
          onClick={() => onPageChange(endPage + 1)}
          className={styles.pageButton}
        >
          &gt;&gt;
        </button>
      );
    }

    return <div className={styles.pagination}>{pageNumbers}</div>;
  };

  return (
    <div
      className={`${styles.userListContainer} ${
        theme === "dark" ? styles.dark : ""
      }`}
    >
      <table className={styles.userTable}>
        <thead>
          <tr>
            <th className={styles.idColumn}>ID</th>
            <th className={styles.emailColumn}>이메일</th>
            <th className={styles.profileColumn}>프로필</th>
            <th className={styles.phoneColumn}>전화번호</th>
            <th className={styles.statusColumn}>상태</th>
            <th className={styles.registeredColumn}>가입일</th>
            <th className={styles.actionsColumn}>관리</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td className={styles.idColumn}>{user.id}</td>
                <td className={styles.emailColumn}>
                  {user.email}
                  {user.role === "ADMIN" && (
                    <span className={styles.adminBadge}>관리자</span>
                  )}
                </td>
                <td className={styles.profileColumn}>
                  <div className={styles.profileInfo}>
                    {user.profileImageUrl ? (
                      <img
                        src={user.profileImageUrl}
                        alt={user.profileName || "프로필"}
                        className={styles.profileImage}
                      />
                    ) : (
                      <div className={styles.profileImagePlaceholder}>
                        <FiUser />
                      </div>
                    )}
                    <span>{user.profileName || "-"}</span>
                  </div>
                </td>
                <td className={styles.phoneColumn}>
                  {user.phoneNumber}
                  {!user.isVerified && (
                    <span className={styles.unverifiedBadge}>미인증</span>
                  )}
                </td>
                <td className={styles.statusColumn}>
                  <span
                    className={`${styles.statusBadge} ${
                      user.isActive ? styles.activeBadge : styles.inactiveBadge
                    }`}
                  >
                    {user.isActive ? "활성" : "비활성"}
                  </span>
                </td>
                <td className={styles.registeredColumn}>
                  {formatDate(user.createdDate)}
                </td>
                <td className={styles.actionsColumn}>
                  <button
                    className={styles.viewButton}
                    onClick={() => onViewUser(user)}
                    title="상세 보기"
                  >
                    <FiEye />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className={styles.noData}>
                검색 결과가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className={styles.paginationContainer}>{renderPagination()}</div>
      )}
    </div>
  );
};

export default UserList;
