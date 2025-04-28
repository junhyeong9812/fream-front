import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import dummyData from "../../services/dummyData";
import {
  NoticeResponseDto,
  backendCategoryToKorean,
} from "../../types/supportTypes";
import noticeService from "src/features/support/services/noticeService";

// 스타일 정의
const Container = styled.div`
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  padding: 40px 20px 160px;
  overflow: hidden;
`;

const Header = styled.div`
  align-items: center;
  border-bottom: 1px solid #ebebeb;
  cursor: pointer;
  display: flex;
  padding: 17px 0 19px;
`;

const Category = styled.strong`
  font-size: 14px;
  letter-spacing: -0.21px;
  min-width: 68px;
  width: 68px;
`;

const TitleBox = styled.div`
  margin-right: 10px;
`;

const DateInfo = styled.div`
  display: flex;
  gap: 10px;
  font-size: 12px;
  letter-spacing: -0.06px;
  margin-bottom: 5px;
  color: rgba(34, 34, 34, 0.6);
`;

const DateText = styled.span`
  display: inline-flex;
`;

const Title = styled.p`
  font-size: 15px;
  letter-spacing: -0.15px;
  margin: 0;
`;

const ContentContainer = styled.div`
  display: block;
  margin-top: 20px;

  .content {
    max-width: 640px;
    word-break: break-word;
  }
`;

const BackButtonContainer = styled.div`
  margin-top: 30px;
  text-align: center;
`;

const BackButton = styled.a`
  border: 1px solid #d3d3d3;
  color: rgba(34, 34, 34, 0.8);
  padding: 10px 20px;
  display: inline-block;
  text-decoration: none;
  cursor: pointer;
`;

const AttachmentContainer = styled.div`
  margin-top: 30px;
  border-top: 1px solid #ebebeb;
  padding-top: 20px;
`;

const AttachmentTitle = styled.h4`
  font-size: 14px;
  margin-bottom: 10px;
`;

const AttachmentList = styled.ul`
  list-style: none;
  padding: 0;
`;

const AttachmentItem = styled.li`
  margin-bottom: 5px;

  a {
    color: #007bff;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const NoticeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [notice, setNotice] = useState<NoticeResponseDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotice = async () => {
      setLoading(true);
      try {
        const response = await noticeService.getNotice(Number(id));
        setNotice(response.data);
        setError(null);
      } catch (error) {
        console.error("API 요청 실패:", error);
        setError("공지사항을 불러오는 중 오류가 발생했습니다.");

        // 개발 중 폴백으로 더미 데이터 사용
        const fallback = dummyData.content.find(
          (item) => item.id === Number(id)
        );
        setNotice(fallback || null);
      } finally {
        setLoading(false);
      }
    };

    fetchNotice();
  }, [id]);

  // 날짜 형식 변환 함수 - 문자열 파싱으로 구현 (new Date() 사용 없이)
  const formatDate = (dateString: string): string => {
    if (!dateString) return "";

    // ISO 8601 형식(yyyy-MM-ddTHH:mm:ss) 또는 일반 날짜 형식(yyyy-MM-dd) 처리
    const parts = dateString.split("T")[0].split("-");
    if (parts.length === 3) {
      return `${parts[0]}-${parts[1]}-${parts[2]}`;
    }

    return dateString;
  };

  if (loading) {
    return (
      <Container>
        <p>로딩 중...</p>
      </Container>
    );
  }

  if (error || !notice) {
    return (
      <Container>
        <p>{error || "해당 게시글을 찾을 수 없습니다."}</p>
        <BackButtonContainer>
          <BackButton onClick={() => navigate(-1)}>
            목록으로 돌아가기
          </BackButton>
        </BackButtonContainer>
      </Container>
    );
  }

  // 백엔드 Enum 카테고리를 한글로 변환
  const koreanCategory =
    backendCategoryToKorean[notice.category] || notice.category;

  return (
    <Container>
      <Header>
        <Category>{koreanCategory}</Category>
        <TitleBox>
          <DateInfo>
            <DateText>등록일: {formatDate(notice.createdDate)}</DateText>
            {notice.modifiedDate &&
              notice.modifiedDate !== notice.createdDate && (
                <DateText>수정일: {formatDate(notice.modifiedDate)}</DateText>
              )}
          </DateInfo>
          <Title>{notice.title}</Title>
        </TitleBox>
      </Header>
      <ContentContainer>
        <div
          className="content"
          dangerouslySetInnerHTML={{ __html: notice.content }}
        />
      </ContentContainer>

      {/* 첨부 파일 표시 */}
      {notice.imageUrls && notice.imageUrls.length > 0 && (
        <AttachmentContainer>
          <AttachmentTitle>첨부 파일</AttachmentTitle>
          <AttachmentList>
            {notice.imageUrls.map((url, index) => {
              // URL에서 파일명만 추출
              const fileName = url.split("/").pop() || url;
              return (
                <AttachmentItem key={index}>
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    {fileName}
                  </a>
                </AttachmentItem>
              );
            })}
          </AttachmentList>
        </AttachmentContainer>
      )}

      <BackButtonContainer>
        <BackButton onClick={() => navigate(-1)}>목록으로 돌아가기</BackButton>
      </BackButtonContainer>
    </Container>
  );
};

export default NoticeDetail;
