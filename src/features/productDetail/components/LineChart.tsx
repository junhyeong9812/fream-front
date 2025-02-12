import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import styles from "./LineChart.module.css";

interface LineChartProps {
  productId: string;
  colorName: string;
  // colorName prop은 제거 또는 아래처럼 추가
  // colorName?: string; // optional로 설정
}

const LineChart: React.FC<LineChartProps> = ({ productId, colorName }) => {
  // 데이터 타입을 [string, number][]로 명시적 지정
  const [data, setData] = useState<Array<[string, string | number]>>([
    ["Date", "Price"],
  ]);

  useEffect(() => {
    const generateDummyData = () => {
      const dummyData: Array<[string, string | number]> = [["Date", "Price"]];
      const today = new Date();

      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        // 랜덤 가격 생성 (270,000 ~ 320,000 사이)
        const randomPrice =
          Math.floor(Math.random() * (320000 - 270000 + 1)) + 270000;

        // 날짜 포맷팅 (MM/DD 형식)
        const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;

        dummyData.push([formattedDate, randomPrice]);
      }

      setData(dummyData);
    };

    generateDummyData();
  }, [productId]);

  const options = {
    title: "시세",
    titleTextStyle: {
      fontSize: 19,
      bold: true,
      color: "#333",
    },
    hAxis: {
      title: "",
      textPosition: "out",
      textStyle: {
        color: "#999",
        fontSize: 11,
      },
      gridlines: {
        color: "#f5f5f5",
      },
    },
    vAxis: {
      title: "",
      textStyle: {
        color: "#999",
        fontSize: 11,
      },
      gridlines: {
        color: "#f5f5f5",
      },
      format: "currency",
      formatOptions: {
        currency: "KRW",
        prefix: "₩",
      },
    },
    legend: { position: "none" },
    curveType: "function",
    chartArea: { width: "85%", height: "75%" },
    backgroundColor: "#ffffff",
    colors: ["#41B979"],
    lineWidth: 2,
    pointSize: 5,
    animation: {
      startup: true,
      duration: 1000,
      easing: "out",
    },
  };

  return (
    <div className={styles.chartContainer}>
      <Chart
        width="100%"
        height="400px"
        chartType="LineChart"
        loader={<div className={styles.loading}>Loading Chart</div>}
        data={data}
        options={options}
      />
    </div>
  );
};

export default LineChart;
