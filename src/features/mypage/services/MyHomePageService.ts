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
export interface OrderBidStatusCountDto {
  pendingCount: number;
  matchedCount: number;
  cancelledOrCompletedCount: number;
}

export interface SaleBidStatusCountDto {
  pendingCount: number;
  matchedCount: number;
  cancelledOrCompletedCount: number;
}

// 백엔드 ResponseDto 구조를 위한 타입
interface ResponseDto<T> {
  data: T;
  success: boolean;
  message: string;
}

// API 요청 함수들
export const getOrderBidCounts =
  async (): Promise<OrderBidStatusCountDto | null> => {
    try {
      const response = await apiClient.get<ResponseDto<OrderBidStatusCountDto>>(
        "/order-bids/count"
      );

      // ResponseDto 구조에서 data 필드 추출
      if (response.data && response.data.data) {
        return response.data.data;
      }

      return null;
    } catch (error) {
      console.error("Failed to fetch order bid counts:", error);
      return null;
    }
  };

export const getSaleBidCounts =
  async (): Promise<SaleBidStatusCountDto | null> => {
    try {
      const response = await apiClient.get<ResponseDto<SaleBidStatusCountDto>>(
        "/sale-bids/count"
      );

      // ResponseDto 구조에서 data 필드 추출
      if (response.data && response.data.data) {
        return response.data.data;
      }

      return null;
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
  // counts가 null이거나 undefined인 경우를 대비한 안전 처리
  if (!counts) {
    return [
      { title: "전체", count: 0, isTotal: true, href: `/${type}/all` },
      { title: "입찰 중", count: 0, isTotal: false, href: `/${type}/bidding` },
      { title: "진행 중", count: 0, isTotal: false, href: `/${type}/progress` },
      { title: "종료", count: 0, isTotal: false, href: `/${type}/complete` },
    ];
  }

  const total =
    (counts.pendingCount || 0) +
    (counts.matchedCount || 0) +
    (counts.cancelledOrCompletedCount || 0);

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
      count: counts.pendingCount || 0,
      isTotal: false,
      href: `${basePath}/bidding`,
    },
    {
      title: statusMapping.MATCHED,
      count: counts.matchedCount || 0,
      isTotal: false,
      href: `${basePath}/progress`,
    },
    {
      title: statusMapping.CANCELLED_OR_COMPLETED,
      count: counts.cancelledOrCompletedCount || 0,
      isTotal: false,
      href: `${basePath}/complete`,
    },
  ];
};
