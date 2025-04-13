import React, { useState } from "react";
import { FiArrowLeft, FiCheck, FiX, FiTrash2 } from "react-icons/fi";
import {
  UserSanction,
  SanctionType,
  SanctionStatus,
} from "../types/sanctionTypes";
import styles from "./SanctionDetail.module.css";

interface SanctionDetailProps {
  sanction: UserSanction;
  onBack: () => void;
  onAction: (
    action: "approve" | "reject" | "cancel",
    sanctionId: number,
    rejectionReason?: string
  ) => void;
  theme: string;
}

const SanctionDetail: React.FC<SanctionDetailProps> = ({
  sanction,
  onBack,
  onAction,
  theme,
}) => {
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const [showRejectInput, setShowRejectInput] = useState<boolean>(false);

  // Format date function
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status badge class
  const getStatusBadgeClass = (status: SanctionStatus) => {
    switch (status) {
      case "ACTIVE":
        return styles.activeBadge;
      case "EXPIRED":
        return styles.expiredBadge;
      case "PENDING":
        return styles.pendingBadge;
      case "REJECTED":
        return styles.rejectedBadge;
      case "CANCELED":
        return styles.canceledBadge;
      default:
        return "";
    }
  };

  // Get status label
  const getStatusLabel = (status: SanctionStatus) => {
    switch (status) {
      case "ACTIVE":
        return "활성";
      case "EXPIRED":
        return "만료됨";
      case "PENDING":
        return "승인 대기중";
      case "REJECTED":
        return "거부됨";
      case "CANCELED":
        return "취소됨";
      default:
        return status;
    }
  };

  // Get type label
  const getTypeLabel = (type: SanctionType) => {
    switch (type) {
      case "WARNING":
        return "경고";
      case "TEMPORARY_BAN":
        return "일시 정지";
      case "PERMANENT_BAN":
        return "영구 정지";
      case "FEATURE_RESTRICTION":
        return "기능 제한";
      default:
        return type;
    }
  };

  // Handle reject click
  const handleRejectClick = () => {
    setShowRejectInput(true);
  };

  // Handle reject submit
  const handleRejectSubmit = () => {
    if (rejectionReason.trim()) {
      onAction("reject", sanction.id, rejectionReason);
    }
  };

  // Handle approve click
  const handleApproveClick = () => {
    onAction("approve", sanction.id);
  };

  // Handle cancel click
  const handleCancelClick = () => {
    onAction("cancel", sanction.id);
  };

  return (
    <div
      className={`${styles.sanctionDetailContainer} ${
        theme === "dark" ? styles.dark : ""
      }`}
    >
      <button className={styles.backButton} onClick={onBack}>
        <FiArrowLeft /> 목록으로 돌아가기
      </button>

      <div className={styles.detailHeader}>
        <h2 className={styles.detailTitle}>제재 상세 정보</h2>
        <div className={styles.statusContainer}>
          <span
            className={`${styles.statusBadge} ${getStatusBadgeClass(
              sanction.status
            )}`}
          >
            {getStatusLabel(sanction.status)}
          </span>
        </div>
      </div>

      <div className={styles.detailGrid}>
        <div className={styles.detailItem}>
          <div className={styles.detailLabel}>ID</div>
          <div className={styles.detailValue}>{sanction.id}</div>
        </div>

        <div className={styles.detailItem}>
          <div className={styles.detailLabel}>제재 유형</div>
          <div className={styles.detailValue}>
            <span
              className={`${styles.typeBadge} ${
                styles[sanction.type.toLowerCase() + "Badge"]
              }`}
            >
              {getTypeLabel(sanction.type)}
            </span>
          </div>
        </div>

        <div className={styles.detailItem}>
          <div className={styles.detailLabel}>등록일</div>
          <div className={styles.detailValue}>
            {formatDate(sanction.createdDate)}
          </div>
        </div>

        <div className={styles.detailItem}>
          <div className={styles.detailLabel}>등록자</div>
          <div className={styles.detailValue}>{sanction.createdBy}</div>
        </div>

        <div className={styles.detailItem}>
          <div className={styles.detailLabel}>시작일</div>
          <div className={styles.detailValue}>
            {formatDate(sanction.startDate)}
          </div>
        </div>

        <div className={styles.detailItem}>
          <div className={styles.detailLabel}>종료일</div>
          <div className={styles.detailValue}>
            {sanction.endDate ? formatDate(sanction.endDate) : "영구"}
          </div>
        </div>

        <div className={styles.detailItem}>
          <div className={styles.detailLabel}>승인자</div>
          <div className={styles.detailValue}>{sanction.approvedBy || "-"}</div>
        </div>

        <div className={styles.detailItem}>
          <div className={styles.detailLabel}>거부자</div>
          <div className={styles.detailValue}>{sanction.rejectedBy || "-"}</div>
        </div>
      </div>

      <div className={styles.userSection}>
        <h3 className={styles.sectionTitle}>사용자 정보</h3>
        <div className={styles.detailGrid}>
          <div className={styles.detailItem}>
            <div className={styles.detailLabel}>사용자 ID</div>
            <div className={styles.detailValue}>{sanction.userId}</div>
          </div>

          <div className={styles.detailItem}>
            <div className={styles.detailLabel}>이메일</div>
            <div className={styles.detailValue}>{sanction.userEmail}</div>
          </div>

          <div className={styles.detailItem}>
            <div className={styles.detailLabel}>프로필명</div>
            <div className={styles.detailValue}>
              {sanction.userProfileName || "-"}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.contentSection}>
        <h3 className={styles.sectionTitle}>제재 내용</h3>
        <div className={styles.detailContent}>
          <div className={styles.detailItem}>
            <div className={styles.detailLabel}>사유</div>
            <div className={styles.detailValue}>{sanction.reason}</div>
          </div>

          {sanction.details && (
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>상세 내용</div>
              <div className={styles.detailValue}>{sanction.details}</div>
            </div>
          )}

          {sanction.targetId && (
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>대상 컨텐츠</div>
              <div className={styles.detailValue}>
                {sanction.targetType}: {sanction.targetId}
              </div>
            </div>
          )}

          {sanction.rejectionReason && (
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>거부 사유</div>
              <div className={styles.detailValue}>
                {sanction.rejectionReason}
              </div>
            </div>
          )}
        </div>
      </div>

      {sanction.status === "PENDING" && (
        <div className={styles.actionSection}>
          {showRejectInput ? (
            <div className={styles.rejectForm}>
              <textarea
                placeholder="거부 사유를 입력하세요"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className={styles.rejectInput}
              />
              <div className={styles.rejectFormActions}>
                <button
                  className={styles.cancelRejectButton}
                  onClick={() => setShowRejectInput(false)}
                >
                  취소
                </button>
                <button
                  className={styles.submitRejectButton}
                  onClick={handleRejectSubmit}
                  disabled={!rejectionReason.trim()}
                >
                  확인
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.actionButtons}>
              <button
                className={styles.approveButton}
                onClick={handleApproveClick}
              >
                <FiCheck /> 승인
              </button>
              <button
                className={styles.rejectButton}
                onClick={handleRejectClick}
              >
                <FiX /> 거부
              </button>
            </div>
          )}
        </div>
      )}

      {sanction.status === "ACTIVE" && (
        <div className={styles.actionSection}>
          <button className={styles.cancelButton} onClick={handleCancelClick}>
            <FiTrash2 /> 제재 취소
          </button>
        </div>
      )}
    </div>
  );
};

export default SanctionDetail;
