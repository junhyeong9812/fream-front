import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiFilter, FiDownload } from "react-icons/fi";
import { useTheme } from "../../../global/context/ThemeContext";
import { UserService } from "../services/userManagementService";
import {
  UserSearchDto,
  UserSearchResponseDto,
  SortOption,
} from "../types/userManagementTypes";
import UserSearchBar from "../components/UserSearchBar";
import UserFilter from "../components/UserFilter";
import UserSort from "../components/UserSort";
import UserList from "../components/UserList";
import LoadingSpinner from "../../../global/components/common/LoadingSpinner";
import ErrorMessage from "../../../global/components/common/ErrorMessage";
import styles from "./UserManagementPage.module.css";

const UserManagementPage: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  // State management
  const [users, setUsers] = useState<UserSearchResponseDto[]>([]);
  const [selectedUser, setSelectedUser] =
    useState<UserSearchResponseDto | null>(null);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [currentFilter, setCurrentFilter] = useState<UserSearchDto>({});
  const [currentSort, setCurrentSort] = useState<SortOption>({
    field: "createdDate",
    order: "desc",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showFilter, setShowFilter] = useState<boolean>(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  const pageSize = 20;

  // Load initial user data
  useEffect(() => {
    loadUsers();
  }, [currentPage, currentSort]);

  // Load users function
  const loadUsers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Configure search request
      const searchRequest: UserSearchDto = {
        ...currentFilter,
        keyword: searchKeyword,
        sortOption: currentSort,
      };

      // Call API
      const response = await UserService.searchUsers(
        searchRequest,
        currentPage,
        pageSize
      );

      // Process results
      setUsers(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (err) {
      console.error("Failed to load users:", err);
      setError("An error occurred while loading users.");
    } finally {
      setIsLoading(false);
    }
  };

  // Search handler
  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    setCurrentPage(0); // Reset to first page on search

    // Execute search
    const searchRequest: UserSearchDto = {
      ...currentFilter,
      keyword,
      sortOption: currentSort,
    };

    setIsLoading(true);
    setError(null);

    UserService.searchUsers(searchRequest, 0, pageSize)
      .then((response) => {
        setUsers(response.content);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
      })
      .catch((err) => {
        console.error("User search failed:", err);
        setError("An error occurred while searching for users.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Apply filter handler
  const handleApplyFilter = (filter: UserSearchDto) => {
    setCurrentFilter(filter);
    setCurrentPage(0); // Reset to first page on filter change
    setShowFilter(false); // Hide filter panel after applying

    // Apply search with filter
    const searchRequest: UserSearchDto = {
      ...filter,
      keyword: searchKeyword,
      sortOption: currentSort,
    };

    setIsLoading(true);
    setError(null);

    UserService.searchUsers(searchRequest, 0, pageSize)
      .then((response) => {
        setUsers(response.content);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
      })
      .catch((err) => {
        console.error("User filtering failed:", err);
        setError("An error occurred while filtering users.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Sort change handler
  const handleSortChange = (sortOption: SortOption) => {
    setCurrentSort(sortOption);
    // Page is maintained, loadUsers is called in useEffect
  };

  // Page change handler
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // loadUsers is called in useEffect
  };

  // View user details
  const handleViewUser = (user: UserSearchResponseDto) => {
    setSelectedUser(user);
    navigate(`/admin/users/detail/${user.id}`);
  };

  // Export users as CSV
  const handleExportUsers = () => {
    UserService.exportUsers(currentFilter)
      .then((csvData) => {
        // Create a blob and download link
        const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "users_export.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((err) => {
        console.error("Export failed:", err);
        setError("Failed to export user data.");
      });
  };

  return (
    <div
      className={`${styles.userManagement} ${
        theme === "dark" ? styles.dark : ""
      }`}
    >
      <h1 className={styles.pageTitle}>회원 관리</h1>

      {/* User statistics summary */}
      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>전체 회원 수</div>
          <div className={styles.statValue}>
            {totalElements.toLocaleString()}
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>신규 회원 (30일)</div>
          <div className={styles.statValue}>
            {/* This would come from the API */}
            {
              users.filter(
                (user) =>
                  new Date(user.createdDate).getTime() >
                  Date.now() - 30 * 24 * 60 * 60 * 1000
              ).length
            }
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>활성 회원</div>
          <div className={styles.statValue}>
            {/* This would come from the API */}
            {users.filter((user) => user.isActive).length}
          </div>
        </div>
      </div>

      {/* Search and actions area */}
      <div className={styles.topControls}>
        <UserSearchBar onSearch={handleSearch} theme={theme} />

        <div className={styles.actionButtons}>
          <button
            className={styles.filterButton}
            onClick={() => setShowFilter(!showFilter)}
          >
            <FiFilter /> 필터
          </button>
          <button className={styles.exportButton} onClick={handleExportUsers}>
            <FiDownload /> 내보내기
          </button>
        </div>
      </div>

      {/* Filter area - conditionally rendered */}
      {showFilter && (
        <UserFilter onApplyFilter={handleApplyFilter} theme={theme} />
      )}

      {/* Sort area */}
      <UserSort
        onSort={handleSortChange}
        currentSort={currentSort}
        theme={theme}
      />

      {/* User list area */}
      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <UserList
          users={users}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onViewUser={handleViewUser}
          theme={theme}
        />
      )}
    </div>
  );
};

export default UserManagementPage;
