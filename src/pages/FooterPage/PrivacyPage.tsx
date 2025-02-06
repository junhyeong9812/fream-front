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

const PrivacyPage: React.FC = () => {
  return (
    <PageContainer>
      <Heading>개인정보처리방침</Heading>
      <Paragraph>개인정보 처리 방침을 확인하세요.</Paragraph>
    </PageContainer>
  );
};

export default PrivacyPage;
