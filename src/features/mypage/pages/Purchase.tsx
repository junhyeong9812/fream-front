// src/pages/Purchase.tsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { IoIosArrowDown } from "react-icons/io";
import OrderList from "../components/OrderList";
import PurchaseBoxComponent from "../components/purchaseBoxComponent";
import { orderBidService } from "../services/orderService";
import {
  OrderBidResponseDto,
  OrderBidStatusCountDto,
  BidStatus,
  OrderStatus,
  statusFilters,
  statusFilterMapping,
} from "../types/order";

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

const ShopButton = styled.a`
  border-radius: 10px;
  margin-top: 10px;
  padding: 5px 8px;
  background-color: #fff;
  box-shadow: 0px 0px 0px 1px inset rgba(34, 34, 34, 1);
  color: #222;
  text-decoration: none;
  text-align: center;
  display: inline-block;
  cursor: pointer;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const PurchaseHead = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 16px;
`;

const FilterButton = styled.a`
  display: inline-block;
  background-color: #fff;
  border: 1px solid #ebebeb;
  border-radius: 12px;
  font-size: 13px;
  line-height: 24px;
  padding: 5px 30px 5px 10px;
  position: relative;
  text-decoration: none;
  color: #222;
  cursor: pointer;

  svg {
    position: absolute;
    right: 5px;
    top: 6px;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2000;
`;

const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 400px;
  z-index: 2001;
  padding: 20px;
`;

const ModalHeader = styled.h2`
  font-size: 18px;
  margin-bottom: 20px;
`;

const StatusList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
`;

const StatusItem = styled.li`
  text-align: center;
  padding: 10px;
  border: 1px solid #ebebeb;
  border-radius: 8px;
  cursor: pointer;
  color: #222;

  &:hover {
    background-color: #f5f5f5;
  }

  &.active {
    color: #f15746;
    border-color: #f15746;
  }
`;

const LoadingIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  font-size: 16px;
`;

interface PurchaseHeaderProps {
  onFilterChange: (filter: string) => void;
  currentFilter: string;
}

const PurchaseHeader: React.FC<PurchaseHeaderProps> = ({
  onFilterChange,
  currentFilter,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFilterClick = (filter: string) => {
    onFilterChange(filter);
    setIsModalOpen(false);
  };

  return (
    <>
      <PurchaseHead>
        <FilterButton onClick={() => setIsModalOpen(true)}>
          {currentFilter}
          <IoIosArrowDown />
        </FilterButton>
      </PurchaseHead>
      {isModalOpen && (
        <ModalOverlay onClick={() => setIsModalOpen(false)}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <ModalHeader>선택한 상태 보기</ModalHeader>
            <StatusList>
              {statusFilters.map((filter) => (
                <StatusItem
                  key={filter}
                  className={filter === currentFilter ? "active" : ""}
                  onClick={() => handleFilterClick(filter)}
                >
                  {filter}
                </StatusItem>
              ))}
            </StatusList>
          </ModalContainer>
        </ModalOverlay>
      )}
    </>
  );
};

const Purchase: React.FC = () => {
  // 탭 정의 및 상태
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
  const [filter, setFilter] = useState<string>("전체");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [orders, setOrders] = useState<OrderBidResponseDto[]>([]); // 기본값을 빈 배열로 설정
  const [counts, setCounts] = useState<OrderBidStatusCountDto>({
    pendingCount: 0,
    matchedCount: 0,
    cancelledOrCompletedCount: 0,
  });

  // 탭 매핑 정의
  const tabMapping = [
    {
      title: "구매 입찰",
      bidStatus: BidStatus.PENDING,
      getCount: (c: OrderBidStatusCountDto) => c.pendingCount,
      href: "#purchase-bid",
    },
    {
      title: "진행 중",
      bidStatus: BidStatus.MATCHED,
      getCount: (c: OrderBidStatusCountDto) => c.matchedCount,
      href: "#in-progress",
    },
    {
      title: "종료",
      bidStatus: BidStatus.COMPLETED,
      getCount: (c: OrderBidStatusCountDto) => c.cancelledOrCompletedCount,
      href: "#completed",
    },
  ];

  // 현재 선택된 탭
  const currentTab = tabMapping[activeTabIndex];

  // 상태 카운트 로드
  const loadCounts = async () => {
    try {
      const countData = await orderBidService.getOrderBidStatusCounts();
      if (countData) {
        setCounts(countData);
      }
    } catch (error) {
      console.error("상태별 개수 로드 실패:", error);
    }
  };

  // 주문 데이터 로드
  const loadOrders = async () => {
    setIsLoading(true);
    try {
      // 필터 매핑에서 bidStatus와 orderStatus 가져오기
      const mappedFilter = statusFilterMapping[filter] || {};

      // 기본적으로 탭의 bidStatus를 사용
      let bidStatus: BidStatus | undefined = currentTab.bidStatus;
      let orderStatus: OrderStatus | undefined = undefined;

      // 만약 종료 탭이고 필터가 전체라면, COMPLETED와 CANCELLED 둘 다 포함
      if (activeTabIndex === 2 && filter === "전체") {
        // 종료 탭은 백엔드에서 COMPLETED와 CANCELLED 둘 다 가져오도록 처리
        bidStatus = BidStatus.COMPLETED; // 백엔드에서 이 값을 보고 알아서 COMPLETED와 CANCELLED 모두 가져옴
      }
      // 필터가 있는 경우 필터 적용
      else if (Object.keys(mappedFilter).length > 0) {
        // 매핑된 필터에서 bidStatus나 orderStatus가 있다면 적용
        bidStatus = mappedFilter.bidStatus || bidStatus;
        orderStatus = mappedFilter.orderStatus;
      }

      const response = await orderBidService.getOrderBids(
        bidStatus,
        orderStatus
      );

      // 안전하게 응답 처리
      if (response && response.content) {
        setOrders(response.content);
      } else {
        setOrders([]);
        console.warn(
          "주문 목록을 불러왔으나 예상하지 못한 응답 형식입니다:",
          response
        );
      }
    } catch (error) {
      console.error("주문 목록 로드 실패:", error);
      setOrders([]);
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

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadCounts();
  }, []);

  // 탭 또는 필터 변경 시 주문 데이터 다시 로드
  useEffect(() => {
    loadOrders();
  }, [activeTabIndex, filter]);

  // PurchaseBox 컴포넌트에 사용할 탭 데이터
  const purchaseBoxTabs = tabMapping.map((tab, index) => ({
    title: tab.title,
    count: tab.getCount(counts),
    isTotal: activeTabIndex === index,
    href: tab.href,
  }));

  // PurchaseBox에서 탭 클릭 시 이벤트 처리
  const handlePurchaseBoxTabClick = (href: string) => {
    const tabIndex = tabMapping.findIndex((tab) => tab.href === href);
    if (tabIndex !== -1) {
      handleTabChange(tabIndex);
    }
  };

  return (
    <PageContainer>
      <MyAccount>
        {/* PurchaseBoxComponent를 사용하여 탭 렌더링 */}
        <PurchaseBoxComponent
          title="구매 내역"
          tabs={purchaseBoxTabs}
          onTabClick={handlePurchaseBoxTabClick}
        />

        {/* 필터 헤더 */}
        <PurchaseHeader
          onFilterChange={handleFilterChange}
          currentFilter={filter}
        />

        {/* 주문 목록 또는 빈 상태 표시 */}
        {isLoading ? (
          <LoadingIndicator>로딩 중...</LoadingIndicator>
        ) : orders.length === 0 ? (
          <EmptyPage>
            <EmptyText>{`${currentTab.title} 내역이 없습니다.`}</EmptyText>
            <ShopButton href="/search">SHOP 바로가기</ShopButton>
          </EmptyPage>
        ) : (
          <OrderList orders={orders} />
        )}
      </MyAccount>
    </PageContainer>
  );
};

export default Purchase;
