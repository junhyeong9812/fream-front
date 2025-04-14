import React, { useState, useEffect } from "react";
import { FiList, FiX, FiCalendar, FiClock } from "react-icons/fi";
import { PointManagementService } from "../services/pointManagementService";
import {
  PointSummaryResponseDto,
  PointResponseDto,
  PointStatus,
} from "../types/pointManagementTypes";
import styles from "./PointDetailModal.module.css";

interface PointDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  theme: string;
}

const PointDetailModal: React.FC<PointDetailModalProps> = ({
  isOpen,
  onClose,
  userId,
  theme,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pointSummary, setPointSummary] =
    useState<PointSummaryResponseDto | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "available" | "expiring">(
    "all"
  );

  useEffect(() => {
    if (isOpen && userId) {
      loadPointSummary();
    }
  }, [isOpen, userId]);

  const loadPointSummary = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await PointManagementService.getUserPointSummary(userId);
      setPointSummary(data);
    } catch (err) {
      console.error("포인트 정보 로드 실패:", err);
      setError("포인트 정보를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 포인트 상태 텍스트 포맷
  const formatPointStatus = (status: PointStatus): string => {
    switch (status) {
      case PointStatus.AVAILABLE:
        return "사용 가능";
      case PointStatus.USED:
        return "사용 완료";
      case PointStatus.EXPIRED:
        return "만료됨";
      default:
        return "알 수 없음";
    }
  };

  // 날짜 포맷
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "무기한";

    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // 포인트 목록 렌더링
  const renderPointList = (points: PointResponseDto[]): React.ReactNode => {
    if (points.length === 0) {
      return <div className={styles.noData}>포인트 내역이 없습니다.</div>;
    }

    return (
      <div className={styles.pointsList}>
        {points.map((point) => (
          <div
            key={point.id}
            className={`${styles.pointItem} ${
              point.status === PointStatus.AVAILABLE
                ? styles.available
                : point.status === PointStatus.USED
                ? styles.used
                : styles.expired
            }`}
          >
            <div className={styles.pointHeader}>
              <div className={styles.pointAmount}>
                {point.amount > 0 ? "+" : ""}
                {point.amount.toLocaleString()} P
              </div>
              <div className={styles.pointStatus}>
                {formatPointStatus(point.status)}
              </div>
            </div>
            <div className={styles.pointDetail}>
              <div className={styles.pointReason}>{point.reason}</div>
              <div className={styles.pointDates}>
                <div className={styles.pointDate}>
                  <FiClock /> 지급일:{" "}
                  {formatDate(point.createdDate.split("T")[0])}
                </div>
                {point.expirationDate &&
                  point.status === PointStatus.AVAILABLE && (
                    <div className={styles.pointExpiration}>
                      <FiCalendar /> 만료일: {formatDate(point.expirationDate)}
                    </div>
                  )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={`${styles.modal} ${theme === "dark" ? styles.dark : ""}`}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            <FiList /> 포인트 상세 내역
          </h2>
          <button className={styles.closeButton} onClick={onClose} title="닫기">
            <FiX />
          </button>
        </div>

        <div className={styles.modalContent}>
          {loading ? (
            <div className={styles.loading}>포인트 정보를 불러오는 중...</div>
          ) : error ? (
            <div className={styles.error}>{error}</div>
          ) : pointSummary ? (
            <>
              <div className={styles.pointsSummary}>
                <div className={styles.totalPoints}>
                  <div className={styles.totalPointsLabel}>
                    사용 가능 포인트
                  </div>
                  <div className={styles.totalPointsValue}>
                    {pointSummary.totalAvailablePoints.toLocaleString()} P
                  </div>
                </div>
              </div>

              <div className={styles.tabs}>
                <button
                  className={`${styles.tab} ${
                    activeTab === "all" ? styles.activeTab : ""
                  }`}
                  onClick={() => setActiveTab("all")}
                >
                  모든 내역
                </button>
                <button
                  className={`${styles.tab} ${
                    activeTab === "available" ? styles.activeTab : ""
                  }`}
                  onClick={() => setActiveTab("available")}
                >
                  사용 가능
                </button>
                <button
                  className={`${styles.tab} ${
                    activeTab === "expiring" ? styles.activeTab : ""
                  }`}
                  onClick={() => setActiveTab("expiring")}
                >
                  만료 예정 ({pointSummary.expiringPoints.length})
                </button>
              </div>

              <div className={styles.pointsListContainer}>
                {activeTab === "all" &&
                  renderPointList(pointSummary.pointDetails)}
                {activeTab === "available" &&
                  renderPointList(
                    pointSummary.pointDetails.filter(
                      (point) => point.status === PointStatus.AVAILABLE
                    )
                  )}
                {activeTab === "expiring" &&
                  renderPointList(pointSummary.expiringPoints)}
              </div>
            </>
          ) : (
            <div className={styles.noData}>포인트 정보가 없습니다.</div>
          )}
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.closeButton} onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PointDetailModal;
