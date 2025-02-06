import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import dummyData from "../../services/dummyData";
import { NoticeResponseDto } from "../../types/supportTypes";
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

const Date = styled.span`
  display: inline-flex;
  font-size: 12px;
  letter-spacing: -0.06px;
  margin-bottom: 1px;
  color: rgba(34, 34, 34, 0.6);
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

const NoticeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [notice, setNotice] = useState<NoticeResponseDto | null>(null);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const response = await noticeService.getNotice(Number(id));
        setNotice(response.data);
      } catch (error) {
        console.error("API 요청 실패:", error);
        const fallback = dummyData.content.find(
          (item) => item.id === Number(id)
        );
        setNotice(fallback || null);
      }
    };

    fetchNotice();
  }, [id]);

  if (!notice) {
    return (
      <Container>
        <p>해당 게시글을 찾을 수 없습니다.</p>
        <BackButtonContainer>
          <BackButton onClick={() => navigate(-1)}>
            목록으로 돌아가기
          </BackButton>
        </BackButtonContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Category>{notice.category}</Category>
        <TitleBox>
          <Date>{notice.createdAt}</Date>
          <Title>{notice.title}</Title>
        </TitleBox>
      </Header>
      <ContentContainer>
        <div
          className="content"
          dangerouslySetInnerHTML={{ __html: notice.content }}
        />
      </ContentContainer>
      <BackButtonContainer>
        <BackButton onClick={() => navigate(-1)}>목록으로 돌아가기</BackButton>
      </BackButtonContainer>
    </Container>
  );
};

export default NoticeDetail;
