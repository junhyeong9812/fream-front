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

const StoreInfoPage: React.FC = () => {
  return (
    <PageContainer>
      <Heading>스토어 안내</Heading>
      <Paragraph>스토어 관련 정보를 확인하세요.</Paragraph>
    </PageContainer>
  );
};

export default StoreInfoPage;
