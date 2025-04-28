import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";
import styled from "styled-components";
import SearchBar from "../components/notice/SearchBar";
import CategoryTabs from "../components/notice/CategoryTabs";
import SupportList from "../components/notice/SupportList";
import PaginationComponent from "../components/notice/PaginationComponent";
import { NoticeResponseDto } from "../types/supportTypes";
import noticeService from "src/features/support/services/noticeService";

// 스타일 정의
const Container = styled.div`
  margin-left: auto;
  margin-right: auto;
  max-width: 1280px;
  padding: 40px 40px 160px;
  overflow: hidden;
`;

const Title = styled.div`
  border-bottom: 3px solid #222;
  padding-bottom: 16px;

  h3 {
    font-size: 24px;
    line-height: 29px;
    letter-spacing: -0.36px;
  }
`;

const NoDataContainer = styled.div`
  background-color: #fff;
  padding: 120px 0 100px;
  position: relative;
  text-align: center;
`;

const NoDataMessage = styled.p`
  color: rgba(34, 34, 34, 0.8);
  font-size: 16px;
  letter-spacing: -0.16px;
`;

const LoadingContainer = styled.div`
  padding: 50px 0;
  text-align: center;
  font-size: 16px;
  color: rgba(34, 34, 34, 0.8);
`;

const ErrorContainer = styled.div`
  padding: 50px 0;
  text-align: center;
  color: #e74c3c;
  font-size: 16px;
`;

const NoticePage: React.FC = () => {
  const [notices, setNotices] = useState<NoticeResponseDto[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { keyword, category } = queryString.parse(location.search);

  const noticesPerPage = 10; // 한 페이지에 보여줄 데이터 개수

  // 데이터 가져오기
  const fetchNotices = async () => {
    setLoading(true);
    setError(null);

    try {
      let response;

      if (keyword && category && category !== "전체") {
        // 카테고리와 키워드로 검색
        response = await noticeService.searchNoticesByCategoryAndKeyword(
          category as string,
          keyword as string,
          currentPage - 1,
          noticesPerPage
        );
      } else if (keyword) {
        // 키워드로만 검색
        response = await noticeService.searchNotices(
          keyword as string,
          currentPage - 1,
          noticesPerPage
        );
      } else if (category && category !== "전체") {
        // 카테고리로만 검색
        response = await noticeService.getNoticesByCategory(
          category as string,
          currentPage - 1,
          noticesPerPage
        );
      } else {
        // 전체 조회
        response = await noticeService.getNotices(
          currentPage - 1,
          noticesPerPage
        );
      }

      setNotices(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("API 요청 실패:", error);
      setError("공지사항을 불러오는 중 오류가 발생했습니다.");
      setNotices([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [keyword, category, currentPage]);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearch = (query: string) => {
    setCurrentPage(1);
    navigate(`?keyword=${query}&list=true`);
  };

  const handleCategoryChange = (selectedCategory: string) => {
    setCurrentPage(1);
    navigate(`?category=${selectedCategory}&list=true`);
  };

  // 현재 경로가 /support/notice인 경우에만 목록 표시, 그 외에는 Outlet 사용
  const isListView = location.pathname === "/support/notice";

  return (
    <Container>
      <Title>
        <h3>공지사항</h3>
      </Title>

      {isListView ? (
        <>
          <SearchBar onSearch={handleSearch} />
          {!keyword && (
            <CategoryTabs
              categories={["전체", "공지", "이벤트", "서비스 안내", "기타"]}
              activeCategory={category ? (category as string) : "전체"}
              onCategoryChange={handleCategoryChange}
            />
          )}

          {loading ? (
            <LoadingContainer>공지사항을 불러오는 중입니다...</LoadingContainer>
          ) : error ? (
            <ErrorContainer>{error}</ErrorContainer>
          ) : notices.length === 0 ? (
            <NoDataContainer>
              <NoDataMessage>검색하신 결과가 없습니다.</NoDataMessage>
            </NoDataContainer>
          ) : (
            <>
              <SupportList notices={notices} />
              <PaginationComponent
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </>
      ) : (
        <Outlet />
      )}
    </Container>
  );
};

export default NoticePage;
