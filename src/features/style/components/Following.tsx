import React, { useEffect, useState } from "react";
import styled from "styled-components";
import SortButton from "./SortButton";
import { StyleResponseDto } from "../types/styleTypes";
import StylePostItem from "./StylePostItem";
import Masonry from "react-masonry-css";
import styleService from "../services/styleService";
import { Link } from "react-router-dom";

const Container = styled.div`
  padding-left: 40px;
  padding-right: 40px;
  margin-left: auto;
  margin-right: auto;
  max-width: 1280px;
`;

const ContentContainer = styled.div`
  padding: 16px 40px;
`;

const SortingContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const StyledMasonry = styled(Masonry)`
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  margin-left: -20px;
  width: auto;

  .masonry-grid_column {
    padding-left: 20px;
    background-clip: padding-box;
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 40px 0;
  color: #666;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 0;
  color: #666;
  font-size: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const ExploreButton = styled(Link)`
  display: inline-block;
  padding: 12px 24px;
  background-color: #f0f0f0;
  color: #333;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const Following: React.FC = () => {
  const [styles, setStyles] = useState<StyleResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [scrollThreshold, setScrollThreshold] = useState(50);

  const breakpointColumns = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  const sortOptions = ["추천순", "인기순", "최신순"];
  const [activeSort, setActiveSort] = useState<string>("추천순");

  const handleSortChange = (option: string) => {
    setActiveSort(option);
    setPage(0);
    setStyles([]);

    const filterParams: Record<string, any> = {
      following: true, // 팔로잉 필터 추가
    };

    if (option === "인기순") {
      filterParams.sortBy = "popular";
    } else if (option === "추천순") {
      filterParams.sortBy = "recommended";
    }

    styleService
      .getStyles(0, 10, filterParams)
      .then((response) => {
        setStyles(response.content);
        setHasMore(!response.last);
      })
      .catch((error) => {
        console.error("팔로잉 스타일 로딩 실패:", error);
      });
  };

  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      if (isLoading || !hasMore) return;

      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      const scrollPercentage =
        (scrollTop / (scrollHeight - clientHeight)) * 100;

      const threshold = 50 + page * 5;

      if (scrollPercentage > threshold) {
        setPage((prev) => prev + 1);
        setScrollThreshold(threshold + 5);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading, hasMore, page, scrollThreshold]);

  // 팔로잉 데이터 가져오기
  useEffect(() => {
    const fetchFollowingStyles = async () => {
      setIsLoading(true);
      try {
        const filterParams: Record<string, any> = {
          following: true, // 팔로잉 필터 추가
        };

        if (activeSort === "인기순") {
          filterParams.sortBy = "popular";
        } else if (activeSort === "추천순") {
          filterParams.sortBy = "recommended";
        }

        const response = await styleService.getStyles(page, 10, filterParams);

        setStyles((prev) =>
          page === 0 ? response.content : [...prev, ...response.content]
        );
        setHasMore(!response.last);
      } catch (error) {
        console.error("팔로잉 스타일 목록 로딩 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFollowingStyles();
  }, [page, activeSort]);

  const renderContent = () => {
    if (isLoading && !styles.length) {
      return <LoadingState>로딩 중...</LoadingState>;
    }

    if (!styles.length && !isLoading) {
      return (
        <EmptyState>
          <div>팔로잉한 사용자의 게시물이 없습니다.</div>
          <ExploreButton to="/style/explore">인기글 보기</ExploreButton>
        </EmptyState>
      );
    }

    return (
      <>
        <StyledMasonry
          breakpointCols={breakpointColumns}
          className="masonry-grid"
          columnClassName="masonry-grid_column"
        >
          {styles.map((style) => (
            <StylePostItem key={style.id} {...style} />
          ))}
        </StyledMasonry>
        {isLoading && <LoadingState>로딩 중...</LoadingState>}
        {!hasMore && styles.length > 0 && (
          <EmptyState>더 이상 스타일이 없습니다.</EmptyState>
        )}
      </>
    );
  };

  return (
    <Container>
      <SortingContainer>
        <SortButton
          options={sortOptions}
          activeOption={activeSort}
          onSelect={handleSortChange}
        />
      </SortingContainer>

      <ContentContainer>{renderContent()}</ContentContainer>
    </Container>
  );
};

export default Following;
