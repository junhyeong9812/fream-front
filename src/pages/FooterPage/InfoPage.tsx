import React from "react";
import styled from "styled-components";

const PageContainer = styled.div`
  width: 1200px;
  height: 1000px;
  margin: 0 auto; /* 페이지를 가운데 정렬 */
  display: flex;
  justify-content: center; /* 가로 중앙 정렬 */
  align-items: center; /* 세로 중앙 정렬 */
  flex-direction: column; /* h1과 p를 세로로 배치 */
`;

const Heading = styled.h1`
  font-size: 2rem;
  margin-bottom: 20px;
  color: #333;
`;

const Paragraph = styled.p`
  font-size: 1.2rem;
  color: #666;
  text-align: center;
`;

const InfoPage: React.FC = () => {
  return (
    <PageContainer>
      <Heading>회사소개</Heading>
      <Paragraph>회사에 대한 정보를 소개하는 페이지입니다.</Paragraph>
    </PageContainer>
  );
};

export default InfoPage;
