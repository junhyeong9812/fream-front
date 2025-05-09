import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiCalendar } from "react-icons/fi";
import { useTheme } from "../../../global/context/ThemeContext";
import { EventService } from "../services/eventService";
import {
  EventSearchDto,
  EventListDto,
  SortOption,
  EventStatus,
} from "../types/eventTypes";
import EventSearchBar from "../components/EventSearchBar";
import EventFilter from "../components/EventFilter";
import EventSort from "../components/EventSort";
import EventList from "../components/EventList";
import LoadingSpinner from "../../../global/components/common/LoadingSpinner";
import ErrorMessage from "../../../global/components/common/ErrorMessage";
import styles from "./EventManagementPage.module.css";

const EventManagementPage: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  // 상태 관리
  const [events, setEvents] = useState<EventListDto[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [currentFilter, setCurrentFilter] = useState<EventSearchDto>({});
  const [currentSort, setCurrentSort] = useState<SortOption>({
    field: "id",
    order: "desc",
  });
  const [isLoading, setIsLoading] = useState<boolean>(true); // 처음 로딩 시 true로 설정
  const [error, setError] = useState<string | null>(null);

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  const pageSize = 10;

  // 상태별 이벤트 수 통계 - 기본값을 0으로 초기화
  const [statusStats, setStatusStats] = useState<{
    upcoming: number;
    active: number;
    ended: number;
  }>({
    upcoming: 0,
    active: 0,
    ended: 0,
  });

  // 초기 이벤트 데이터 로드
  useEffect(() => {
    loadEvents();
  }, [currentPage, currentSort]);

  // 상태별 이벤트 수 로드
  useEffect(() => {
    loadStatusStats();
  }, []);

  // 상태별 이벤트 수 로드 함수
  const loadStatusStats = async () => {
    try {
      // 각 상태별로 별도 API 호출 (페이지 크기 1로 하여 총 개수만 가져옴)
      const upcomingResponse = await EventService.getEventsByStatus(
        EventStatus.UPCOMING,
        0,
        1
      );
      const activeResponse = await EventService.getEventsByStatus(
        EventStatus.ACTIVE,
        0,
        1
      );
      const endedResponse = await EventService.getEventsByStatus(
        EventStatus.ENDED,
        0,
        1
      );

      setStatusStats({
        upcoming: upcomingResponse.totalElements || 0,
        active: activeResponse.totalElements || 0,
        ended: endedResponse.totalElements || 0,
      });
    } catch (err) {
      console.error("상태별 이벤트 통계 로드 실패:", err);
      // 오류 발생 시 기본값(0)을 유지
    }
  };

  // 이벤트 로드 함수
  const loadEvents = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 검색 요청 구성
      const searchRequest: EventSearchDto = {
        ...currentFilter,
        keyword: searchKeyword,
        sortOption: currentSort,
      };

      // 이벤트 검색 API 호출
      const response = await EventService.searchEvents(
        searchRequest,
        currentPage,
        pageSize
      );

      // 결과 처리
      setEvents(response.content || []);
      setTotalPages(response.totalPages || 0);
      setTotalElements(response.totalElements || 0);
    } catch (err) {
      console.error("이벤트 로드 실패:", err);
      setError("이벤트를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 검색 핸들러
  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    setCurrentPage(0); // 검색 시 첫 페이지로 리셋

    // 검색어가 변경되면 검색 실행
    const searchRequest: EventSearchDto = {
      ...currentFilter,
      keyword,
      sortOption: currentSort,
    };

    setIsLoading(true);
    setError(null);

    EventService.searchEvents(searchRequest, 0, pageSize)
      .then((response) => {
        setEvents(response.content || []);
        setTotalPages(response.totalPages || 0);
        setTotalElements(response.totalElements || 0);
      })
      .catch((err) => {
        console.error("이벤트 검색 실패:", err);
        setError("이벤트 검색 중 오류가 발생했습니다.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // 필터 적용 핸들러
  const handleApplyFilter = (filter: EventSearchDto) => {
    setCurrentFilter(filter);
    setCurrentPage(0); // 필터 변경 시 첫 페이지로 리셋

    // 필터 적용하여 검색
    const searchRequest: EventSearchDto = {
      ...filter,
      keyword: searchKeyword,
      sortOption: currentSort,
    };

    setIsLoading(true);
    setError(null);

    EventService.searchEvents(searchRequest, 0, pageSize)
      .then((response) => {
        setEvents(response.content || []);
        setTotalPages(response.totalPages || 0);
        setTotalElements(response.totalElements || 0);
      })
      .catch((err) => {
        console.error("이벤트 필터링 실패:", err);
        setError("이벤트 필터링 중 오류가 발생했습니다.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // 정렬 변경 핸들러
  const handleSortChange = (sortOption: SortOption) => {
    setCurrentSort(sortOption);
    // 정렬 변경 시 페이지는 유지 (useEffect에서 loadEvents 호출)
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // 페이지 변경 시 useEffect에서 loadEvents 호출
  };

  // 이벤트 상세 보기
  const handleViewEvent = (event: EventListDto) => {
    navigate(`/admin/events/detail/${event.id}`);
  };

  // 이벤트 수정 페이지로 이동
  const handleEditEvent = (event: EventListDto) => {
    navigate(`/admin/events/edit/${event.id}`);
  };

  // 이벤트 삭제 핸들러
  const handleDeleteEvent = async (eventId: number) => {
    if (
      !window.confirm(
        "정말로 이 이벤트를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      await EventService.deleteEvent(eventId);
      alert("이벤트가 성공적으로 삭제되었습니다.");
      loadEvents(); // 목록 다시 로드
      loadStatusStats(); // 통계 다시 로드
    } catch (err) {
      console.error("이벤트 삭제 실패:", err);
      alert("이벤트 삭제 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 이벤트 등록 페이지로 이동
  const handleCreateEvent = () => {
    navigate("/admin/events/add");
  };

  // 상태별 이벤트 조회
  const handleStatusClick = (status: EventStatus) => {
    // 필터 설정
    const newFilter: EventSearchDto = {
      ...currentFilter,
      status: status,
    };
    handleApplyFilter(newFilter);
  };

  // 빈 상태 UI 렌더링
  const renderEmptyState = () => {
    return (
      <div className={styles.emptyStateContainer}>
        <div className={styles.emptyStateIcon}>
          <FiCalendar size={64} />
        </div>
        <h2 className={styles.emptyStateTitle}>등록된 이벤트가 없습니다</h2>
        <p className={styles.emptyStateDescription}>
          첫 번째 이벤트를 등록하여 시작해보세요!
        </p>
        <button className={styles.emptyStateButton} onClick={handleCreateEvent}>
          <FiPlus /> 이벤트 등록하기
        </button>
      </div>
    );
  };

  return (
    <div
      className={`${styles.eventManagement} ${
        theme === "dark" ? styles.dark : ""
      }`}
    >
      <h1 className={styles.pageTitle}>이벤트 관리</h1>

      {/* 이벤트 통계 요약 */}
      <div className={styles.statsContainer}>
        <div
          className={`${styles.statCard} ${
            theme === "dark" ? styles.dark : ""
          }`}
        >
          <div className={styles.statTitle}>전체 이벤트 수</div>
          <div className={styles.statValue}>
            {(totalElements || 0).toLocaleString()}
          </div>
        </div>

        {/* 상태별 이벤트 수 통계 */}
        <div
          className={`${styles.statCard} ${styles.statusStat} ${
            styles.upcomingStat
          } ${theme === "dark" ? styles.dark : ""}`}
          onClick={() => handleStatusClick(EventStatus.UPCOMING)}
        >
          <div className={styles.statTitle}>예정 이벤트</div>
          <div className={styles.statValue}>
            {(statusStats.upcoming || 0).toLocaleString()}
          </div>
        </div>

        <div
          className={`${styles.statCard} ${styles.statusStat} ${
            styles.activeStat
          } ${theme === "dark" ? styles.dark : ""}`}
          onClick={() => handleStatusClick(EventStatus.ACTIVE)}
        >
          <div className={styles.statTitle}>진행 중인 이벤트</div>
          <div className={styles.statValue}>
            {(statusStats.active || 0).toLocaleString()}
          </div>
        </div>

        <div
          className={`${styles.statCard} ${styles.statusStat} ${
            styles.endedStat
          } ${theme === "dark" ? styles.dark : ""}`}
          onClick={() => handleStatusClick(EventStatus.ENDED)}
        >
          <div className={styles.statTitle}>종료된 이벤트</div>
          <div className={styles.statValue}>
            {(statusStats.ended || 0).toLocaleString()}
          </div>
        </div>
      </div>

      {/* 검색 및 버튼 영역 */}
      <div className={styles.topControls}>
        <EventSearchBar onSearch={handleSearch} theme={theme} />

        <div className={styles.actionButtons}>
          <button className={styles.createButton} onClick={handleCreateEvent}>
            <FiPlus /> 이벤트 등록
          </button>
        </div>
      </div>

      {/* 필터 영역 */}
      <EventFilter onApplyFilter={handleApplyFilter} theme={theme} />

      {/* 정렬 영역 - 이벤트가 있을 때만 표시 */}
      {!isLoading && !error && totalElements > 0 && (
        <EventSort
          onSort={handleSortChange}
          currentSort={currentSort}
          totalElements={totalElements || 0}
          theme={theme}
        />
      )}

      {/* 이벤트 목록 영역 */}
      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : totalElements > 0 ? (
        <EventList
          events={events}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onViewEvent={handleViewEvent}
          onEditEvent={handleEditEvent}
          onDeleteEvent={handleDeleteEvent}
          theme={theme}
        />
      ) : (
        // 이벤트가 없을 때 빈 상태 UI 표시
        renderEmptyState()
      )}
    </div>
  );
};

export default EventManagementPage;
