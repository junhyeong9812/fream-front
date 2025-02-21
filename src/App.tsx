// App.tsx
import React, { useEffect, useState } from "react";
import "./App.css";
import Header from "./global/components/header/Header";
import Footer from "./global/components/footer/Footer";
import styled from "styled-components";
import { UserAccessLogDto } from "./global/types/accessLog";
import { sendAccessLog } from "./global/services/accessLogService";
import AppRoutes from "./routers/AppRouters";
import { AuthProvider } from "./global/context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* 전체 높이를 최소한 뷰포트 높이로 설정 */
  width: 100%;
  background-color: white;
  position: relative; /* 포지셔닝 컨텍스트 설정 */
`;

const ContentWrapper = styled.div<{ $headerHeight: number }>`
  position: relative; /* 상대 위치 설정 */
  margin-top: ${({ $headerHeight }) => $headerHeight}px;
  padding-top: 0;
  min-height: calc(100vh - ${({ $headerHeight }) => $headerHeight}px - 200px); /* footer 높이 고려 */
  width: 100%;
  z-index: 1; /* 헤더보다 낮은 z-index */

  /* 미디어 쿼리 추가 */
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

function App() {
  const [headerHeight, setHeaderHeight] = useState(0);

  const updateHeaderHeight = () => {
    const header = document.querySelector("header");
    if (header) {
      const height = header.offsetHeight;
      setHeaderHeight(height);
    }
  };

  useEffect(() => {
    // 초기 헤더 높이 설정
    updateHeaderHeight();

    // ResizeObserver를 사용하여 헤더 크기 변화 감지
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        if (entry.target.tagName.toLowerCase() === 'header') {
          const height = entry.contentRect.height;
          setHeaderHeight(height);
        }
      }
    });

    const header = document.querySelector("header");
    if (header) {
      resizeObserver.observe(header);
    }

    // 윈도우 리사이즈 이벤트 리스너
    window.addEventListener('resize', updateHeaderHeight);

    // 페이지 접속 로그
    const logData: UserAccessLogDto = {
      pageUrl: window.location.pathname,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      devicePixelRatio: window.devicePixelRatio || 1,
      browserLanguage: navigator.language,
    };
    sendAccessLog(logData);

    // 클린업
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateHeaderHeight);
    };
  }, []);

  return (
    <AuthProvider>
      <AppContainer>
        <StyledHeader />
        <ContentWrapper $headerHeight={headerHeight}>
          <AppRoutes />
        </ContentWrapper>
        <Footer />
      </AppContainer>
    </AuthProvider>
  );
}

export default App;