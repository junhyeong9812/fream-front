import React from "react";
import { FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import { EventListDto, EventStatus } from "../types/eventTypes";
import styles from "./EventList.module.css";

interface EventListProps {
  events: EventListDto[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onViewEvent: (event: EventListDto) => void;
  onEditEvent: (event: EventListDto) => void;
  onDeleteEvent: (eventId: number) => void;
  theme: string;
}

const EventList: React.FC<EventListProps> = ({
  events,
  currentPage,
  totalPages,
  onPageChange,
  onViewEvent,
  onEditEvent,
  onDeleteEvent,
  theme,
}) => {
  // 날짜 포맷 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // 이벤트 상태에 따른 클래스 결정
  const getStatusClassName = (status: EventStatus) => {
    switch (status) {
      case EventStatus.UPCOMING:
        return `${styles.eventStatus} ${styles.statusUpcoming}`;
      case EventStatus.ACTIVE:
        return `${styles.eventStatus} ${styles.statusActive}`;
      case EventStatus.ENDED:
        return `${styles.eventStatus} ${styles.statusInactive}`;
      default:
        return styles.eventStatus;
    }
  };

  // 페이지네이션 버튼 생성
  const renderPagination = () => {
    const pageNumbers = [];
    const maxPageButtons = 5;
    const halfMaxButtons = Math.floor(maxPageButtons / 2);

    let startPage = Math.max(currentPage - halfMaxButtons, 0);
    let endPage = Math.min(startPage + maxPageButtons - 1, totalPages - 1);

    if (endPage - startPage < maxPageButtons - 1) {
      startPage = Math.max(endPage - maxPageButtons + 1, 0);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`${styles.paginationButton} ${
            i === currentPage ? styles.active : ""
          }`}
          onClick={() => onPageChange(i)}
        >
          {i + 1}
        </button>
      );
    }

    return (
      <div className={styles.paginationContainer}>
        <button
          className={styles.paginationButton}
          onClick={() => onPageChange(0)}
          disabled={currentPage === 0}
        >
          &laquo;
        </button>
        <button
          className={styles.paginationButton}
          onClick={() => onPageChange(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
        >
          &lsaquo;
        </button>
        {pageNumbers}
        <button
          className={styles.paginationButton}
          onClick={() =>
            onPageChange(Math.min(totalPages - 1, currentPage + 1))
          }
          disabled={currentPage === totalPages - 1}
        >
          &rsaquo;
        </button>
        <button
          className={styles.paginationButton}
          onClick={() => onPageChange(totalPages - 1)}
          disabled={currentPage === totalPages - 1}
        >
          &raquo;
        </button>
      </div>
    );
  };

  // 이벤트가 없는 경우
  if (events.length === 0) {
    return (
      <div
        className={`${styles.eventListContainer} ${
          theme === "dark" ? styles.dark : ""
        }`}
      >
        <div className={styles.noEvents}>
          등록된 이벤트가 없습니다. 새 이벤트를 등록해주세요.
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={`${styles.eventListContainer} ${
          theme === "dark" ? styles.dark : ""
        }`}
      >
        <table className={styles.eventTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>이미지</th>
              <th>제목</th>
              <th>브랜드</th>
              <th>기간</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td className={styles.eventId}>{event.id}</td>
                <td>
                  <img
                    src={event.thumbnailUrl || "/api/placeholder/80/45"}
                    alt={event.title}
                    className={styles.eventThumbnail}
                  />
                </td>
                <td className={styles.eventTitle}>{event.title}</td>
                <td className={styles.eventBrand}>{event.brandName}</td>
                <td className={styles.eventDate}>
                  {formatDate(event.startDate)} ~ {formatDate(event.endDate)}
                </td>
                <td>
                  <span className={getStatusClassName(event.status)}>
                    {event.statusDisplayName}
                  </span>
                </td>
                <td className={styles.actionCell}>
                  <button
                    className={`${styles.actionButton} ${styles.viewButton}`}
                    onClick={() => onViewEvent(event)}
                    title="상세보기"
                  >
                    <FiEye />
                  </button>
                  <button
                    className={`${styles.actionButton} ${styles.editButton}`}
                    onClick={() => onEditEvent(event)}
                    title="수정하기"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    onClick={() => onDeleteEvent(event.id)}
                    title="삭제하기"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {totalPages > 1 && renderPagination()}
      </div>
    </>
  );
};

export default EventList;
