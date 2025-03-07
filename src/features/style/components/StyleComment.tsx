// StyleComment.tsx
import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from "react";
import ReactDOM from "react-dom";
import { Heart, X } from "lucide-react";
import { formatRelativeTime } from "src/global/utils/timeUtils";
import { AuthContext } from "src/global/context/AuthContext";
import LoginModal from "../../common/components/LoginModal";
import styleCommentService from "../services/StyleCommentService";
import styleCommentLikeService from "../services/StyleCommentLikeService";
import {
  StyleCommentResponseDto,
  AddCommentRequestDto,
} from "../types/styleTypes";
import styles from "./StyleComment.module.css";

interface StyleCommentProps {
  isOpen: boolean;
  onClose: () => void;
  styleId: number;
  styleContent: string;
  styleCreatedDate: string;
  authorProfileName: string;
  authorProfileImage: string;
}

const StyleComment: React.FC<StyleCommentProps> = ({
  isOpen,
  onClose,
  styleId,
  styleContent,
  styleCreatedDate,
  authorProfileName,
  authorProfileImage,
}) => {
  const [comments, setComments] = useState<StyleCommentResponseDto[]>([]);
  const [commentText, setCommentText] = useState("");
  const [replyTo, setReplyTo] = useState<{ id: number; name: string } | null>(
    null
  );
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalComments, setTotalComments] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [userProfileImage, setUserProfileImage] = useState<string | null>(null);
  const { isLoggedIn } = useContext(AuthContext);
  const commentInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const commentsContainerRef = useRef<HTMLDivElement>(null);

  // 예시 퀵 리플라이 텍스트
  const quickReplies = [
    "좋아요 ❤️",
    "맞팔해요 😀",
    "정보 부탁해요 🙏",
    "평소 사이즈가 궁금해요 👀",
  ];

  // 댓글 데이터 초기 로드
  useEffect(() => {
    if (isOpen) {
      setPage(0);
      setComments([]);
      setHasMore(true);
      fetchComments(0, true);
    }
  }, [isOpen, styleId]);

  // 모달 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // 무한 스크롤 구현
  const handleScroll = useCallback(() => {
    if (!commentsContainerRef.current || isLoadingMore || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } =
      commentsContainerRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      // 스크롤이 거의 바닥에 도달하면 다음 페이지 로드
      const nextPage = page + 1;
      setPage(nextPage);
      fetchComments(nextPage, false);
    }
  }, [isLoadingMore, hasMore, page]);

  // 스크롤 이벤트 리스너 등록
  useEffect(() => {
    const currentRef = commentsContainerRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  // 댓글 데이터 가져오기
  const fetchComments = async (pageNumber: number, isInitialLoad: boolean) => {
    if (isInitialLoad) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const response = await styleCommentService.getComments(
        styleId,
        pageNumber,
        10
      );

      setTotalComments(response.totalComments);

      // 사용자 프로필 이미지 설정
      if (response.userProfileImageUrl) {
        setUserProfileImage(response.userProfileImageUrl);
      }

      if (isInitialLoad) {
        setComments(response.comments);
      } else {
        setComments((prev) => [...prev, ...response.comments]);
      }

      // 더 불러올 댓글이 있는지 확인
      setHasMore(response.comments.length === 10);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      if (isInitialLoad) {
        setIsLoading(false);
      } else {
        setIsLoadingMore(false);
      }
    }
  };

  // 댓글 작성 함수
  const handlePostComment = async () => {
    if (!commentText.trim() || !isLoggedIn) return;

    try {
      const requestDto: AddCommentRequestDto = {
        styleId,
        content: commentText,
        parentCommentId: replyTo?.id,
      };

      await styleCommentService.addComment(requestDto);

      // 댓글 추가 후 목록 새로고침
      setPage(0);
      fetchComments(0, true);

      // 입력 필드 및 답글 상태 초기화
      setCommentText("");
      setReplyTo(null);
    } catch (error) {
      console.error("Failed to post comment:", error);
    }
  };

  // 답글 작성 모드 설정
  const handleReplyClick = (commentId: number, userName: string) => {
    if (!isLoggedIn) {
      setLoginModalOpen(true);
      return;
    }

    setReplyTo({ id: commentId, name: userName });
    setCommentText(`@${userName} `);
    commentInputRef.current?.focus();
  };

  // 답글 모드 취소
  const cancelReplyMode = () => {
    setReplyTo(null);
    setCommentText("");
  };

  // 댓글 좋아요 토글
  const handleToggleLike = async (commentId: number) => {
    if (!isLoggedIn) {
      setLoginModalOpen(true);
      return;
    }

    try {
      const success = await styleCommentLikeService.toggleCommentLike(
        commentId
      );

      if (success) {
        // 좋아요 상태 로컬에서 업데이트
        setComments((prevComments) =>
          prevComments.map((comment) => {
            // 루트 댓글인 경우
            if (comment.id === commentId) {
              const newLiked = !comment.liked;
              return {
                ...comment,
                liked: newLiked,
                likeCount: newLiked
                  ? comment.likeCount + 1
                  : comment.likeCount - 1,
              };
            }

            // 대댓글인 경우
            if (comment.replies) {
              return {
                ...comment,
                replies: comment.replies.map((reply) => {
                  if (reply.id === commentId) {
                    const newLiked = !reply.liked;
                    return {
                      ...reply,
                      liked: newLiked,
                      likeCount: newLiked
                        ? reply.likeCount + 1
                        : reply.likeCount - 1,
                    };
                  }
                  return reply;
                }),
              };
            }

            return comment;
          })
        );
      }
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  // 퀵 리플라이 선택
  const handleQuickReplyClick = (text: string) => {
    if (!isLoggedIn) {
      setLoginModalOpen(true);
      return;
    }
    setCommentText(text);
    commentInputRef.current?.focus();
  };

  // 댓글 입력창 포커스
  const handleCommentInputFocus = () => {
    if (!isLoggedIn) {
      setLoginModalOpen(true);
      return;
    }
  };

  // 모달 콘텐츠 정의
  const modalContent = (
    <>
      <div
        className={`${styles.modalOverlay} ${
          isOpen ? "" : styles.modalOverlayHidden
        }`}
        onClick={onClose}
      />
      <div
        className={`${styles.commentModal} ${
          isOpen ? styles.commentModalOpen : ""
        }`}
        ref={modalRef}
      >
        <div className={styles.modalHeader}>
          <h2 className={styles.title}>댓글</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.commentTop}>
          <div className={styles.authorComment}>
            <div className={styles.profileImage}>
              <img
                src={authorProfileImage || "/api/placeholder/40/40"}
                alt="프로필"
              />
            </div>
            <div className={styles.commentContent}>
              <div className={styles.profileName}>{authorProfileName}</div>
              <div className={styles.content}>{styleContent}</div>
              <div className={styles.timeStamp}>
                {formatRelativeTime(styleCreatedDate)}
              </div>
            </div>
          </div>
        </div>

        {/* 댓글 입력 영역을 상단으로 이동 */}
        <div className={styles.inputSection}>
          {replyTo && (
            <div className={styles.replyIndicator}>
              <span>
                <b>{replyTo.name}</b>님에게 답글 작성 중
              </span>
              <button
                className={styles.cancelReplyButton}
                onClick={cancelReplyMode}
              >
                취소
              </button>
            </div>
          )}

          <div className={styles.profileImage}>
            <img
              src={
                isLoggedIn && userProfileImage
                  ? userProfileImage
                  : "/api/placeholder/40/40"
              }
              alt="프로필"
            />
          </div>
          <div style={{ flex: 1 }}>
            <div className={styles.quickReplyContainer}>
              {quickReplies.map((text, index) => (
                <button
                  key={index}
                  className={styles.quickReplyButton}
                  onClick={() => handleQuickReplyClick(text)}
                >
                  {text}
                </button>
              ))}
            </div>
            <div className={styles.inputBox}>
              <input
                className={styles.commentInput}
                ref={commentInputRef}
                placeholder="댓글을 남기세요..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onFocus={handleCommentInputFocus}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handlePostComment();
                  }
                }}
              />
              {commentText.trim() && (
                <button
                  className={`${styles.postButton} ${
                    isLoggedIn
                      ? styles.postButtonActive
                      : styles.postButtonInactive
                  }`}
                  onClick={handlePostComment}
                  disabled={!isLoggedIn}
                >
                  등록
                </button>
              )}
            </div>
          </div>
        </div>

        <div className={styles.commentsContainer} ref={commentsContainerRef}>
          {isLoading ? (
            <div style={{ textAlign: "center", padding: "20px" }}>
              로딩 중...
            </div>
          ) : comments.length === 0 ? (
            <div className={styles.emptyComments}>
              <div className={styles.emptyCommentsIcon}>💬</div>
              <div className={styles.emptyCommentsText}>
                아직 댓글이 없습니다
              </div>
              <div className={styles.emptyCommentsSubText}>
                첫 댓글을 남겨보세요!
              </div>
            </div>
          ) : (
            <>
              {comments.map((comment) => (
                <React.Fragment key={comment.id}>
                  <div className={styles.commentItem}>
                    <div className={styles.profileImage}>
                      <img
                        src={
                          comment.profileImageUrl || "/api/placeholder/40/40"
                        }
                        alt="프로필"
                      />
                    </div>
                    <div className={styles.commentInfo}>
                      <div className={styles.profileName}>
                        {comment.profileName}
                      </div>
                      <div className={styles.content}>{comment.content}</div>
                      <div className={styles.commentActions}>
                        <span className={styles.timeStamp}>
                          {formatRelativeTime(comment.createdDate)}
                        </span>
                        <span>•</span>
                        <button className={styles.actionButton}>
                          좋아요 {comment.likeCount}개
                        </button>
                        <button
                          className={styles.actionButton}
                          onClick={() =>
                            handleReplyClick(comment.id, comment.profileName)
                          }
                        >
                          답글쓰기
                        </button>
                      </div>
                    </div>
                    <button
                      className={styles.likeButton}
                      onClick={() => handleToggleLike(comment.id)}
                    >
                      <Heart
                        size={16}
                        fill={comment.liked ? "#ff3040" : "none"}
                        color={comment.liked ? "#ff3040" : "currentColor"}
                      />
                    </button>
                  </div>

                  {comment.replies && comment.replies.length > 0 && (
                    <div className={styles.replySection}>
                      {comment.replies.map((reply) => (
                        <div className={styles.replyItem} key={reply.id}>
                          <div className={styles.profileImage}>
                            <img
                              src={
                                reply.profileImageUrl ||
                                "/api/placeholder/40/40"
                              }
                              alt="프로필"
                            />
                          </div>
                          <div className={styles.commentInfo}>
                            <div className={styles.profileName}>
                              {reply.profileName}
                            </div>
                            <div className={styles.content}>
                              <span className={styles.mentionText}>
                                @{comment.profileName}
                              </span>
                              {reply.content.replace(
                                `@${comment.profileName}`,
                                ""
                              )}
                            </div>
                            <div className={styles.commentActions}>
                              <span className={styles.timeStamp}>
                                {formatRelativeTime(reply.createdDate)}
                              </span>
                              <span>•</span>
                              <button className={styles.actionButton}>
                                좋아요 {reply.likeCount}개
                              </button>
                              <button
                                className={styles.actionButton}
                                onClick={() =>
                                  handleReplyClick(
                                    comment.id,
                                    reply.profileName
                                  )
                                }
                              >
                                답글쓰기
                              </button>
                            </div>
                          </div>
                          <button
                            className={styles.likeButton}
                            onClick={() => handleToggleLike(reply.id)}
                          >
                            <Heart
                              size={16}
                              fill={reply.liked ? "#ff3040" : "none"}
                              color={reply.liked ? "#ff3040" : "currentColor"}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </React.Fragment>
              ))}

              {isLoadingMore && (
                <div className={styles.loadingMore}>댓글 불러오는 중...</div>
              )}
            </>
          )}
        </div>
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        message="댓글 기능은 로그인 후 이용 가능합니다."
      />
    </>
  );

  // 모달이 닫혀있으면 아무것도 렌더링하지 않음
  if (!isOpen) return null;

  // React Portal을 사용하여 모달을 document.body에 직접 렌더링
  return ReactDOM.createPortal(modalContent, document.body);
};

export default StyleComment;
