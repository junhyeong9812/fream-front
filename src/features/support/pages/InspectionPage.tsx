import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import inspectionService from "../services/InspectionService";

// 스타일 정의
const Container = styled.div`
  margin-left: auto;
  margin-right: auto;
  max-width: 1280px;
  padding: 40px 20px;
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

const CategoryContainer = styled.div`
  margin-top: 16px;
`;

const Table = styled.table`
  border: 0;
  border-collapse: collapse;
  border-spacing: 0;
  table-layout: fixed;
  width: 100%;

  tbody {
    display: table-row-group;
    vertical-align: middle;
    border-color: inherit;
  }

  tr {
    display: table-row;
    vertical-align: inherit;
    border-color: inherit;
  }

  td {
    text-align: center;
    border: 1px solid #ebebeb;
    font-size: 16px;
    height: 60px;
    line-height: 60px;
    cursor: pointer;

    span {
      color: rgba(34, 34, 34, 0.5);
    }

    &.category_on {
      font-weight: bold;

      span {
        color: #000;
      }
    }
  }

  td:hover {
    background-color: #eaeaea;
  }
`;

const ContentContainer = styled.div`
  margin-top: 20px;
  padding: 20px 0 19px;

  .description_wrap {
    padding: 20px 0;
    font-size: 14px;
    line-height: 1.6;
    color: #222;

    .description {
      margin-bottom: 10px;
    }

    .description_list {
      list-style: disc;
      margin-left: 20px;

      .list_item {
        margin-bottom: 5px;
      }
    }
  }

  img {
    max-width: 100%;
    height: auto;
  }

  .error-message {
    color: #e53935;
    padding: 20px;
    background-color: #ffebee;
    border-radius: 4px;
  }

  .loading {
    text-align: center;
    padding: 30px;
    color: #757575;
  }
`;

// 데이터 배열 - 백엔드 카테고리와 일치하도록 구성
const categories = [
  ["신발", "아우터 · 상의 · 하의", "가방 · 시계 · 지갑 · 패션잡화"],
  ["테크", "뷰티 · 컬렉터블 · 캠핑 · 가구/리빙", "프리미엄 시계"],
  ["프리미엄 가방"],
];

// 한글 → 영어 매핑 객체
const categoryMapping: Record<string, string> = {
  신발: "SHOES",
  "아우터 · 상의 · 하의": "OUTER",
  "가방 · 시계 · 지갑 · 패션잡화": "BAG",
  테크: "TECH",
  "뷰티 · 컬렉터블 · 캠핑 · 가구/리빙": "BEAUTY",
  "프리미엄 시계": "PREMIUM_WATCH",
  "프리미엄 가방": "PREMIUM_BAG",
};

const InspectionPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("신발"); // 기본값: "신발"
  const [inspectionData, setInspectionData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // 카테고리 변경 핸들러
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    navigate(`?category=${encodeURIComponent(category)}`);
  };

  // 데이터 가져오기
  const fetchData = async (category: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const mappedCategory = categoryMapping[category] || "SHOES"; // 한글 → 영어 매핑
      const response = await inspectionService.getInspectionsByCategory(
        mappedCategory,
        0, // 첫 번째 페이지
        10 // 페이지 크기
      );

      if (response.data.content && response.data.content.length > 0) {
        const content = response.data.content[0]?.content || "";
        setInspectionData(content);
      } else {
        setInspectionData(
          "<p>해당 카테고리의 검수 기준이 아직 등록되지 않았습니다.</p>"
        );
      }
    } catch (error) {
      console.error("API 요청 실패:", error);
      setError(
        "데이터를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
      );
      setInspectionData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 로드 및 카테고리 변경 시 데이터 로드
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get("category") || "신발"; // 기본값: "신발"
    setSelectedCategory(category);
    fetchData(category);
  }, [location.search]);

  return (
    <Container>
      <Title>
        <h3>검수기준</h3>
      </Title>
      <CategoryContainer>
        <Table>
          <tbody>
            {categories.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((category, colIndex) => (
                  <td
                    key={colIndex}
                    className={
                      category === selectedCategory ? "category_on" : ""
                    }
                    onClick={() => handleCategoryChange(category)}
                  >
                    <span>{category}</span>
                  </td>
                ))}
                {/* 빈 셀 채우기 */}
                {row.length < 3 &&
                  Array.from({ length: 3 - row.length }).map(
                    (_, emptyIndex) => <td key={`empty-${emptyIndex}`}></td>
                  )}
              </tr>
            ))}
          </tbody>
        </Table>
      </CategoryContainer>
      <ContentContainer>
        {isLoading ? (
          <div className="description_wrap loading">
            데이터를 불러오는 중입니다...
          </div>
        ) : error ? (
          <div className="description_wrap">
            <p className="error-message">{error}</p>
          </div>
        ) : (
          // HTML 콘텐츠 렌더링
          <div
            className="description_wrap"
            dangerouslySetInnerHTML={{
              __html: inspectionData || "데이터를 불러오는 중입니다.",
            }}
          />
        )}
      </ContentContainer>
    </Container>
  );
};

export default InspectionPage;
