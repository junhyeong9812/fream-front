import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

// 스타일 정의
const ListContainer = styled.ul`
  list-style: none;
  padding: 0;

  li {
    display: flex;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #ddd;

    &:last-child {
      border-bottom: none;
    }
  }
`;

const Category = styled.strong`
  font-size: 14px;
  letter-spacing: -0.21px;
  min-width: 68px;
  width: 120px;
`;

const TitleBox = styled.div`
  margin-right: 10px;
`;

const Title = styled.p`
  font-size: 14px;
  letter-spacing: -0.15px;
  margin: 0;
  font-family: "D2Coding", monospace;
`;

interface SupportListProps {
  notices: { id: number; category: string; title: string }[]; // 공지 데이터 배열
}
// 1) "영어 → 한글" 매핑 객체
const noticeCategoryToKorean: Record<string, string> = {
  ANNOUNCEMENT: "공지",
  EVENT: "이벤트",
  SERVICE: "서비스 안내",
  OTHERS: "기타",
};
const SupportList: React.FC<SupportListProps> = ({ notices }) => {
  const navigate = useNavigate();

  const handleClick = (id: number) => {
    navigate(`/support/notice/${id}`);
  };
  return (
    <ListContainer>
      {notices.map((notice) => {
        // 2) 영어 category → 한글 category
        const koreanCategory =
          noticeCategoryToKorean[notice.category] || notice.category;

        return (
          <li key={notice.id} onClick={() => handleClick(notice.id)}>
            <Category>{koreanCategory}</Category>
            <TitleBox>
              <Title>{notice.title}</Title>
            </TitleBox>
          </li>
        );
      })}
    </ListContainer>
  );
};

export default SupportList;
