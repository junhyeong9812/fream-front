import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import styles from "./PriceChart.module.css";

interface PriceData {
  date: string;
  price: number;
}

interface PriceChartProps {
  productId: string;
  colorName: string;
}

// 날짜 필터링 옵션
type PeriodFilter = "1개월" | "3개월" | "6개월" | "1년" | "전체";

const PriceChart: React.FC<PriceChartProps> = ({ productId, colorName }) => {
  const [data, setData] = useState<PriceData[]>([]);
  const [filteredData, setFilteredData] = useState<PriceData[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodFilter>("1개월");
  const [recentTrades, setRecentTrades] = useState<
    { size: string; price: number; date: string }[]
  >([]);

  // 초기 더미 데이터 생성 (실제로는 API에서 가져올 예정)
  useEffect(() => {
    generateDummyData();
  }, [productId]);

  // 기간 필터 변경 시 데이터 필터링
  useEffect(() => {
    filterDataByPeriod(selectedPeriod);
  }, [selectedPeriod, data]);

  const generateDummyData = () => {
    const dummyData: PriceData[] = [];
    const today = new Date();

    // 1년치 데이터 생성 (실제로는 API에서 가져올 것)
    for (let i = 365; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // 6개월 전 이전 데이터는 거래가 없거나 적음을 가정
      let price = 0;
      if (i < 180) {
        // 6개월 전부터 거래 데이터 생성
        // 상품 거래가 150원을 기준으로 100-300원 사이의 랜덤 가격 생성
        price = Math.floor(Math.random() * (300 - 100 + 1)) + 100;
      }

      const formattedDate = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

      dummyData.push({
        date: formattedDate,
        price: price,
      });
    }

    setData(dummyData);

    // 최근 거래 내역 생성
    const sizes = ["255", "270", "260", "280", "285"];
    const recentTradesData = sizes.map((size) => ({
      size,
      // 최근 거래 내역도 100-300원 사이로 조정
      price: Math.floor(Math.random() * (300 - 100 + 1)) + 100,
      date: "25/03/13",
    }));

    // 150원을 기준으로 하는 거래 추가
    recentTradesData[2] = {
      size: "270",
      price: 150,
      date: "25/03/13",
    };

    setRecentTrades(recentTradesData);
  };

  const filterDataByPeriod = (period: PeriodFilter) => {
    const today = new Date();
    let startDate = new Date(today);

    // 선택된 기간에 따라 시작 날짜 설정
    switch (period) {
      case "1개월":
        startDate.setMonth(today.getMonth() - 1);
        break;
      case "3개월":
        startDate.setMonth(today.getMonth() - 3);
        break;
      case "6개월":
        startDate.setMonth(today.getMonth() - 6);
        break;
      case "1년":
        startDate.setFullYear(today.getFullYear() - 1);
        break;
      case "전체":
        // 모든 데이터 포함
        setFilteredData(data);
        return;
    }

    // 선택된 기간에 해당하는, 데이터만 필터링
    const filtered = data.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate && itemDate <= today;
    });

    setFilteredData(filtered);
  };

  const formatPrice = (value: number) => {
    if (value === 0) return "0";
    return `${value.toLocaleString("ko-KR")}원`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const price = payload[0].value;
      return (
        <div className={styles.customTooltip}>
          <p>{`${label}`}</p>
          <p>{price > 0 ? formatPrice(price) : "거래 없음"}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>시세</h3>

      {/* 기간 필터 버튼 */}
      <div className={styles.periodFilter}>
        {(["1개월", "3개월", "6개월", "1년", "전체"] as PeriodFilter[]).map(
          (period) => (
            <button
              key={period}
              className={`${styles.periodButton} ${
                selectedPeriod === period ? styles.active : ""
              }`}
              onClick={() => setSelectedPeriod(period)}
            >
              {period}
            </button>
          )
        )}
      </div>

      {/* 차트 영역 */}
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={filteredData}
            margin={{ top: 20, right: 20, left: 20, bottom: 10 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f5f5f5"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "#999" }}
              tickFormatter={formatDate}
              tickCount={5}
            />
            <YAxis
              tickFormatter={formatPrice}
              tick={{ fontSize: 11, fill: "#999" }}
              domain={[0, 400]} // Y축 범위를 0-400원으로 설정
              orientation="right"
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#f65e5e"
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 6, fill: "#f65e5e" }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 탭 메뉴 */}
      <div className={styles.tabMenu}>
        <button className={`${styles.tabButton} ${styles.active}`}>
          체결 거래
        </button>
        <button className={styles.tabButton}>판매 입찰</button>
        <button className={styles.tabButton}>구매 입찰</button>
      </div>

      {/* 거래 내역 테이블 */}
      <div className={styles.tradesTable}>
        <div className={styles.tableHeader}>
          <span>사이즈</span>
          <span>가격</span>
          <span>거래일</span>
        </div>
        {recentTrades.map((trade, index) => (
          <div className={styles.tableRow} key={index}>
            <span>{trade.size}</span>
            <span className={index === 2 ? styles.highPrice : ""}>
              {formatPrice(trade.price)}
            </span>
            <span>{trade.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriceChart;
