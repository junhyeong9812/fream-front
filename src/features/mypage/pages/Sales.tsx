import React, { useState } from "react";
import styled from "styled-components";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import SaleList from "../components/saleList";
import { FaSort } from "react-icons/fa"; // 비활성 상태 아이콘 추가
import { SaleBidResponseDto } from "../types/mypageTypes";

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

const SaleListTab = styled.div`
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
    color: ${({ isActive }) => (isActive ? "#46a049" : "#000")};
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

type Counts = {
  "판매 입찰": number;
  "진행 중": number;
  종료: number;
};

const SaleHead = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 16px;
  justify-content: space-between; /* 좌우로 요소 배치 */
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
const SortButton = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-left: 15px;
  font-size: 14px;
  color: #222;
  position: relative;

  &.active {
    font-weight: bold;
  }

  svg {
    margin-left: 5px;
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
    color: #46a049;
    border-color: #46a049;
  }
`;

const dummySales = {
  "판매 입찰": [
    {
      saleBidId: 1,
      productId: 101,
      productName: "Nike x Comme des Garçons",
      productEnglishName: "Nike x Comme des Garçons",
      size: "250",
      colorName: "Black",
      thumbnailImageUrl: "https://via.placeholder.com/80",
      bidPrice: 50000,
      saleBidStatus: "Pending",
      saleStatus: "Listed",
      shipmentStatus: "대기 중",
      createdDate: new Date("2022-11-23"),
      modifiedDate: new Date(),
    },
  ],
  "진행 중": [
    {
      saleBidId: 2,
      productId: 102,
      productName: "Adidas Yeezy Boost",
      productEnglishName: "Adidas Yeezy Boost",
      size: "260",
      colorName: "White",
      thumbnailImageUrl: "https://via.placeholder.com/80",
      bidPrice: 60000,
      saleBidStatus: "Accepted",
      saleStatus: "In Progress",
      shipmentStatus: "배송 중",
      createdDate: new Date("2022-11-24"),
      modifiedDate: new Date(),
    },
  ],
  종료: [
    {
      saleBidId: 3,
      productId: 103,
      productName: "Jordan 1 Retro High",
      productEnglishName: "Jordan 1 Retro High",
      size: "270",
      colorName: "Red",
      thumbnailImageUrl: "https://via.placeholder.com/80",
      bidPrice: 70000,
      saleBidStatus: "Completed",
      saleStatus: "Sold",
      shipmentStatus: "배송완료",
      createdDate: new Date("2022-11-25"),
      modifiedDate: new Date(),
    },
  ],
};

const SaleHeader: React.FC<{
  onFilterChange: (filter: string) => void;
  onSortChange: (
    field: keyof SaleBidResponseDto, // 정확한 타입으로 수정
    direction: "asc" | "desc" | null
  ) => void;
  sortField: keyof SaleBidResponseDto | null;
  sortDirection: "asc" | "desc" | null;
}> = ({ onFilterChange, onSortChange, sortField, sortDirection }) => {
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

  const handleSortClick = (field: keyof SaleBidResponseDto) => {
    if (sortField === field) {
      const newDirection =
        sortDirection === "asc"
          ? "desc"
          : sortDirection === "desc"
          ? null
          : "asc";
      onSortChange(field, newDirection);
    } else {
      onSortChange(field, "asc");
    }
  };

  return (
    <>
      <SaleHead>
        <FilterButton onClick={() => setIsModalOpen(true)}>
          {selectedFilter}
          <IoIosArrowDown />
        </FilterButton>
        <div style={{ display: "flex", alignItems: "center" }}>
          <SortButton
            className={sortField === "bidPrice" ? "active" : ""}
            onClick={() => handleSortClick("bidPrice")}
          >
            판매 희망가
            {sortField === "bidPrice" ? (
              <>
                {sortDirection === "asc" && <IoIosArrowUp />}
                {sortDirection === "desc" && <IoIosArrowDown />}
                {sortDirection === null && <FaSort />} {/* 정렬 취소 상태 */}
              </>
            ) : (
              <FaSort /> // 비활성 상태에서 위아래 화살표
            )}
          </SortButton>
          <SortButton
            className={sortField === "createdDate" ? "active" : ""}
            onClick={() => handleSortClick("createdDate")}
          >
            만료일
            {sortField === "createdDate" ? (
              <>
                {sortDirection === "asc" && <IoIosArrowUp />}
                {sortDirection === "desc" && <IoIosArrowDown />}
                {sortDirection === null && <FaSort />} {/* 정렬 취소 상태 */}
              </>
            ) : (
              <FaSort /> // 비활성 상태에서 위아래 화살표
            )}
          </SortButton>
        </div>
      </SaleHead>
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

const Sale: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [filter, setFilter] = useState<string>("전체");
  const [saleData, setSaleData] = useState({
    "판매 입찰": dummySales["판매 입찰"],
    "진행 중": dummySales["진행 중"],
    종료: dummySales["종료"],
  });
  const [sortField, setSortField] = useState<keyof SaleBidResponseDto | null>(
    null
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(
    null
  );

  const counts: Counts = {
    "판매 입찰": dummySales["판매 입찰"].length,
    "진행 중": dummySales["진행 중"].length,
    종료: dummySales["종료"].length,
  };

  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
  };

  const handleSortChange = (
    field: keyof SaleBidResponseDto, // 여기를 수정
    direction: "asc" | "desc" | null
  ) => {
    setSortField(field);
    setSortDirection(direction);
  };
  const tabs = Object.keys(saleData) as Array<keyof typeof saleData>;

  const filteredSales = dummySales[tabs[activeTab]].filter((sale) =>
    filter === "전체" ? true : sale.shipmentStatus === filter
  );

  const sortedSales = sortField
    ? [...filteredSales].sort((a, b) => {
        if (sortDirection === "asc")
          return a[sortField]! > b[sortField]! ? 1 : -1;
        if (sortDirection === "desc")
          return a[sortField]! < b[sortField]! ? 1 : -1;
        return 0;
      })
    : filteredSales;
  const currentTab = tabs[activeTab];

  return (
    <PageContainer>
      <MyAccount>
        <ContentTitle>
          <Title>판매 내역</Title>
        </ContentTitle>
        <SaleListTab>
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
        </SaleListTab>
        <SaleHeader
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
          sortField={sortField}
          sortDirection={sortDirection}
        />
        {saleData[currentTab].length === 0 ? (
          <EmptyPage>
            <EmptyText>KREAM을 통해 상품을 판매해 보세요.</EmptyText>
            <SellButton href="/sell">판매하기</SellButton>
          </EmptyPage>
        ) : (
          <SaleList sales={sortedSales} />
        )}
      </MyAccount>
    </PageContainer>
  );
};

export default Sale;
