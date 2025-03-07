import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import {
  Heart,
  MessageCircle,
  Bookmark,
  Download,
  MoreHorizontal,
} from "lucide-react";
import {
  StyleDetailResponseDto,
  ProfileStyleResponseDto,
} from "../types/styleTypes";
import styleService from "../services/styleService";
import styleLikeService from "../services/StyleLikeService";
import styleBookmarkService from "../services/StyleBookmarkService";
import { formatRelativeTime } from "src/global/utils/timeUtils";
import { AuthContext } from "src/global/context/AuthContext";
import LoginModal from "../../common/components/LoginModal";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 0 20px;
`;

const PostContainer = styled.div`
  width: 100%;
  background: #fff;
  margin-bottom: 32px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
`;

const ProfileImage = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
  overflow: hidden;
  background: #f0f0f0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const Username = styled.div`
  font-weight: bold;
`;

const TimeStamp = styled.div`
  font-size: 12px;
  color: #8e8e8e;
`;

const StyleImage = styled.div`
  width: 100%;
  aspect-ratio: 1;
  background: #f0f0f0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const IconSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
`;

const IconGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: inherit;

  &:hover {
    opacity: 0.8;
  }
`;

const Content = styled.p`
  padding: 0 16px 16px;
  font-size: 14px;
`;

const ProductSection = styled.div`
  padding: 16px;
  border-top: 1px solid #f0f0f0;
`;

const ProductTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
`;

const ProductCard = styled.div`
  display: flex;
  gap: 12px;
`;

const ProductImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
`;

const ProductInfo = styled.div`
  flex: 1;
`;

const OtherStylesSection = styled.div`
  width: 100%;
  max-width: 1280px;
  margin: 40px auto;
`;

const OtherStylesTitle = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const StyleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StyleCard = styled.div`
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const StyleDetailPage = () => {
  const [styleDetail, setStyleDetail] = useState<StyleDetailResponseDto | null>(
    null
  );
  const [otherStyles, setOtherStyles] = useState<ProfileStyleResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pathSegments = window.location.pathname.split("/");
        const styleId = parseInt(pathSegments[pathSegments.length - 1]);

        if (isNaN(styleId)) {
          console.error("Invalid style ID");
          return;
        }

        const detailData = await styleService.getStyleDetail(styleId);
        setStyleDetail(detailData);

        // 백엔드에서 제공한 좋아요 및 북마크 초기 상태 설정
        setIsLiked(detailData.liked || false);
        setIsBookmarked(detailData.interested || false);

        const profileData = await styleService.getProfileStyles(
          detailData.profileId
        );
        setOtherStyles(profileData.filter((style) => style.id !== styleId));

        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch style data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // 좋아요 토글 함수
  const toggleLike = async () => {
    if (isProcessing) return; // 이미 처리 중이면 중복 요청 방지

    if (!isLoggedIn) {
      setLoginModalOpen(true);
      return;
    }

    setIsProcessing(true);

    try {
      if (styleDetail) {
        const success = await styleLikeService.toggleLike(styleDetail.id);

        if (success) {
          setIsLiked((prev) => !prev);
          // 좋아요 수도 업데이트
          setStyleDetail((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              likeCount: isLiked ? prev.likeCount - 1 : prev.likeCount + 1,
            };
          });
        }
      }
    } catch (error) {
      console.error("좋아요 처리 실패", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // 북마크(관심) 토글 함수
  const toggleBookmark = async () => {
    if (isProcessing) return;

    if (!isLoggedIn) {
      setLoginModalOpen(true);
      return;
    }

    setIsProcessing(true);

    try {
      if (styleDetail) {
        const success = await styleBookmarkService.toggleBookmark(
          styleDetail.id
        );

        if (success) {
          setIsBookmarked((prev) => !prev);
        }
      }
    } catch (error) {
      console.error("북마크 처리 실패", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading || !styleDetail) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>로딩중...</div>
    );
  }

  return (
    <Wrapper>
      <PostContainer>
        <ProfileSection>
          <ProfileImage>
            <img
              src={styleDetail.profileImageUrl || "/api/placeholder/40/40"}
              alt="프로필"
            />
          </ProfileImage>
          <ProfileInfo>
            <Username>{styleDetail.profileName}</Username>
            <TimeStamp>{formatRelativeTime(styleDetail.createdDate)}</TimeStamp>
          </ProfileInfo>
          <IconButton>
            <MoreHorizontal size={20} />
          </IconButton>
        </ProfileSection>

        <StyleImage>
          <img src={styleDetail.mediaUrls[0]} alt="스타일 이미지" />
        </StyleImage>

        <IconSection>
          <IconButton>
            <Download size={24} />
          </IconButton>
          <IconGroup>
            <IconButton onClick={toggleLike} disabled={isProcessing}>
              <Heart
                size={24}
                fill={isLiked ? "#ff3040" : "none"}
                color={isLiked ? "#ff3040" : "currentColor"}
              />
              <span>{styleDetail.likeCount}</span>
            </IconButton>
            <IconButton>
              <MessageCircle size={24} />
              <span>{styleDetail.commentCount}</span>
            </IconButton>
            <IconButton onClick={toggleBookmark} disabled={isProcessing}>
              <Bookmark
                size={24}
                fill={isBookmarked ? "currentColor" : "none"}
              />
            </IconButton>
          </IconGroup>
        </IconSection>

        <Content>{styleDetail.content}</Content>

        {styleDetail.productInfos?.length > 0 && (
          <ProductSection>
            <ProductTitle>스타일 제품</ProductTitle>
            <ProductGrid>
              {styleDetail.productInfos.map((product, index) => (
                <ProductCard key={index}>
                  <ProductImage
                    src={product.thumbnailImageUrl || "/api/placeholder/60/60"}
                    alt={product.productName}
                  />
                  <ProductInfo>
                    <div style={{ fontWeight: 500 }}>{product.productName}</div>
                    <div style={{ fontSize: "12px", color: "#8e8e8e" }}>
                      {product.productEnglishName}
                    </div>
                    <div style={{ fontWeight: 600 }}>
                      {product.minSalePrice.toLocaleString()}원
                    </div>
                  </ProductInfo>
                </ProductCard>
              ))}
            </ProductGrid>
          </ProductSection>
        )}
      </PostContainer>

      {otherStyles.length > 0 && (
        <OtherStylesSection>
          <OtherStylesTitle>
            {styleDetail.profileName}님의 다른 스타일
          </OtherStylesTitle>
          <StyleGrid>
            {otherStyles.map((style, index) => (
              <StyleCard
                key={index}
                onClick={() => {
                  window.location.href = `/style/${style.id}`;
                }}
              >
                <img
                  src={style.mediaUrl || "/api/placeholder/200/200"}
                  alt={`스타일 ${index + 1}`}
                />
              </StyleCard>
            ))}
          </StyleGrid>
        </OtherStylesSection>
      )}

      {/* 로그인 모달 */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        message="좋아요/북마크 기능은 로그인 후 이용 가능합니다."
      />
    </Wrapper>
  );
};

export default StyleDetailPage;
