import React, { useContext, useState } from "react";
import styles from "./StylePostItem.module.css";
import { useNavigate } from "react-router-dom";
import { StyleResponseDto } from "../types/styleTypes";
import { FaHeart, FaRegHeart, FaImage, FaPlay } from "react-icons/fa";
import { AuthContext } from "src/global/context/AuthContext";
import LoginModal from "../../common/components/LoginModal";
import styleLikeService from "../services/StyleLikeService";

interface StylePostItemProps extends StyleResponseDto {
  className?: string;
}

const StylePostItem: React.FC<StylePostItemProps> = ({
  id,
  profileId,
  profileName,
  profileImageUrl,
  content,
  mediaUrl,
  likeCount,
  viewCount,
  liked = false, // 백엔드에서 제공하는 초기 좋아요 상태
  className,
}) => {
  const [isLiked, setIsLiked] = useState(liked);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  // 미디어 타입 확인 (간단한 방법: 확장자로 판단)
  const isVideo =
    mediaUrl?.toLowerCase().endsWith(".mp4") ||
    mediaUrl?.toLowerCase().endsWith(".mov") ||
    mediaUrl?.toLowerCase().endsWith(".webm");

  const handleClick = () => {
    navigate(`/style/${id}`);
  };

  const toggleLike = async (e: React.MouseEvent) => {
    e.stopPropagation(); // 부모 요소의 클릭 이벤트 방지

    if (isProcessing) return; // 이미 처리 중이면 중복 요청 방지

    if (!isLoggedIn) {
      setLoginModalOpen(true);
      return;
    }

    setIsProcessing(true);

    try {
      const success = await styleLikeService.toggleLike(id);

      if (success) {
        // 좋아요 상태 토글
        setIsLiked((prev) => !prev);
      }
    } catch (error) {
      console.error("좋아요 처리 실패", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div
        className={`${styles.postContainer} ${className || ""}`}
        onClick={handleClick}
      >
        <div className={styles.mediaContainer}>
          <img src={mediaUrl} alt="Style post" className={styles.postImage} />
          {/* 미디어 타입에 따른 아이콘 표시 */}
          <div className={styles.mediaIcon}>
            {isVideo ? <FaPlay color="white" /> : <FaImage color="white" />}
          </div>
        </div>
        <div className={styles.profileSection}>
          <img
            src={profileImageUrl}
            alt={profileName}
            className={styles.profilePic}
          />
          <span className={styles.username}>{profileName}</span>
          <button
            onClick={toggleLike}
            className={styles.likeButton}
            disabled={isProcessing}
          >
            {isLiked ? <FaHeart color="red" /> : <FaRegHeart />}
            <span className={styles.likeCount}>{likeCount}</span>
          </button>
        </div>
        <div className={styles.content}>{content}</div>
      </div>

      {/* 로그인 모달 */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        message="좋아요 기능은 로그인 후 이용 가능합니다."
      />
    </>
  );
};

export default StylePostItem;
