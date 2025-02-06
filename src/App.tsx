import React, { useEffect, useState } from "react";
import "./App.css";
import Header from "./global/components/header/Header";
import Footer from "./global/components/footer/Footer";
import styled from "styled-components";
import { UserAccessLogDto } from "./global/types/accessLog";
import { sendAccessLog } from "./global/services/accessLogService";
import AppRoutes from "./routers/AppRouters";
import { AuthProvider } from "./global/context/AuthContext";

// App 전체 컨테이너
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh; /* 전체 화면 높이 */
  width: 100%;
  background-color: white;
`;

// Header와 겹치지 않게 컨텐츠에 top-margin 적용
const ContentWrapper = styled.div<{ $headerHeight: number }>`
  margin-top: ${({ $headerHeight }) => $headerHeight}px;
`;

function App() {
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const header = document.querySelector("header");
    if (header) {
      setHeaderHeight(header.offsetHeight); // Header 높이를 상태로 저장
    }
    // 페이지 접속 시점(컴포넌트 mount)에 로그 전송
    const logData: UserAccessLogDto = {
      pageUrl: window.location.pathname,
      // 여기서 필요한 경우, OS/browser/화면크기 등 추가
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      devicePixelRatio: window.devicePixelRatio || 1,
      browserLanguage: navigator.language,
    };

    sendAccessLog(logData);
  }, []);
  return (
    <AuthProvider>
      <AppContainer>
        <Header /> {/* AppContainer 내부에 위치 */}
        <ContentWrapper $headerHeight={headerHeight}>
          <AppRoutes />
        </ContentWrapper>
        <Footer />
      </AppContainer>
    </AuthProvider>
  );
}

export default App;
