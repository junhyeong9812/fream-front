import React from "react";
import styled from "styled-components";

const PageContainer = styled.div`
  width: 1200px;
  height: 1000px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Heading = styled.h1`
  font-size: 2rem;
  margin-bottom: 20px;
`;

const Paragraph = styled.p`
  font-size: 1.2rem;
  text-align: center;
`;

const ServiceInfoPage: React.FC = () => {
  return (
    <PageContainer>
      <Heading>서비스 소개</Heading>
      <Paragraph>우리 회사가 제공하는 서비스 정보를 소개합니다.</Paragraph>
    </PageContainer>
  );
};

export default ServiceInfoPage;
