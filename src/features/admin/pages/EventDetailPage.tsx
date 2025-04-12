import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiEdit2, FiTrash2 } from "react-icons/fi";
import { useTheme } from "../../../global/context/ThemeContext";
import { EventService } from "../services/eventService";
import { EventDetailDto } from "../types/eventTypes";
import LoadingSpinner from "../../../global/components/common/LoadingSpinner";
import ErrorMessage from "../../../global/components/common/ErrorMessage";
import styles from "../styles/EventDetailPage.module.css";

const EventDetailPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [eventDetail, setEventDetail] = useState<EventDetailDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  // 이벤트 상태 텍스트와 스타일 클래스 결정
  const getStatusInfo = () => {
    if (!eventDetail) return { text: "", className: "" };

    const now = new Date();
    const startDate = new Date(eventDetail.startDate);
    const endDate = new Date(eventDetail.endDate);

    if (now < startDate) {
      return {
        text: "예정",
        className: `${styles.statusBadge} ${styles.statusUpcoming}`,
      };
    } else if (now <= endDate) {
      return {
        text: "진행 중",
        className: `${styles.statusBadge} ${styles.statusActive}`,
      };
    } else {
      return {
        text: "종료",
        className: `${styles.statusBadge} ${styles.statusInactive}`,
      };
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

  const statusInfo = getStatusInfo();

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
          <span className={statusInfo.className}>{statusInfo.text}</span>

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
