import React, { useState, useEffect, useContext } from "react";
import { ThemeContext } from "src/global/context/ThemeContext";
import { ChatQuestionService } from "../services/chatQuestionService";
import { GPTUsageStatsDto, DailyUsageDto } from "../types/chatQuestionTypes";
import LoadingSpinner from "src/global/components/common/LoadingSpinner";
import ErrorMessage from "src/global/components/common/ErrorMessage";
import styles from "./GPTUsageStatsPage.module.css";
import { FiBarChart2, FiDollarSign, FiFileText } from "react-icons/fi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Sector,
} from "recharts";

/**
 * GPT 사용량 통계 페이지
 * GPT API 사용량 통계를 시각화하여 보여주는 페이지
 */
const GPTUsageStatsPage: React.FC = () => {
  const { theme } = useContext(ThemeContext);
  const [usageStats, setUsageStats] = useState<GPTUsageStatsDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>(() => {
    // 기본값: 1개월 전 날짜
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState<string>(() => {
    // 기본값: 오늘 날짜
    return new Date().toISOString().split("T")[0];
  });
  const [totalTokens, setTotalTokens] = useState<number>(0);

  // 색상 설정
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#FF6B6B",
  ];
  const darkThemeColors = {
    text: "#E0E0E0",
    background: "#2D3748",
    gridLines: "#4A5568",
    tooltipBackground: "#1A202C",
  };
  const lightThemeColors = {
    text: "#2D3748",
    background: "#FFFFFF",
    gridLines: "#E2E8F0",
    tooltipBackground: "#F7FAFC",
  };
  const themeColors = theme === "dark" ? darkThemeColors : lightThemeColors;

  // 사용량 통계 조회
  useEffect(() => {
    const fetchUsageStats = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 전체 누적 토큰 사용량 조회
        const totalTokensData = await ChatQuestionService.getTotalTokensUsed();
        setTotalTokens(totalTokensData);

        // 특정 기간 사용량 통계 조회
        const statsData = await ChatQuestionService.getGPTUsageStats(
          startDate,
          endDate
        );
        setUsageStats(statsData);
      } catch (error) {
        console.error("사용량 통계 조회 오류:", error);
        setError("사용량 통계를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsageStats();
  }, [startDate, endDate]);

  // 날짜 범위 변경 핸들러
  const handleDateRangeChange = () => {
    if (new Date(startDate) > new Date(endDate)) {
      setError("시작 날짜는 종료 날짜보다 이전이어야 합니다.");
      return;
    }

    // 6개월 제한
    const sixMonthsLater = new Date(startDate);
    sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);

    if (new Date(endDate) > sixMonthsLater) {
      setError("조회 기간은 최대 6개월까지 가능합니다.");
      return;
    }

    setError(null);
    setIsLoading(true);
    // useEffect가 새로운 날짜로 데이터를 다시 불러옴
  };

  // 모델별 사용량 데이터 변환
  const getModelUsageData = () => {
    if (!usageStats) return [];

    return Object.entries(usageStats.usageByModel).map(([name, value]) => ({
      name: name,
      value: value,
    }));
  };

  // 요청 유형별 사용량 데이터 변환
  const getRequestTypeUsageData = () => {
    if (!usageStats) return [];

    return Object.entries(usageStats.usageByRequestType).map(
      ([name, value]) => ({
        name: name,
        value: value,
      })
    );
  };

  // 일별 사용량 차트 렌더링
  const renderDailyUsageChart = () => {
    if (!usageStats || !usageStats.dailyUsage.length) return null;

    return (
      <div className={styles.chartContainer}>
        <h3 className={styles.chartTitle}>
          <FiBarChart2 /> 일별 토큰 사용량
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={usageStats.dailyUsage}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={themeColors.gridLines}
            />
            <XAxis
              dataKey="date"
              stroke={themeColors.text}
              tick={{ fill: themeColors.text }}
            />
            <YAxis
              stroke={themeColors.text}
              tick={{ fill: themeColors.text }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: themeColors.tooltipBackground,
                color: themeColors.text,
                border: `1px solid ${themeColors.gridLines}`,
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="tokenCount"
              name="토큰 수"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // 모델별 사용량 차트 렌더링
  const renderModelUsageChart = () => {
    const modelData = getModelUsageData();
    if (!modelData.length) return null;

    return (
      <div className={styles.chartContainer}>
        <h3 className={styles.chartTitle}>
          <FiBarChart2 /> 모델별 토큰 사용량
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={modelData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {modelData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => `${value.toLocaleString()} 토큰`}
              contentStyle={{
                backgroundColor: themeColors.tooltipBackground,
                color: themeColors.text,
                border: `1px solid ${themeColors.gridLines}`,
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // 요청 유형별 사용량 차트 렌더링
  const renderRequestTypeUsageChart = () => {
    const requestTypeData = getRequestTypeUsageData();
    if (!requestTypeData.length) return null;

    return (
      <div className={styles.chartContainer}>
        <h3 className={styles.chartTitle}>
          <FiBarChart2 /> 요청 유형별 토큰 사용량
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={requestTypeData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={themeColors.gridLines}
            />
            <XAxis
              dataKey="name"
              stroke={themeColors.text}
              tick={{ fill: themeColors.text }}
            />
            <YAxis
              stroke={themeColors.text}
              tick={{ fill: themeColors.text }}
            />
            <Tooltip
              formatter={(value: number) => `${value.toLocaleString()} 토큰`}
              contentStyle={{
                backgroundColor: themeColors.tooltipBackground,
                color: themeColors.text,
                border: `1px solid ${themeColors.gridLines}`,
              }}
            />
            <Legend />
            <Bar dataKey="value" name="토큰 수" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // 요약 정보 카드 렌더링
  const renderSummaryCards = () => {
    return (
      <div className={styles.summaryCards}>
        <div
          className={`${styles.card} ${theme === "dark" ? styles.dark : ""}`}
        >
          <div className={styles.cardIcon}>
            <FiBarChart2 size={24} />
          </div>
          <div className={styles.cardContent}>
            <h3>기간 내 총 사용량</h3>
            <p className={styles.cardValue}>
              {usageStats ? usageStats.totalTokensUsed.toLocaleString() : 0}{" "}
              토큰
            </p>
          </div>
        </div>

        <div
          className={`${styles.card} ${theme === "dark" ? styles.dark : ""}`}
        >
          <div className={styles.cardIcon}>
            <FiDollarSign size={24} />
          </div>
          <div className={styles.cardContent}>
            <h3>기간 내 예상 비용</h3>
            <p className={styles.cardValue}>
              $
              {usageStats
                ? (usageStats.estimatedCost / 100).toFixed(2)
                : "0.00"}
            </p>
          </div>
        </div>

        <div
          className={`${styles.card} ${theme === "dark" ? styles.dark : ""}`}
        >
          <div className={styles.cardIcon}>
            <FiFileText size={24} />
          </div>
          <div className={styles.cardContent}>
            <h3>총 누적 사용량</h3>
            <p className={styles.cardValue}>
              {totalTokens.toLocaleString()} 토큰
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`${styles.container} ${theme === "dark" ? styles.dark : ""}`}
    >
      <div className={styles.header}>
        <h1 className={styles.title}>GPT 사용량 통계</h1>
        <div className={styles.dateRangeSelector}>
          <div className={styles.dateInputGroup}>
            <label htmlFor="startDate">시작 날짜:</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={styles.dateInput}
            />
          </div>
          <div className={styles.dateInputGroup}>
            <label htmlFor="endDate">종료 날짜:</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={styles.dateInput}
            />
          </div>
          <button
            className={styles.searchButton}
            onClick={handleDateRangeChange}
          >
            조회
          </button>
        </div>
      </div>

      {error && (
        <ErrorMessage
          message={error}
          onRetry={handleDateRangeChange}
          theme={theme}
        />
      )}

      {isLoading ? (
        <LoadingSpinner
          size="large"
          text="GPT 사용량 통계를 불러오고 있습니다..."
        />
      ) : (
        <>
          {usageStats && (
            <>
              {renderSummaryCards()}

              <div className={styles.chartsContainer}>
                {renderDailyUsageChart()}
                <div className={styles.chartRow}>
                  {renderModelUsageChart()}
                  {renderRequestTypeUsageChart()}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default GPTUsageStatsPage;
