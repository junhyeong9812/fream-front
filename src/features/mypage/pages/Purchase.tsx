import React, { useState } from "react";
import styled from "styled-components";
import { IoIosArrowDown } from "react-icons/io";
import OrderList from "../components/OrderList";

const PageContainer = styled.div`
  padding: 0 20px;
`;

const PageHeader = styled.div`
  display: flex;
  padding-bottom: 16px;
  margin-bottom: 40px;
`;

const Title = styled.h3`
  font-size: 24px;
  line-height: 29px;
  letter-spacing: -0.36px;
  margin: 0;
`;

const MyAccount = styled.div`
  width: 100%;
  margin: 0 auto;
`;

const ContentTitle = styled.div`
  display: flex;
  padding-bottom: 16px;
`;

const PurchaseListTab = styled.div`
  border-radius: 12px;
  display: flex;
  margin-top: 20px;
`;

const TabItem = styled.div<{ isActive: boolean }>`
  flex: 1;
  text-align: center;
  border-bottom: ${({ isActive }) =>
    isActive ? "2px solid #222" : "1px solid #ebebeb"};
  padding: 14px 0;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;

  a {
    font-size: 13px;
    color: ${({ isActive }) => (isActive ? "#222" : "rgba(34, 34, 34, 0.5)")};
    font-weight: ${({ isActive }) => (isActive ? 700 : 400)};
    text-decoration: none;
  }

  .count {
    font-size: 20px;
    font-weight: 700;
    margin-top: 2px;
    color: ${({ isActive }) => (isActive ? "#f15746" : "#000")};
  }
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

type Counts = {
  "구매 입찰": number;
  "진행 중": number;
  종료: number;
};

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

// 더미 데이터 정의
const dummyOrders = {
  "구매 입찰": [
    {
      orderBidId: 1,
      productId: 101,
      productName: "Nike x Comme des Garçons",
      productEnglishName: "Nike x Comme des Garçons",
      size: "250",
      colorName: "Black",
      imageUrl: "https://via.placeholder.com/80",
      bidPrice: 50000,
      bidStatus: "Accepted",
      orderStatus: "Confirmed",
      shipmentStatus: "대기 중",
      createdDate: new Date("2022-11-23"),
      modifiedDate: new Date(),
    },
  ],
  "진행 중": [
    {
      orderBidId: 2,
      productId: 102,
      productName: "Adidas Yeezy Boost",
      productEnglishName: "Adidas Yeezy Boost",
      size: "260",
      colorName: "White",
      imageUrl: "https://via.placeholder.com/80",
      bidPrice: 60000,
      bidStatus: "Accepted",
      orderStatus: "Confirmed",
      shipmentStatus: "배송 중",
      createdDate: new Date("2022-11-24"),
      modifiedDate: new Date(),
    },
  ],
  종료: [
    {
      orderBidId: 3,
      productId: 103,
      productName: "Jordan 1 Retro High",
      productEnglishName: "Jordan 1 Retro High",
      size: "270",
      colorName: "Red",
      imageUrl: "https://via.placeholder.com/80",
      bidPrice: 70000,
      bidStatus: "Completed",
      orderStatus: "Confirmed",
      shipmentStatus: "배송완료",
      createdDate: new Date("2022-11-25"),
      modifiedDate: new Date(),
    },
  ],
};

const PurchaseHeader: React.FC<{
  onFilterChange: (filter: string) => void;
}> = ({ onFilterChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("전체"); // Default value
  const filters = [
    "전체",
    "대기 중",
    "발송완료",
    "입고대기",
    "입고완료",
    "검수 중",
    "검수보류",
    "검수합격",
    "배송 중",
    "거래실패",
    "상품준비 중",
    "반품신청",
    "접수완료",
    "회수 중",
    "회수완료",
    "교환신청",
    "교환 중",
  ];

  const handleFilterClick = (filter: string) => {
    setSelectedFilter(filter); // Update button text
    onFilterChange(filter); // Pass filter value to parent
    setIsModalOpen(false); // Close modal
  };

  return (
    <>
      <PurchaseHead>
        <FilterButton onClick={() => setIsModalOpen(true)}>
          {selectedFilter}
          <IoIosArrowDown />
        </FilterButton>
      </PurchaseHead>
      {isModalOpen && (
        <ModalOverlay>
          <ModalContainer>
            <ModalHeader>선택한 상태 보기</ModalHeader>
            <StatusList>
              {filters.map((filter) => (
                <StatusItem
                  key={filter}
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
  const [activeTab, setActiveTab] = useState<number>(0);
  const [filter, setFilter] = useState<string>("전체");
  const [purchaseData, setPurchaseData] = useState({
    "구매 입찰": dummyOrders["구매 입찰"],
    "진행 중": dummyOrders["진행 중"],
    종료: dummyOrders["종료"],
  });
  // 카운트 데이터
  const counts: Counts = {
    "구매 입찰": dummyOrders["구매 입찰"].length,
    "진행 중": dummyOrders["진행 중"].length,
    종료: dummyOrders["종료"].length,
  };

  // 구매 내역 데이터
  // const purchaseData = {
  //   "구매 입찰": [],
  //   "진행 중": [{ id: 1, title: "진행 중 상품 1" }],
  //   종료: [
  //     { id: 2, title: "종료 상품 1" },
  //     { id: 3, title: "종료 상품 2" },
  //   ],
  // };

  // 탭 변경 핸들러
  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };

  // 현재 탭 이름
  const tabs = Object.keys(purchaseData) as Array<keyof typeof purchaseData>;
  const currentTab = tabs[activeTab];

  return (
    <PageContainer>
      {/* 구매 내역 탭 */}
      <MyAccount>
        <ContentTitle>
          <Title>구매 내역</Title>
        </ContentTitle>
        <PurchaseListTab>
          {tabs.map((tab, index) => (
            <TabItem
              key={tab}
              isActive={activeTab === index}
              onClick={() => handleTabChange(index)}
            >
              <span className="count">{counts[tab]}</span>
              <a href="#">{tab}</a>
            </TabItem>
          ))}
        </PurchaseListTab>
        <PurchaseHeader onFilterChange={setFilter} />
        {/* 구매 내역 데이터 조건부 렌더링 */}
        {purchaseData[currentTab].length === 0 ? (
          <EmptyPage>
            <EmptyText>{`${currentTab} 내역이 없습니다.`}</EmptyText>
            <ShopButton href="/search">SHOP 바로가기</ShopButton>
          </EmptyPage>
        ) : (
          <OrderList orders={dummyOrders[currentTab]} />
        )}
      </MyAccount>
    </PageContainer>
  );
};

export default Purchase;
