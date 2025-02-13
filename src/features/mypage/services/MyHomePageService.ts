import apiClient from "src/global/services/ApiClient";

// 상태 매핑 타입 정의
interface StatusMapping {
  [key: string]: string;
  PENDING: string;
  MATCHED: string;
  CANCELLED_OR_COMPLETED: string;
}

// 탭 정보 타입 정의
interface Tab {
  title: string;
  count: number;
  isTotal: boolean;
  href: string;
}

// 상태별 한글 매핑
const statusMapping: StatusMapping = {
  PENDING: "입찰 중",
  MATCHED: "진행 중",
  CANCELLED_OR_COMPLETED: "종료",
};

// API 응답 타입 정의
interface OrderBidStatusCountDto {
  pendingCount: number;
  matchedCount: number;
  cancelledOrCompletedCount: number;
}

interface SaleBidStatusCountDto {
  pendingCount: number;
  matchedCount: number;
  cancelledOrCompletedCount: number;
}

// API 요청 함수들
export const getOrderBidCounts = async () => {
  try {
    const response = await apiClient.get<OrderBidStatusCountDto>(
      "/order-bids/count"
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch order bid counts:", error);
    return null;
  }
};

export const getSaleBidCounts = async () => {
  try {
    const response = await apiClient.get<SaleBidStatusCountDto>(
      "/sale-bids/count"
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch sale bid counts:", error);
    return null;
  }
};

// 탭 데이터 생성 함수
export const createTabsData = (
  counts: OrderBidStatusCountDto | SaleBidStatusCountDto,
  type: "purchase" | "sales" | "store"
): Tab[] => {
  const total =
    counts.pendingCount +
    counts.matchedCount +
    counts.cancelledOrCompletedCount;

  const basePath =
    type === "purchase" ? "/purchase" : type === "sales" ? "/sales" : "/store";

  return [
    {
      title: "전체",
      count: total,
      isTotal: true,
      href: `${basePath}/all`,
    },
    {
      title: statusMapping.PENDING,
      count: counts.pendingCount,
      isTotal: false,
      href: `${basePath}/bidding`,
    },
    {
      title: statusMapping.MATCHED,
      count: counts.matchedCount,
      isTotal: false,
      href: `${basePath}/progress`,
    },
    {
      title: statusMapping.CANCELLED_OR_COMPLETED,
      count: counts.cancelledOrCompletedCount,
      isTotal: false,
      href: `${basePath}/complete`,
    },
  ];
};
