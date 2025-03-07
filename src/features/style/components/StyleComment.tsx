import React, { useState, useEffect, useContext, useRef } from "react";
import styled from "styled-components";
import { Heart, X } from "lucide-react";
import { formatRelativeTime } from "src/global/utils/timeUtils";
import { AuthContext } from "src/global/context/AuthContext";
import LoginModal from "../../common/components/LoginModal";

// 타입 정의
interface Comment {
  id: number;
  profileId: number;
  profileName: string;
  profileImageUrl: string;
  content: string;
  likeCount: number;
  liked?: boolean;
  createdDate: string;
  replies?: Comment[];
}

interface StyleCommentProps {
  isOpen: boolean;
  onClose: () => void;
  styleId: number;
  styleContent: string;
  styleCreatedDate: string;
  authorProfileName: string;
  authorProfileImage: string;
}

// 스타일 컴포넌트 정의
const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
`;

const CommentModal = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: ${({ isOpen }) => (isOpen ? "0" : "-400px")};
  width: 400px;
  height: 100%;
  background-color: white;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  transition: right 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
`;

const CommentTop = styled.div`
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
`;

const AuthorComment = styled.div`
  display: flex;
  gap: 12px;
`;

const ProfileImage = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  background: #f0f0f0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CommentContent = styled.div`
  flex: 1;
`;

const ProfileName = styled.div`
  font-weight: 600;
  margin-bottom: 4px;
`;

const Content = styled.div`
  font-size: 14px;
  margin-bottom: 8px;
`;

const TimeStamp = styled.div`
  font-size: 12px;
  color: #8e8e8e;
`;

const CommentsContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
`;

const CommentItem = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
`;

const CommentInfo = styled.div`
  flex: 1;
`;

const CommentActions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 4px;
  font-size: 12px;
  color: #8e8e8e;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  color: #8e8e8e;
  font-size: 12px;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const LikeButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const ReplySection = styled.div`
  margin-left: 52px;
  margin-top: 8px;
`;

const ReplyItem = styled(CommentItem)`
  margin-bottom: 8px;
`;

const InputSection = styled.div`
  padding: 16px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const InputBox = styled.div`
  flex: 1;
  border: 1px solid #f0f0f0;
  border-radius: 20px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
`;

const CommentInput = styled.input`
  width: 100%;
  border: none;
  outline: none;
  font-size: 14px;

  &::placeholder {
    color: #8e8e8e;
  }
`;

const PostButton = styled.button<{ active: boolean }>`
  background: none;
  border: none;
  color: ${({ active }) => (active ? "#007bff" : "#8e8e8e")};
  font-weight: ${({ active }) => (active ? "600" : "400")};
  cursor: ${({ active }) => (active ? "pointer" : "default")};
  padding: 0;
`;

const QuickReplyContainer = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 0 0 8px 0;
  margin-bottom: 8px;
`;

const QuickReplyButton = styled.button`
  background: #f0f0f0;
  border: none;
  border-radius: 16px;
  padding: 6px 12px;
  white-space: nowrap;
  font-size: 12px;
  cursor: pointer;

  &:hover {
    background: #e0e0e0;
  }
`;

const StyleComment: React.FC<StyleCommentProps> = ({
  isOpen,
  onClose,
  styleId,
  styleContent,
  styleCreatedDate,
  authorProfileName,
  authorProfileImage,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const { isLoggedIn } = useContext(AuthContext);
  const commentInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // 예시 퀵 리플라이 텍스트
  const quickReplies = [
    "좋아요 ❤️",
    "맞팔해요 😀",
    "정보 부탁해요 🙏",
    "평소 사이즈가 궁금해요 👀",
  ];

  useEffect(() => {
    if (isOpen) {
      // 댓글 데이터 로드
      fetchComments();
    }
  }, [isOpen, styleId]);

  // 클릭 이벤트 처리 - 모달 외부 클릭 시 닫기
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

  // 댓글 데이터 가져오기 (API 호출 예시)
  const fetchComments = async () => {
    setIsLoading(true);
    try {
      // API 호출로 교체
      // const response = await commentService.getComments(styleId);
      // setComments(response.data);

      // 예시 데이터
      setTimeout(() => {
        setComments([
          {
            id: 1,
            profileId: 101,
            profileName: "user1",
            profileImageUrl: "/images/account_img_default.png",
            content: "멋진 스타일이네요!",
            likeCount: 5,
            liked: false,
            createdDate: "2024-02-25T12:30:00",
            replies: [
              {
                id: 3,
                profileId: 103,
                profileName: authorProfileName,
                profileImageUrl: authorProfileImage,
                content: "감사합니다 🙏",
                likeCount: 2,
                liked: false,
                createdDate: "2024-02-25T13:10:00",
              },
            ],
          },
          {
            id: 2,
            profileId: 102,
            profileName: "user2",
            profileImageUrl: "/images/account_img_default.png",
            content: "상품 정보 알 수 있을까요?",
            likeCount: 3,
            liked: true,
            createdDate: "2024-02-24T18:45:00",
          },
        ]);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
      setIsLoading(false);
    }
  };

  // 댓글 작성 함수
  const handlePostComment = () => {
    if (!commentText.trim() || !isLoggedIn) return;

    // API 호출로 교체
    // commentService.postComment(styleId, commentText)
    //   .then((response) => {
    //     setComments([...comments, response.data]);
    //     setCommentText('');
    //   })
    //   .catch((error) => {
    //     console.error('Failed to post comment:', error);
    //   });

    // 예시 구현
    const newComment = {
      id: Date.now(),
      profileId: 999, // 현재 사용자 ID
      profileName: "현재 사용자",
      profileImageUrl: "/images/account_img_default.png",
      content: commentText,
      likeCount: 0,
      liked: false,
      createdDate: new Date().toISOString(),
    };

    setComments([...comments, newComment]);
    setCommentText("");
  };

  // 댓글 좋아요 토글
  const handleToggleLike = (commentId: number) => {
    if (!isLoggedIn) {
      setLoginModalOpen(true);
      return;
    }

    // API 호출로 교체
    // commentService.toggleLike(commentId)
    //   .then(() => {
    //     // 상태 업데이트
    //   })
    //   .catch((error) => {
    //     console.error('Failed to toggle like:', error);
    //   });

    // 예시 구현
    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          const newLiked = !comment.liked;
          return {
            ...comment,
            liked: newLiked,
            likeCount: newLiked ? comment.likeCount + 1 : comment.likeCount - 1,
          };
        }

        // 중첩된 댓글도 확인
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

  return (
    <>
      <ModalOverlay isOpen={isOpen} onClick={onClose} />
      <CommentModal isOpen={isOpen} ref={modalRef}>
        <ModalHeader>
          <Title>댓글</Title>
          <CloseButton onClick={onClose}>
            <X size={24} />
          </CloseButton>
        </ModalHeader>

        <CommentTop>
          <AuthorComment>
            <ProfileImage>
              <img
                src={authorProfileImage || "/api/placeholder/40/40"}
                alt="프로필"
              />
            </ProfileImage>
            <CommentContent>
              <ProfileName>{authorProfileName}</ProfileName>
              <Content>{styleContent}</Content>
              <TimeStamp>{formatRelativeTime(styleCreatedDate)}</TimeStamp>
            </CommentContent>
          </AuthorComment>
        </CommentTop>

        <CommentsContainer>
          {isLoading ? (
            <div style={{ textAlign: "center", padding: "20px" }}>
              로딩 중...
            </div>
          ) : (
            comments.map((comment) => (
              <React.Fragment key={comment.id}>
                <CommentItem>
                  <ProfileImage>
                    <img
                      src={comment.profileImageUrl || "/api/placeholder/40/40"}
                      alt="프로필"
                    />
                  </ProfileImage>
                  <CommentInfo>
                    <ProfileName>{comment.profileName}</ProfileName>
                    <Content>{comment.content}</Content>
                    <CommentActions>
                      <TimeStamp>
                        {formatRelativeTime(comment.createdDate)}
                      </TimeStamp>
                      <span>•</span>
                      <ActionButton>좋아요 {comment.likeCount}개</ActionButton>
                      <ActionButton>답글쓰기</ActionButton>
                    </CommentActions>
                  </CommentInfo>
                  <LikeButton onClick={() => handleToggleLike(comment.id)}>
                    <Heart
                      size={16}
                      fill={comment.liked ? "#ff3040" : "none"}
                      color={comment.liked ? "#ff3040" : "currentColor"}
                    />
                  </LikeButton>
                </CommentItem>

                {comment.replies && comment.replies.length > 0 && (
                  <ReplySection>
                    {comment.replies.map((reply) => (
                      <ReplyItem key={reply.id}>
                        <ProfileImage>
                          <img
                            src={
                              reply.profileImageUrl || "/api/placeholder/40/40"
                            }
                            alt="프로필"
                          />
                        </ProfileImage>
                        <CommentInfo>
                          <ProfileName>{reply.profileName}</ProfileName>
                          <Content>
                            <span
                              style={{ color: "#007bff", marginRight: "4px" }}
                            >
                              @{comment.profileName}
                            </span>
                            {reply.content}
                          </Content>
                          <CommentActions>
                            <TimeStamp>
                              {formatRelativeTime(reply.createdDate)}
                            </TimeStamp>
                            <span>•</span>
                            <ActionButton>
                              좋아요 {reply.likeCount}개
                            </ActionButton>
                            <ActionButton>답글쓰기</ActionButton>
                          </CommentActions>
                        </CommentInfo>
                        <LikeButton onClick={() => handleToggleLike(reply.id)}>
                          <Heart
                            size={16}
                            fill={reply.liked ? "#ff3040" : "none"}
                            color={reply.liked ? "#ff3040" : "currentColor"}
                          />
                        </LikeButton>
                      </ReplyItem>
                    ))}
                  </ReplySection>
                )}
              </React.Fragment>
            ))
          )}
        </CommentsContainer>

        <InputSection>
          <ProfileImage>
            <img
              src={
                isLoggedIn
                  ? "/images/account_img_default.png"
                  : "/api/placeholder/40/40"
              }
              alt="프로필"
            />
          </ProfileImage>
          <div style={{ flex: 1 }}>
            <QuickReplyContainer>
              {quickReplies.map((text, index) => (
                <QuickReplyButton
                  key={index}
                  onClick={() => handleQuickReplyClick(text)}
                >
                  {text}
                </QuickReplyButton>
              ))}
            </QuickReplyContainer>
            <InputBox>
              <CommentInput
                ref={commentInputRef}
                placeholder="댓글을 남기세요..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onFocus={handleCommentInputFocus}
              />
              <PostButton
                active={!!commentText.trim() && isLoggedIn}
                onClick={handlePostComment}
                disabled={!commentText.trim() || !isLoggedIn}
              >
                등록
              </PostButton>
            </InputBox>
          </div>
        </InputSection>
      </CommentModal>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        message="댓글 기능은 로그인 후 이용 가능합니다."
      />
    </>
  );
};

export default StyleComment;
