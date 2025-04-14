import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiEdit,
  FiLock,
  FiUnlock,
  FiUser,
  FiMapPin,
  FiCreditCard,
  FiShield,
  FiPlusCircle,
  FiAlertCircle,
  FiHeart,
  FiMail,
  FiPhone,
} from "react-icons/fi";
import { useTheme } from "../../../global/context/ThemeContext";
import { UserService } from "../services/userManagementService";
import { UserDetailDto, SanctionBriefDto } from "../types/userManagementTypes";
import LoadingSpinner from "../../../global/components/common/LoadingSpinner";
import ErrorMessage from "../../../global/components/common/ErrorMessage";
import styles from "./UserDetailPage.module.css";
import StatusChangeModal from "../components/StatusChangeModal";
import GradeChangeModal from "../components/GradeChangeModal";
import RoleChangeModal from "../components/RoleChangeModal";
import PointManageModal from "../components/PointManageModal";
import PointDetailModal from "../components/PointDetailModal";

const UserDetailPage: React.FC = () => {
  const { theme } = useTheme();
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  // State management
  const [userDetail, setUserDetail] = useState<UserDetailDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [showStatusModal, setShowStatusModal] = useState<boolean>(false);
  const [showGradeModal, setShowGradeModal] = useState<boolean>(false);
  const [showRoleModal, setShowRoleModal] = useState<boolean>(false);
  const [showPointModal, setShowPointModal] = useState<boolean>(false);
  const [showPointDetailModal, setShowPointDetailModal] = useState<boolean>(false);

  // Load user data
  useEffect(() => {
    const loadUserDetail = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (!userId) {
          throw new Error("사용자 ID가 필요합니다.");
        }

        const data = await UserService.getUserById(parseInt(userId));
        setUserDetail(data);
      } catch (err) {
        console.error("사용자 상세 정보 로드 실패:", err);
        setError("사용자 정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserDetail();
  }, [userId]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle status change
  const handleStatusChange = async (status: boolean, reason: string) => {
    if (!userDetail || !userId) return;

    try {
      const updatedUser = await UserService.updateUserStatus({
        userId: parseInt(userId),
        status,
        reason,
      });

      setUserDetail(updatedUser);
      setShowStatusModal(false);
    } catch (err) {
      console.error("상태 변경 실패:", err);
      setError("사용자 상태 변경 중 오류가 발생했습니다.");
    }
  };

  // Handle grade change
  const handleGradeChange = async (gradeId: number, reason: string) => {
    if (!userDetail || !userId) return;

    try {
      const updatedUser = await UserService.updateUserGrade({
        userId: parseInt(userId),
        gradeId,
        reason,
      });

      setUserDetail(updatedUser);
      setShowGradeModal(false);
    } catch (err) {
      console.error("등급 변경 실패:", err);
      setError("사용자 등급 변경 중 오류가 발생했습니다.");
    }
  };

  // Handle role change
  const handleRoleChange = async (role: string, reason: string) => {
    if (!userDetail || !userId) return;

    try {
      const updatedUser = await UserService.updateUserRole({
        userId: parseInt(userId),
        role,
        reason,
      });

      setUserDetail(updatedUser);
      setShowRoleModal(false);
    } catch (err) {
      console.error("권한 변경 실패:", err);
      setError("사용자 권한 변경 중 오류가 발생했습니다.");
    }
  };

  // Handle point management
  const handlePointsManage = async (
    amount: number,
    reason: string,
    expirationDate?: string
  ) => {
    if (!userDetail || !userId) return;

    try {
      await UserService.manageUserPoints({
        userId: parseInt(userId),
        amount,
        reason,
        expirationDate,
      });

      // Reload user to get updated point data
      const updatedUser = await UserService.getUserById(parseInt(userId));
      setUserDetail(updatedUser);
      setShowPointModal(false);
    } catch (err) {
      console.error("포인트 관리 실패:", err);
      setError("포인트 지급/차감 중 오류가 발생했습니다.");
    }
  };

  // Render sanctions list
  const renderSanctions = (sanctions: SanctionBriefDto[]) => {
    if (!sanctions || sanctions.length === 0) {
      return <div className={styles.noSanctions}>제재 이력이 없습니다.</div>;
    }

    return (
      <div className={styles.sanctionsList}>
        {sanctions.map((sanction) => (
          <div key={sanction.id} className={styles.sanctionItem}>
            <div className={styles.sanctionHeader}>
              <div
                className={`${styles.sanctionStatus} ${
                  sanction.status === "ACTIVE" ? styles.active : styles.inactive
                }`}
              >
                {sanction.status === "ACTIVE" ? "진행중" : "종료됨"}
              </div>
              <div className={styles.sanctionDate}>
                {formatDate(sanction.startDate)} ~{" "}
                {formatDate(sanction.endDate)}
              </div>
            </div>
            <div className={styles.sanctionType}>
              <FiAlertCircle /> {sanction.type}
            </div>
            <div className={styles.sanctionReason}>{sanction.reason}</div>
          </div>
        ))}
      </div>
    );
  };

  // Loading state
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Error state
  if (error || !userDetail) {
    return (
      <div
        className={`${styles.userDetail} ${
          theme === "dark" ? styles.dark : ""
        }`}
      >
        <ErrorMessage message={error || "사용자 정보를 불러올 수 없습니다."} />
        <button
          className={styles.backArrow}
          onClick={() => navigate("/admin/users")}
          title="목록으로 돌아가기"
        >
          <FiArrowLeft /> 목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div
      className={`${styles.userDetail} ${theme === "dark" ? styles.dark : ""}`}
    >
      <div className={styles.pageHeader}>
        <button
          className={styles.backArrow}
          onClick={() => navigate("/admin/users")}
          title="목록으로 돌아가기"
        >
          <FiArrowLeft />
        </button>
        <h1 className={styles.pageTitle}>사용자 상세 정보</h1>
      </div>

      {/* User Profile Section */}
      <div className={styles.userProfileCard}>
        <div className={styles.userProfileHeader}>
          <div className={styles.profileImageContainer}>
            {userDetail.profile?.profileImageUrl ? (
              <img
                src={userDetail.profile.profileImageUrl}
                alt={`${userDetail.profile.profileName} 프로필`}
                className={styles.profileImage}
              />
            ) : (
              <div className={styles.profileImagePlaceholder}>
                <FiUser size={40} />
              </div>
            )}
          </div>

          <div className={styles.userProfileInfo}>
            <h2 className={styles.profileName}>
              {userDetail.profile?.profileName || "프로필명 없음"}
              {userDetail.role === "ADMIN" && (
                <span className={styles.adminBadge}>관리자</span>
              )}
            </h2>

            <div className={styles.userBasicInfo}>
              <div className={styles.infoItem}>
                <FiMail />
                <span>{userDetail.email}</span>
              </div>

              <div className={styles.infoItem}>
                <FiPhone />
                <span>
                  {userDetail.phoneNumber}
                  {!userDetail.isVerified && (
                    <span className={styles.unverifiedBadge}>미인증</span>
                  )}
                </span>
              </div>
            </div>

            <div className={styles.userStatus}>
              <div
                className={`${styles.statusBadge} ${
                  userDetail.isActive ? styles.active : styles.inactive
                }`}
              >
                {userDetail.isActive ? "활성 계정" : "비활성 계정"}
              </div>
              <div className={styles.userStatusDate}>
                가입일: {formatDate(userDetail.createdDate)}
              </div>
            </div>
          </div>

          <div className={styles.userActions}>
            <button
              className={`${styles.actionButton} ${
                userDetail.isActive
                  ? styles.deactivateButton
                  : styles.activateButton
              }`}
              onClick={() => setShowStatusModal(true)}
            >
              {userDetail.isActive ? (
                <>
                  <FiLock /> 계정 비활성화
                </>
              ) : (
                <>
                  <FiUnlock /> 계정 활성화
                </>
              )}
            </button>

            <button
              className={styles.actionButton}
              onClick={() => setShowRoleModal(true)}
            >
              <FiEdit /> 권한 변경
            </button>

            <button
              className={styles.actionButton}
              onClick={() => setShowGradeModal(true)}
            >
              <FiEdit /> 등급 변경
            </button>

            <button
              className={styles.actionButton}
              onClick={() => setShowPointModal(true)}
            >
              <FiPlusCircle /> 포인트 관리
            </button>
          </div>
        </div>
      </div>

      {/* User Detail Tabs */}
      <div className={styles.detailTabs}>
        <div className={styles.tabsGrid}>
          {/* Basic Information */}
          <div className={styles.detailCard}>
            <h3 className={styles.cardTitle}>
              <FiUser /> 기본 정보
            </h3>
            <div className={styles.cardContent}>
              <div className={styles.infoGrid}>
                <div className={styles.infoRow}>
                  <div className={styles.infoLabel}>성별</div>
                  <div className={styles.infoValue}>
                    {userDetail.gender
                      ? userDetail.gender === "MALE"
                        ? "남성"
                        : userDetail.gender === "FEMALE"
                        ? "여성"
                        : "기타"
                      : "미입력"}
                  </div>
                </div>

                <div className={styles.infoRow}>
                  <div className={styles.infoLabel}>나이</div>
                  <div className={styles.infoValue}>
                    {userDetail.age ? `${userDetail.age}세` : "미입력"}
                  </div>
                </div>

                <div className={styles.infoRow}>
                  <div className={styles.infoLabel}>신발 사이즈</div>
                  <div className={styles.infoValue}>
                    {userDetail.shoeSize
                      ? userDetail.shoeSize.replace("SIZE_", "")
                      : "미입력"}
                  </div>
                </div>

                <div className={styles.infoRow}>
                  <div className={styles.infoLabel}>실명 인증</div>
                  <div className={styles.infoValue}>
                    {userDetail.isVerified ? (
                      <span className={styles.verifiedText}>완료</span>
                    ) : (
                      <span className={styles.unverifiedText}>미인증</span>
                    )}
                  </div>
                </div>

                <div className={styles.infoRow}>
                  <div className={styles.infoLabel}>CI</div>
                  <div className={styles.infoValue}>
                    {userDetail.ci || "미인증"}
                  </div>
                </div>

                <div className={styles.infoRow}>
                  <div className={styles.infoLabel}>DI</div>
                  <div className={styles.infoValue}>
                    {userDetail.di || "미인증"}
                  </div>
                </div>

                <div className={styles.infoRow}>
                  <div className={styles.infoLabel}>판매자 등급</div>
                  <div className={styles.infoValue}>
                    {userDetail.sellerGrade !== undefined
                      ? `Lv.${userDetail.sellerGrade}`
                      : "일반 회원"}
                  </div>
                </div>

                <div className={styles.infoRow}>
                  <div className={styles.infoLabel}>마지막 정보 수정일</div>
                  <div className={styles.infoValue}>
                    {formatDate(userDetail.updatedDate)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Points and Interests */}
          <div className={styles.detailCard}>
            <h3 className={styles.cardTitle}>
              <FiPlusCircle /> 포인트 및 관심상품
            </h3>
            <div className={styles.cardContent}>
              <div className={styles.pointsInfo}>
                <div className={styles.pointsRow}>
                  <div className={styles.pointsLabel}>총 보유 포인트</div>
                  <div className={styles.pointsValue}>
                    {userDetail.totalPoints.toLocaleString()} P
                  </div>
                </div>

                <div className={styles.pointsRow}>
                  <div className={styles.pointsLabel}>사용 가능 포인트</div>
                  <div className={styles.pointsValue}>
                    {userDetail.availablePoints.toLocaleString()} P
                  </div>
                </div>
                
                <button 
                  className={styles.viewPointsButton}
                  onClick={() => setShowPointDetailModal(true)}
                >
                  포인트 상세 내역 보기
                </button>
              </div>

              <div className={styles.interestsContainer}>
                <h4 className={styles.interestsTitle}>
                  <FiHeart /> 관심 상품 ({userDetail.interests?.length || 0})
                </h4>

                {userDetail.interests && userDetail.interests.length > 0 ? (
                  <div className={styles.interestsList}>
                    {userDetail.interests.map((interest) => (
                      <div key={interest.id} className={styles.interestItem}>
                        <div className={styles.interestImageContainer}>
                          <img
                            src={interest.productImageUrl}
                            alt={interest.productName}
                            className={styles.interestImage}
                          />
                        </div>
                        <div className={styles.interestInfo}>
                          {interest.productName}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.noInterests}>
                    관심 상품이 없습니다.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className={styles.detailCard}>
            <h3 className={styles.cardTitle}>
              <FiUser /> 프로필 정보
            </h3>
            <div className={styles.cardContent}>
              {userDetail.profile ? (
                <div className={styles.infoGrid}>
                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>프로필명</div>
                    <div className={styles.infoValue}>
                      {userDetail.profile.profileName}
                    </div>
                  </div>

                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>이름</div>
                    <div className={styles.infoValue}>
                      {userDetail.profile.name || "미입력"}
                    </div>
                  </div>

                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>프로필 공개</div>
                    <div className={styles.infoValue}>
                      {userDetail.profile.isPublic ? "공개" : "비공개"}
                    </div>
                  </div>

                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>팔로워</div>
                    <div className={styles.infoValue}>
                      {userDetail.profile.followersCount.toLocaleString()}명
                    </div>
                  </div>

                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>팔로잉</div>
                    <div className={styles.infoValue}>
                      {userDetail.profile.followingCount.toLocaleString()}명
                    </div>
                  </div>

                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>스타일 게시물</div>
                    <div className={styles.infoValue}>
                      {userDetail.profile.stylesCount.toLocaleString()}개
                    </div>
                  </div>

                  {userDetail.profile.bio && (
                    <div className={styles.bioRow}>
                      <div className={styles.infoLabel}>자기소개</div>
                      <div className={styles.bioText}>
                        {userDetail.profile.bio}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className={styles.noProfileInfo}>
                  프로필 정보가 없습니다.
                </div>
              )}
            </div>
          </div>

          {/* Address Information */}
          <div className={styles.detailCard}>
            <h3 className={styles.cardTitle}>
              <FiMapPin /> 배송지 정보
            </h3>
            <div className={styles.cardContent}>
              {userDetail.addresses && userDetail.addresses.length > 0 ? (
                <div className={styles.addressList}>
                  {userDetail.addresses.map((address) => (
                    <div key={address.id} className={styles.addressItem}>
                      <div className={styles.addressHeader}>
                        <div className={styles.addressName}>{address.name}</div>
                        {address.isDefault && (
                          <div className={styles.defaultBadge}>기본 배송지</div>
                        )}
                      </div>

                      <div className={styles.addressInfo}>
                        <div className={styles.addressRecipient}>
                          {address.recipientName} ({address.recipientPhone})
                        </div>
                        <div className={styles.addressText}>
                          ({address.zipCode}) {address.address1}{" "}
                          {address.address2}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.noAddresses}>
                  저장된 배송지가 없습니다.
                </div>
              )}
            </div>
          </div>

          {/* Bank Account Information */}
          <div className={styles.detailCard}>
            <h3 className={styles.cardTitle}>
              <FiCreditCard /> 계좌 정보
            </h3>
            <div className={styles.cardContent}>
              {userDetail.bankAccount ? (
                <div className={styles.bankInfo}>
                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>은행명</div>
                    <div className={styles.infoValue}>
                      {userDetail.bankAccount.bankName}
                    </div>
                  </div>

                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>계좌번호</div>
                    <div className={styles.infoValue}>
                      {userDetail.bankAccount.accountNumber}
                    </div>
                  </div>

                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>예금주</div>
                    <div className={styles.infoValue}>
                      {userDetail.bankAccount.accountHolder}
                    </div>
                  </div>
                </div>
              ) : (
                <div className={styles.noBankInfo}>
                  등록된 계좌 정보가 없습니다.
                </div>
              )}
            </div>
          </div>

          {/* Sanctions Information */}
          <div className={styles.detailCard}>
            <h3 className={styles.cardTitle}>
              <FiShield /> 제재 이력
            </h3>
            <div className={styles.cardContent}>
              {userDetail.sanctions ? (
                renderSanctions(userDetail.sanctions)
              ) : (
                <div className={styles.noSanctions}>제재 이력이 없습니다.</div>
              )}
            </div>
          </div>

          {/* Marketing Consents */}
          <div className={styles.detailCard}>
            <h3 className={styles.cardTitle}>
              <FiShield /> 이용약관 및 마케팅 동의
            </h3>
            <div className={styles.cardContent}>
              <div className={styles.consentGrid}>
                <div className={styles.consentRow}>
                  <div className={styles.consentLabel}>이용약관 동의</div>
                  <div className={styles.consentValue}>
                    {userDetail.termsAgreement ? "동의함" : "동의하지 않음"}
                  </div>
                </div>

                <div className={styles.consentRow}>
                  <div className={styles.consentLabel}>
                    개인정보 선택적 동의
                  </div>
                  <div className={styles.consentValue}>
                    {userDetail.optionalPrivacyAgreement
                      ? "동의함"
                      : "동의하지 않음"}
                  </div>
                </div>

                <div className={styles.consentRow}>
                  <div className={styles.consentLabel}>이메일 마케팅 수신</div>
                  <div className={styles.consentValue}>
                    {userDetail.emailNotificationConsent
                      ? "동의함"
                      : "동의하지 않음"}
                  </div>
                </div>

                <div className={styles.consentRow}>
                  <div className={styles.consentLabel}>
                    SMS/알림 마케팅 수신
                  </div>
                  <div className={styles.consentValue}>
                    {userDetail.phoneNotificationConsent
                      ? "동의함"
                      : "동의하지 않음"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showStatusModal && (
        <StatusChangeModal
          isOpen={showStatusModal}
          onClose={() => setShowStatusModal(false)}
          onConfirm={handleStatusChange}
          currentStatus={userDetail.isActive}
          theme={theme}
        />
      )}

      {showGradeModal && (
        <GradeChangeModal
          isOpen={showGradeModal}
          onClose={() => setShowGradeModal(false)}
          onConfirm={handleGradeChange}
          currentGrade={userDetail.sellerGrade}
          theme={theme}
        />
      )}

      {showRoleModal && (
        <RoleChangeModal
          isOpen={showRoleModal}
          onClose={() => setShowRoleModal(false)}
          onConfirm={handleRoleChange}
          currentRole={userDetail.role}
          theme={theme}
        />
      )}

      {showPointModal && (
        <PointManageModal
          isOpen={showPointModal}
          onClose={() => setShowPointModal(false)}
          onConfirm={handlePointsManage}
          currentPoints={userDetail.availablePoints}
          theme={theme}
        />
      )}

      {showPointDetailModal && (
        <PointDetailModal
          isOpen={showPointDetailModal}
          onClose={() => setShowPointDetailModal(false)}
          userId={parseInt(userId!)}
          theme={theme}
        />
      )}
    </div>
  );
};

export default UserDetailPage;