import React, { useEffect } from "react";
import "./App.css";
import Header from "./global/components/header/Header";
import Footer from "./global/components/footer/Footer";
import styled from "styled-components";
import { UserAccessLogDto } from "./global/types/accessLog";
import { sendAccessLog } from "./global/services/accessLogService";
import AppRoutes from "./routers/AppRouters";
import { AuthProvider } from "./global/context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import { HeaderProvider, useHeader } from "./global/context/HeaderContext";
import FloatingButtons from "./global/components/floatingButtons/FloatingButtons";

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  background-color: white;
  position: relative;
`;

const ContentWrapper = styled.div<{ $headerHeight: number }>`
  position: relative;
  margin-top: ${({ $headerHeight }) => $headerHeight}px;
  padding-top: 0;
  min-height: calc(100vh - ${({ $headerHeight }) => $headerHeight}px - 200px);
  width: 100%;
  z-index: 1;

  @media screen and (min-width: 1200px) {
    margin-top: ${({ $headerHeight }) => $headerHeight}px;
  }
`;

const StyledHeader = styled(Header)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;
`;

const AppContent = () => {
  const { headerHeight, refreshAccessCount } = useHeader();

  useEffect(() => {
    const sendLogAndUpdateCount = async () => {
      // 페이지 접속 로그
      const logData: UserAccessLogDto = {
        pageUrl: window.location.pathname,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        devicePixelRatio: window.devicePixelRatio || 1,
        browserLanguage: navigator.language,
      };

      try {
        // 로그 전송
        await sendAccessLog(logData);
        // 접속자 수 갱신
        await refreshAccessCount();
      } catch (error) {
        console.error("접속 로그 전송 또는 접속자 수 갱신 실패:", error);
      }
    };

    sendLogAndUpdateCount();
  }, [refreshAccessCount]);

  return (
    <AppContainer>
      <StyledHeader />
      <ContentWrapper $headerHeight={headerHeight}>
        <AppRoutes />
      </ContentWrapper>
      <Footer />
      {/* 플로팅 버튼 추가 */}
      <FloatingButtons headerHeight={headerHeight} mobileFooterHeight={64} />
    </AppContainer>
  );
};

function App() {
  return (
    <AuthProvider>
      <HeaderProvider>
        <AppContent />
      </HeaderProvider>
    </AuthProvider>
  );
}

export default App;
