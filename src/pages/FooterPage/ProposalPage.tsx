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

const ProposalPage: React.FC = () => {
  return (
    <PageContainer>
      <Heading>제휴제안</Heading>
      <Paragraph>제휴 관련 정보를 안내합니다.</Paragraph>
    </PageContainer>
  );
};

export default ProposalPage;
