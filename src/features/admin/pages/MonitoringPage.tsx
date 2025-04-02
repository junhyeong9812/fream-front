import React, { useState, useEffect, useContext } from "react";
import { FiRefreshCw, FiAlertCircle } from "react-icons/fi";
import styles from "./MonitoringPage.module.css";
import { ThemeContext } from "src/global/context/ThemeContext";

const MonitoringPage: React.FC = () => {
  const { theme } = useContext(ThemeContext);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Kibana 대시보드 URL
  const kibanaUrl = "https://www.pinjun.xyz/kibana/app/dashboards#/view/Metricbeat-system-overview-ecs?embed=true&_g=(refreshInterval:(pause:!t,value:60000),time:(from:now-15m,to:now))";

  // iframe 로딩 이벤트 핸들러
  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  // iframe 에러 이벤트 핸들러
  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // 페이지 새로고침 핸들러
  const handleRefresh = () => {
    setIsLoading(true);
    setHasError(false);
    // iframe을 다시 로드하기 위한 방법
    const iframe = document.getElementById("monitoring-iframe") as HTMLIFrameElement;
    if (iframe) {
      iframe.src = iframe.src;
    }
  };

  // 컴포넌트 마운트 시 타이머 설정
  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      // 15초 후에도 로딩이 완료되지 않으면 오류로 간주
      if (isLoading) {
        setIsLoading(false);
        setHasError(true);
      }
    }, 15000);

    return () => clearTimeout(loadingTimeout);
  }, [isLoading]);

  return (
    <div className={`${styles.monitoringContainer} ${theme === "dark" ? styles.dark : ""}`}>
      <h2 className={styles.pageTitle}>시스템 모니터링</h2>
      
      <div className={styles.monitoringFrame}>
        {isLoading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.loadingSpinner}></div>
          </div>
        )}
        
        {hasError ? (
          <div className={styles.errorContainer}>
            <FiAlertCircle className={styles.errorIcon} />
            <p className={styles.errorMessage}>
              모니터링 대시보드를 불러오는 중 오류가 발생했습니다.
            </p>
            <button className={styles.retryButton} onClick={handleRefresh}>
              <FiRefreshCw style={{ marginRight: "8px" }} /> 새로고침
            </button>
          </div>
        ) : (
          <iframe
            id="monitoring-iframe"
            src={kibanaUrl}
            className={styles.iframe}
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            title="Kibana Dashboard"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        )}
      </div>
    </div>
  );
};

export default MonitoringPage;