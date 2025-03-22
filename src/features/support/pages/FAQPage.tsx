import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";
import styled from "styled-components";
import SearchBar from "../components/notice/SearchBar";
import CategoryTabs from "../components/notice/CategoryTabs";
import { FAQResponseDto } from "../types/supportTypes";
import faqService from "../services/FAQService";
import { faqDummyData } from "../services/dummyData";
import FAQList from "../components/FaqList";
import { toast } from "react-toastify";

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

const Pagination = styled.div`
  padding: 28px 0;
  text-align: center;

  button {
    margin: 0 5px;
    padding: 5px 10px;
    border: none;
    background-color: #fff;
    border: 1px solid #ddd;
    cursor: pointer;

    &.active {
      font-weight: bold;
      background-color: #000;
      color: #fff;
    }

    &:hover {
      background-color: #f4f4f4;
    }

    &:disabled {
      background-color: #f8f8f8;
      color: #ccc;
      cursor: not-allowed;
    }
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

const ErrorContainer = styled.div`
  padding: 40px 0;
  text-align: center;
  background-color: #fff;
`;

const ErrorMessage = styled.p`
  color: #f44336;
  font-size: 16px;
  margin-bottom: 20px;
`;

const RetryButton = styled.button`
  background-color: #000;
  color: #fff;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #333;
  }
`;

const LoadingContainer = styled.div`
  padding: 60px 0;
  text-align: center;
`;

const categoryMapping: Record<string, string> = {
  이용정책: "POLICY",
  공통: "GENERAL",
  구매: "BUYING",
  판매: "SELLING",
};
// 역매핑: 영어 → 한글
const reverseCategoryMapping: Record<string, string> = Object.fromEntries(
  Object.entries(categoryMapping).map(([k, v]) => [v, k])
);

const FAQPage: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQResponseDto[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usingDummyData, setUsingDummyData] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { keyword, category } = queryString.parse(location.search);

  const faqsPerPage = 10; // 한 페이지에 보여줄 데이터 개수

  // 데이터 가져오기
  const fetchFaqs = async () => {
    console.log("fetchFaqs 함수 호출됨");
    setLoading(true);
    setError(null);
    setUsingDummyData(false);

    try {
      let response;

      if (keyword) {
        console.log("키워드 검색 조건", keyword);
        response = await faqService.searchFAQs(
          keyword as string,
          currentPage - 1,
          faqsPerPage
        );

        if (response.success) {
          console.log("API 응답 데이터 (키워드 검색):", response.data);
          const transformedFaqs = response.data.content.map((faq) => ({
            ...faq,
            category: reverseCategoryMapping[faq.category] || faq.category,
          }));

          setFaqs(transformedFaqs);
          setTotalPages(response.data.totalPages);
        } else {
          // 에러 상태 설정 - 이미 ErrorHandler에서 toast 처리했으므로 중복 toast는 하지 않음
          setError("키워드 검색 중 오류가 발생했습니다.");
        }
      } else if (category) {
        // 'category' 파라미터가 존재할 때
        console.log("카테고리별 검색 조건", category);

        response = await faqService.getFAQsByCategory(
          category as string,
          currentPage - 1,
          faqsPerPage
        );

        if (response.success) {
          // 데이터 카테고리 한글 변환
          const transformedFaqs = response.data.content.map((faq) => ({
            ...faq,
            category: reverseCategoryMapping[faq.category] || faq.category, // 영어 → 한글 변환
          }));
          console.log("transformedFaqs:", transformedFaqs);

          setFaqs(transformedFaqs); // 변환된 데이터를 설정
          setTotalPages(response.data.totalPages);
        } else {
          setError("카테고리별 FAQ 조회 중 오류가 발생했습니다.");
        }
      } else {
        // 'category' 파라미터가 없을 때
        console.log("전체 FAQ 조회 조건");
        response = await faqService.getFAQs(currentPage - 1, faqsPerPage);

        if (response.success) {
          // 데이터 카테고리 한글 변환
          const transformedFaqs = response.data.content.map((faq) => ({
            ...faq,
            category: reverseCategoryMapping[faq.category] || faq.category, // 영어 → 한글 변환
          }));
          console.log("transformedFaqs:", transformedFaqs);
          setFaqs(transformedFaqs);
          setTotalPages(response.data.totalPages);
        } else {
          setError("FAQ 목록을 불러오는 중 오류가 발생했습니다.");
        }
      }
    } catch (error) {
      console.error("API 요청 처리 중 예상치 못한 오류:", error);
      setError("FAQ 정보를 불러오는 중 예상치 못한 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 더미 데이터 사용 (API 실패 시 대체 데이터)
  const useDummyData = () => {
    console.log("더미 데이터를 사용합니다.");
    setUsingDummyData(true);
    toast.warning("서버 연결에 실패하여 임시 데이터를 표시합니다.");

    // 더미 데이터 필터링
    const filtered = faqDummyData.content.filter((faq) => {
      if (keyword) return faq.question.includes(keyword as string);
      if (category) {
        const categoryValue = category === "전체" ? null : category;
        return !categoryValue || faq.category === categoryValue;
      }
      return true;
    });

    // 더미 데이터에서 페이징 적용
    const startIndex = (currentPage - 1) * faqsPerPage;
    const endIndex = startIndex + faqsPerPage;
    setFaqs(filtered.slice(startIndex, endIndex));
    setTotalPages(Math.ceil(filtered.length / faqsPerPage));
  };

  useEffect(() => {
    console.log("useEffect 호출됨");
    fetchFaqs();
  }, [keyword, category, currentPage]);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
      window.scrollTo(0, 0); // 페이지 상단으로 스크롤
    }
  };

  const handleSearch = (query: string) => {
    if (query.trim() === "" && !keyword) return; // 이미 빈 검색어 상태면 무시

    setCurrentPage(1);
    navigate(`?keyword=${query}&list=true`);
  };

  const handleCategoryChange = (selectedCategory: string) => {
    // 이미 선택된 카테고리라면 무시
    if (
      (selectedCategory === "전체" && !category) ||
      categoryMapping[selectedCategory] === category
    ) {
      return;
    }

    setCurrentPage(1);
    if (selectedCategory === "전체") {
      navigate(`?list=true`); // '전체' 선택 시 'category' 파라미터 제거
    } else {
      const mappedCategory = categoryMapping[selectedCategory];
      navigate(`?category=${mappedCategory}&list=true`);
    }
  };

  // 에러 발생 시 다시 시도 버튼 핸들러
  const handleRetry = () => {
    fetchFaqs();
  };

  return (
    <Container>
      <Title>
        <h3>자주 묻는 질문</h3>
      </Title>

      {location.pathname === "/support/faq" ? (
        <>
          <SearchBar onSearch={handleSearch} />
          {!keyword && (
            <CategoryTabs
              categories={["전체", "이용정책", "공통", "구매", "판매"]}
              activeCategory={
                category
                  ? reverseCategoryMapping[category as string] || "전체"
                  : "전체"
              }
              onCategoryChange={handleCategoryChange}
            />
          )}

          {loading ? (
            <LoadingContainer>
              <p>데이터를 불러오는 중입니다...</p>
            </LoadingContainer>
          ) : error && !usingDummyData ? (
            <ErrorContainer>
              <ErrorMessage>{error}</ErrorMessage>
              <RetryButton onClick={handleRetry}>다시 시도</RetryButton>
            </ErrorContainer>
          ) : faqs.length === 0 ? (
            <NoDataContainer>
              <NoDataMessage>검색하신 결과가 없습니다.</NoDataMessage>
            </NoDataContainer>
          ) : (
            <>
              {usingDummyData && (
                <div
                  style={{
                    margin: "10px 0",
                    color: "#ff9800",
                    textAlign: "center",
                  }}
                >
                  임시 데이터를 표시하고 있습니다.
                </div>
              )}
              <FAQList faqs={faqs} />
              <Pagination>
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                >
                  &laquo;
                </button>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  &lt;
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  // 페이지 버튼의 숫자 계산
                  let pageNum = currentPage;
                  if (currentPage <= 3) {
                    // 현재 페이지가 1~3이면 1~5 표시
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    // 현재 페이지가 마지막에 가까우면 마지막 5개 표시
                    pageNum = totalPages - 4 + i;
                  } else {
                    // 그 외에는 현재 페이지 중심으로 앞뒤로 2개씩
                    pageNum = currentPage - 2 + i;
                  }

                  // 유효한 페이지만 표시
                  if (pageNum > 0 && pageNum <= totalPages) {
                    return (
                      <button
                        key={pageNum}
                        className={currentPage === pageNum ? "active" : ""}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  return null;
                })}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  &gt;
                </button>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  &raquo;
                </button>
              </Pagination>
            </>
          )}
        </>
      ) : (
        <Outlet />
      )}
    </Container>
  );
};

export default FAQPage;
