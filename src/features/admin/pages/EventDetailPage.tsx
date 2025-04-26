import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiEdit2, FiTrash2, FiRefreshCw } from "react-icons/fi";
import { useTheme } from "../../../global/context/ThemeContext";
import { EventService } from "../services/eventService";
import { EventDetailDto, EventStatus } from "../types/eventTypes";
import LoadingSpinner from "../../../global/components/common/LoadingSpinner";
import ErrorMessage from "../../../global/components/common/ErrorMessage";
import styles from "./EventDetailPage.module.css";

const EventDetailPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [eventDetail, setEventDetail] = useState<EventDetailDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusUpdateLoading, setStatusUpdateLoading] =
    useState<boolean>(false);

  // 이벤트 상세 정보 조회
  useEffect(() => {
    const fetchEventDetail = async () => {
      if (!eventId) return;

      setIsLoading(true);
      setError(null);

      try {
        const data = await EventService.getEventDetail(Number(eventId));
        setEventDetail(data);
      } catch (err) {
        console.error("이벤트 상세 정보 조회 실패:", err);
        setError("이벤트 정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventDetail();
  }, [eventId]);

  // 이벤트 상태 클래스 결정
  const getStatusClassName = (status: EventStatus) => {
    switch (status) {
      case EventStatus.UPCOMING:
        return `${styles.statusBadge} ${styles.statusUpcoming}`;
      case EventStatus.ACTIVE:
        return `${styles.statusBadge} ${styles.statusActive}`;
      case EventStatus.ENDED:
        return `${styles.statusBadge} ${styles.statusInactive}`;
      default:
        return styles.statusBadge;
    }
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 수정 페이지로 이동
  const handleEdit = () => {
    navigate(`/admin/events/edit/${eventId}`);
  };

  // 이벤트 삭제
  const handleDelete = async () => {
    if (!eventId) return;

    if (
      !window.confirm(
        "정말로 이 이벤트를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      await EventService.deleteEvent(Number(eventId));
      alert("이벤트가 성공적으로 삭제되었습니다.");
      navigate("/admin/events");
    } catch (err) {
      console.error("이벤트 삭제 실패:", err);
      alert("이벤트 삭제 중 오류가 발생했습니다.");
      setIsLoading(false);
    }
  };

  // 이벤트 상태 변경 - 새로 추가된 기능
  const handleStatusChange = async (newStatus: EventStatus) => {
    if (!eventId || !eventDetail || eventDetail.status === newStatus) return;

    if (
      !window.confirm(
        `이벤트 상태를 '${eventDetail.statusDisplayName}'에서 '${
          newStatus === EventStatus.UPCOMING
            ? "예정"
            : newStatus === EventStatus.ACTIVE
            ? "진행 중"
            : "종료"
        }'로 변경하시겠습니까?`
      )
    ) {
      return;
    }

    setStatusUpdateLoading(true);
    try {
      const updatedStatus = await EventService.updateEventStatus(
        Number(eventId),
        newStatus
      );
      // 상세 정보 다시 로드
      const updatedEvent = await EventService.getEventDetail(Number(eventId));
      setEventDetail(updatedEvent);
      alert("이벤트 상태가 성공적으로 변경되었습니다.");
    } catch (err) {
      console.error("이벤트 상태 변경 실패:", err);
      alert("이벤트 상태 변경 중 오류가 발생했습니다.");
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  // 목록으로 돌아가기
  const handleGoBack = () => {
    navigate("/admin/events");
  };

  if (isLoading) {
    return (
      <div
        className={`${styles.detailPage} ${
          theme === "dark" ? styles.dark : ""
        }`}
      >
        <div className={styles.loadingContainer}>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error || !eventDetail) {
    return (
      <div
        className={`${styles.detailPage} ${
          theme === "dark" ? styles.dark : ""
        }`}
      >
        <div className={styles.errorContainer}>
          <ErrorMessage message={error || "이벤트 정보를 찾을 수 없습니다."} />
          <button className={styles.backButton} onClick={handleGoBack}>
            <FiArrowLeft /> 목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${styles.detailPage} ${theme === "dark" ? styles.dark : ""}`}
    >
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>
          <FiArrowLeft
            onClick={handleGoBack}
            style={{ cursor: "pointer" }}
            title="목록으로 돌아가기"
          />
          이벤트 상세
        </h1>
        <div className={styles.headerButtons}>
          <button className={styles.editButton} onClick={handleEdit}>
            <FiEdit2 /> 수정
          </button>
          <button className={styles.deleteButton} onClick={handleDelete}>
            <FiTrash2 /> 삭제
          </button>
        </div>
      </div>

      <div className={styles.detailContainer}>
        <div className={styles.eventBasicInfo}>
          <h2 className={styles.eventTitle}>{eventDetail.title}</h2>
          <span className={getStatusClassName(eventDetail.status)}>
            {eventDetail.statusDisplayName}
          </span>

          {/* 상태 변경 드롭다운 추가 */}
          <div className={styles.statusActions}>
            <label>상태 변경:</label>
            <select
              className={styles.statusSelect}
              value=""
              onChange={(e) => {
                if (e.target.value) {
                  handleStatusChange(e.target.value as EventStatus);
                  e.target.value = "";
                }
              }}
              disabled={statusUpdateLoading}
            >
              <option value="">상태 선택...</option>
              <option value={EventStatus.UPCOMING}>예정</option>
              <option value={EventStatus.ACTIVE}>진행 중</option>
              <option value={EventStatus.ENDED}>종료</option>
            </select>
            {statusUpdateLoading && (
              <FiRefreshCw className={styles.statusLoading} />
            )}
          </div>

          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>브랜드</span>
              <span className={styles.infoValue}>{eventDetail.brandName}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>시작일</span>
              <span className={styles.infoValue}>
                {formatDate(eventDetail.startDate)}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>종료일</span>
              <span className={styles.infoValue}>
                {formatDate(eventDetail.endDate)}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.eventDescription}>
          <h3 className={styles.descriptionTitle}>이벤트 설명</h3>
          <div className={styles.descriptionContent}>
            {eventDetail.description}
          </div>
        </div>
      </div>

      <div className={styles.imagesContainer}>
        <h3 className={styles.imagesTitle}>이미지</h3>

        <div className={styles.thumbnailContainer}>
          <h4 className={styles.thumbnailTitle}>썸네일 이미지</h4>
          {eventDetail.thumbnailUrl ? (
            <img
              src={eventDetail.thumbnailUrl}
              alt="이벤트 썸네일"
              className={styles.thumbnailImage}
            />
          ) : (
            <p className={styles.noImages}>썸네일 이미지가 없습니다.</p>
          )}
        </div>

        {eventDetail.simpleImageUrls &&
        eventDetail.simpleImageUrls.length > 0 ? (
          <div>
            <h4 className={styles.thumbnailTitle}>
              상세 이미지 ({eventDetail.simpleImageUrls.length})
            </h4>
            <div className={styles.simpleImagesGrid}>
              {eventDetail.simpleImageUrls.map((imageUrl, index) => (
                <div key={index} className={styles.simpleImageItem}>
                  <img
                    src={imageUrl}
                    alt={`이벤트 이미지 ${index + 1}`}
                    className={styles.simpleImage}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <h4 className={styles.thumbnailTitle}>상세 이미지</h4>
            <p className={styles.noImages}>상세 이미지가 없습니다.</p>
          </div>
        )}
      </div>

      <div className={styles.metaInfo}>
        <span>생성일: {formatDate(eventDetail.createdDate)}</span>
        <span>수정일: {formatDate(eventDetail.modifiedDate)}</span>
      </div>
    </div>
  );
};

export default EventDetailPage;
