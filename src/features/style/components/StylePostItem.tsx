// components/StylePostItem.tsx
import React from "react";
import styles from "./StylePostItem.module.css";
import { useNavigate } from "react-router-dom";
import { StyleResponseDto } from "../types/styleTypes";
import { FaHeart, FaRegHeart } from "react-icons/fa";

interface StylePostItemProps extends StyleResponseDto {
  className?: string;
}

const StylePostItem: React.FC<StylePostItemProps> = ({
  id,
  profileName,
  profileImageUrl,
  content,
  mediaUrl,
  likeCount,
  className,
}) => {
  const [liked, setLiked] = React.useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/style/${id}`);
  };

  const toggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked((prev) => !prev);
  };

  return (
    <div
      className={`${styles.postContainer} ${className}`}
      onClick={handleClick}
    >
      <img src={mediaUrl} alt="Style post" className={styles.postImage} />
      <div className={styles.profileSection}>
        <img
          src={profileImageUrl}
          alt={profileName}
          className={styles.profilePic}
        />
        <span className={styles.username}>{profileName}</span>
        <button onClick={toggleLike} className={styles.likeButton}>
          {liked ? <FaHeart color="red" /> : <FaRegHeart />}
        </button>
      </div>
      <div className={styles.content}>{content}</div>
    </div>
  );
};

export default StylePostItem;
