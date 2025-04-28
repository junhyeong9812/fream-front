import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  NoticeResponseDto,
  backendCategoryToKorean,
} from "../../types/supportTypes";

// 스타일 정의
const ListContainer = styled.ul`
  list-style: none;
  padding: 0;

  li {
    display: flex;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #ddd;
    cursor: pointer;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background-color: #f9f9f9;
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
  flex-grow: 1;
`;

const Title = styled.p`
  font-size: 14px;
  letter-spacing: -0.15px;
  margin: 0;
  font-family: "D2Coding", monospace;
`;

const DateText = styled.span`
  display: inline-block;
  font-size: 12px;
  letter-spacing: -0.06px;
  color: rgba(34, 34, 34, 0.6);
  width: 100px;
  text-align: right;
`;

interface SupportListProps {
  notices: NoticeResponseDto[]; // 공지 데이터 배열
}

const SupportList: React.FC<SupportListProps> = ({ notices }) => {
  const navigate = useNavigate();

  const handleClick = (id: number) => {
    navigate(`/support/notice/${id}`);
  };

  // 날짜 형식 변환 함수 - 문자열 파싱으로 구현
  const formatDate = (dateString: string): string => {
    if (!dateString) return "";

    // ISO 8601 형식(yyyy-MM-ddTHH:mm:ss) 또는 일반 날짜 형식(yyyy-MM-dd) 처리
    const parts = dateString.split("T")[0].split("-");
    if (parts.length === 3) {
      return `${parts[0]}-${parts[1]}-${parts[2]}`;
    }

    return dateString;
  };

  return (
    <ListContainer>
      {notices.map((notice) => {
        // 백엔드 Enum 카테고리를 한글로 변환
        const koreanCategory =
          backendCategoryToKorean[notice.category] || notice.category;

        return (
          <li key={notice.id} onClick={() => handleClick(notice.id)}>
            <Category>{koreanCategory}</Category>
            <TitleBox>
              <Title>{notice.title}</Title>
            </TitleBox>
            <DateText>{formatDate(notice.createdDate)}</DateText>
          </li>
        );
      })}
    </ListContainer>
  );
};

export default SupportList;
