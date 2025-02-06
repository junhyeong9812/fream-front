import React from "react";
import styled from "styled-components";
import SubNav from "../components/SubNav";
import { Outlet } from "react-router-dom";

const Container = styled.div`
  margin-left: auto;
  margin-right: auto;
  max-width: 1280px;
  padding: 40px 40px 160px;
  display: flex;
`;

const ContentArea = styled.div`
  flex: 1;
`;

const SupportPage: React.FC = () => {
  return (
    <Container>
      <SubNav />
      {/* 하위 콘텐츠를 렌더링할 Outlet */}
      <ContentArea>
        <Outlet />
      </ContentArea>
    </Container>
  );
};

export default SupportPage;
