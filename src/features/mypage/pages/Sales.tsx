// src/pages/Sale.tsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import SaleList from "../components/saleList";
import SalesHeader from "../components/SaleHeader";
import SalesBoxComponent from "../components/saleBoxComponent";
import { saleBidService } from "../services/saleService";
import {
  SaleBidResponseDto,
  SaleBidStatusCountDto,
  BidStatus,
  SaleStatus,
  statusFilterMapping,
} from "../types/sale";

const PageContainer = styled.div`
  padding: 0 20px;
`;

const MyAccount = styled.div`
  width: 100%;
  margin: 0 auto;
`;

const EmptyPage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 192px;
  padding: 56px 28px;
  width: 100%;
`;

const EmptyText = styled.p`
  font-size: 13px;
  color: rgba(0, 0, 0, 0.8);
  text-align: center;
  margin-bottom: 10px;
`;

const SellButton = styled.a`
  border-radius: 10px;
  margin-top: 10px;
  padding: 5px 8px;
  background-color: #46a049; /* 초록색 배경 */
  color: #fff; /* 흰색 글씨 */
  text-decoration: none;
  text-align: center;
  display: inline-block;
  cursor: pointer;

  &:hover {
    background-color: #3e8e41;
  }
`;

const LoadingIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  font-size: 16px;
`;

const Sale: React.FC = () => {
  // 탭 정의 및 상태
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
  const [filter, setFilter] = useState<string>("전체");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sales, setSales] = useState<SaleBidResponseDto[]>([]);
  const [counts, setCounts] = useState<SaleBidStatusCountDto>({
    pendingCount: 0,
    matchedCount: 0,
    cancelledOrCompletedCount: 0,
  });
  const [sortField, setSortField] = useState<keyof SaleBidResponseDto | null>(
    null
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(
    null
  );

  // 탭 매핑 정의
  const tabMapping = [
    {
      title: "판매 입찰",
      bidStatus: BidStatus.PENDING,
      getCount: (c: SaleBidStatusCountDto) => c.pendingCount,
      href: "#sale-bid",
    },
    {
      title: "진행 중",
      bidStatus: BidStatus.MATCHED,
      getCount: (c: SaleBidStatusCountDto) => c.matchedCount,
      href: "#in-progress",
    },
    {
      title: "종료",
      bidStatus: BidStatus.COMPLETED,
      getCount: (c: SaleBidStatusCountDto) => c.cancelledOrCompletedCount,
      href: "#completed",
    },
  ];

  // 현재 선택된 탭
  const currentTab = tabMapping[activeTabIndex];

  // 상태 카운트 로드
  const loadCounts = async () => {
    try {
      const countData = await saleBidService.getSaleBidStatusCounts();
      if (countData) {
        setCounts(countData);
      }
    } catch (error) {
      console.error("상태별 개수 로드 실패:", error);
    }
  };

  // 판매 데이터 로드
  const loadSales = async () => {
    setIsLoading(true);
    try {
      // 필터 매핑에서 bidStatus와 saleStatus 가져오기
      const mappedFilter = statusFilterMapping[filter] || {};

      // 기본적으로 탭의 bidStatus를 사용
      let bidStatus: BidStatus | undefined = currentTab.bidStatus;
      let saleStatus: SaleStatus | undefined = undefined;

      // 만약 종료 탭이고 필터가 전체라면, COMPLETED와 CANCELLED 둘 다 포함
      if (activeTabIndex === 2 && filter === "전체") {
        // 종료 탭은 백엔드에서 COMPLETED와 CANCELLED 둘 다 가져오도록 처리
        bidStatus = BidStatus.COMPLETED; // 백엔드에서 이 값을 보고 알아서 COMPLETED와 CANCELLED 모두 가져옴
      }
      // 필터가 있는 경우 필터 적용
      else if (Object.keys(mappedFilter).length > 0) {
        // 매핑된 필터에서 bidStatus나 saleStatus가 있다면 적용
        bidStatus = mappedFilter.saleBidStatus || bidStatus;
        saleStatus = mappedFilter.saleStatus;
      }

      const response = await saleBidService.getSaleBids(bidStatus, saleStatus);

      // 안전하게 response 처리
      let filteredSales = response?.content || [];

      // 정렬 적용
      if (sortField && filteredSales.length > 0) {
        filteredSales = sortDirection
          ? [...filteredSales].sort((a, b) => {
              // createdDate 필드는 날짜 비교
              if (sortField === "createdDate") {
                const dateA = new Date(a.createdDate);
                const dateB = new Date(b.createdDate);
                return sortDirection === "asc"
                  ? dateA.getTime() - dateB.getTime()
                  : dateB.getTime() - dateA.getTime();
              }

              // bidPrice 필드는 숫자 비교
              if (sortField === "bidPrice") {
                return sortDirection === "asc"
                  ? a.bidPrice - b.bidPrice
                  : b.bidPrice - a.bidPrice;
              }

              return 0;
            })
          : filteredSales;
      }

      setSales(filteredSales);
    } catch (error) {
      console.error("판매 목록 로드 실패:", error);
      setSales([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 탭 변경 시
  const handleTabChange = (index: number) => {
    setActiveTabIndex(index);
    setFilter("전체"); // 탭 변경 시 필터 초기화
  };

  // 필터 변경 시
  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
  };

  // 정렬 변경 시
  const handleSortChange = (
    field: keyof SaleBidResponseDto,
    direction: "asc" | "desc" | null
  ) => {
    setSortField(field);
    setSortDirection(direction);
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadCounts();
  }, []);

  // 탭 또는 필터 변경 시 판매 데이터 다시 로드
  useEffect(() => {
    loadSales();
  }, [activeTabIndex, filter, sortField, sortDirection]);

  // SalesBox 컴포넌트에 사용할 탭 데이터
  const salesBoxTabs = tabMapping.map((tab, index) => ({
    title: tab.title,
    count: isNaN(tab.getCount(counts)) ? 0 : tab.getCount(counts),
    isTotal: activeTabIndex === index,
    href: tab.href,
  }));

  // SalesBox에서 탭 클릭 시 이벤트 처리
  const handleSalesBoxTabClick = (href: string) => {
    const tabIndex = tabMapping.findIndex((tab) => tab.href === href);
    if (tabIndex !== -1) {
      handleTabChange(tabIndex);
    }
  };

  return (
    <PageContainer>
      <MyAccount>
        {/* SalesBoxComponent를 사용하여 탭 렌더링 */}
        <SalesBoxComponent
          title="판매 내역"
          tabs={salesBoxTabs}
          onTabClick={handleSalesBoxTabClick}
        />

        {/* 필터 및 정렬 헤더 */}
        <SalesHeader
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
          sortField={sortField}
          sortDirection={sortDirection}
          currentFilter={filter}
        />

        {/* 판매 목록 또는 빈 상태 표시 */}
        {isLoading ? (
          <LoadingIndicator>로딩 중...</LoadingIndicator>
        ) : sales.length === 0 ? (
          <EmptyPage>
            <EmptyText>Fream을 통해 상품을 판매해 보세요.</EmptyText>
            <SellButton href="/sell">판매하기</SellButton>
          </EmptyPage>
        ) : (
          <SaleList sales={sales} />
        )}
      </MyAccount>
    </PageContainer>
  );
};

export default Sale;
