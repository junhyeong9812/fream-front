// src/pages/MyHomePage.tsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ShortcutGridComponent from "../components/shortcutGridComponent";
import PurchaseBoxComponent from "../components/purchaseBoxComponent";
import ListBoxComponent from "../components/listBoxComponents";
import InterestProduct from "../components/interestProduct";
import {
  createTabsData,
  getOrderBidCounts,
  getSaleBidCounts,
  OrderBidStatusCountDto,
  SaleBidStatusCountDto,
} from "../services/MyHomePageService";
import { ProfileData } from "../types/profile";
import { getProfileInfo } from "../services/ProfileService";

// 탭 인터페이스 정의
interface Tab {
  title: string;
  count: number;
  isTotal: boolean;
  href: string;
}

// 탭 데이터 인터페이스 정의
interface TabData {
  tabs: Tab[];
  empty: boolean;
}

// 더미 데이터
const dummyData = {
  store: {
    tabs: [
      { title: "전체", count: 0, isTotal: true, href: "/store/all" },
      { title: "신청 중", count: 0, isTotal: false, href: "/store/requesting" },
      { title: "보관 중", count: 0, isTotal: false, href: "/store/storing" },
      { title: "종료", count: 0, isTotal: false, href: "/store/complete" },
    ],
    get empty() {
      return this.tabs[0].count === 0; // "전체"의 count가 0이면 empty
    },
  },
  interestProducts: [
    {
      image: "https://via.placeholder.com/150",
      brand: "Nike",
      name: "Air Max 270",
      tags: ["빠른 배송"],
      price: "150,000원",
    },
    {
      image: "https://via.placeholder.com/150",
      brand: "Adidas",
      name: "Ultraboost 21",
      tags: ["무료 배송"],
      price: "180,000원",
    },
    // 데이터가 없을 경우 빈 배열로 설정
    // []
  ],
};

// 메인 컨테이너 스타일
const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

// my_home 컨테이너 스타일
const MyHome = styled.div`
  flex: 1;
`;

// user_membership 스타일
const UserMembership = styled.div`
  background-color: #fff;
  border: 1px solid #ebebeb;
  border-radius: 10px;
  display: flex;
  flex-direction: column;

  height: 110px;
  align-items: center; /* 세로 중앙 정렬 */
  justify-content: center; /* 가로 중앙 정렬 */
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center; /* 반응형에서도 세로 정렬 유지 */
    justify-content: space-between; /* 내부 요소 간격 분배 */
  }
  @media (max-width: 768px) {
    align-items: flex-start; /* 모바일에서 좌측 정렬 */
  }
`;

// user_detail 스타일
const UserDetail = styled.div`
  display: flex;
  flex: 1;
  padding: 16px 24px;

  @media (min-width: 768px) {
    border-bottom: none;
  }
`;

// user_thumb 스타일
const UserThumb = styled.div`
  border-radius: 50%;
  flex-shrink: 0;
  height: 60px;
  margin-right: 12px;
  position: relative;
  width: 60px;

  @media (max-width: 768px) {
    height: 90px; /* 모바일에서는 크기 변경 */
    width: 90px;
  }

  &::after {
    border: 1px solid rgba(34, 34, 34, 0.05);
    border-radius: 50%;
    bottom: 0;
    content: "";
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
  }
`;
const AdditionalText = styled.p`
  margin-top: 10px;
  color: rgb(120, 120, 120);
  font-size: 12px;
  text-align: left;
  white-space: pre-wrap;
`;

// thumb_img 스타일
const ThumbImg = styled.img`
  border-radius: 100%;
  height: 100%;
  object-fit: cover;
  width: 100%;
`;

// user_info 스타일
const UserInfo = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
  @media (max-width: 768px) {
    align-items: flex-start; /* 모바일에서 좌측 정렬 */
  }
`;

// info_box 스타일
const InfoBox = styled.div`
  flex: 1;
`;

// info_buttons 스타일
const InfoButtons = styled.div`
  padding-top: 12px;

  @media (min-width: 768px) {
    padding-top: 0;
  }
`;

// Name 스타일
const Name = styled.strong`
  color: #000;
  display: flex;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.27px;
  line-height: 21px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

// Email 스타일
const Email = styled.p`
  color: rgba(34, 34, 34, 0.5);
  font-size: 14px;
  letter-spacing: -0.05px;
  line-height: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

// 버튼 스타일
const Button = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  color: rgba(34, 34, 34, 0.5);
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  border: 1px solid #d3d3d3;
  height: 36px;
  line-height: 34px;
  border-radius: 10px;
  font-size: 12px;
  padding: 0 14px;

  &.btn_my_style {
    margin-left: 7px;
    align-self: flex-start;
  }
`;

// 여백 스타일
const Spacer = styled.div`
  height: 28px; /* 지정된 여백 */
`;

// 초기 탭 데이터 생성 함수
const createInitialTabData = (
  type: "purchase" | "sales" | "store"
): TabData => {
  const initialTabs =
    type === "store"
      ? [
          { title: "전체", count: 0, isTotal: true, href: "/store/all" },
          {
            title: "신청 중",
            count: 0,
            isTotal: false,
            href: "/store/requesting",
          },
          {
            title: "보관 중",
            count: 0,
            isTotal: false,
            href: "/store/storing",
          },
          { title: "종료", count: 0, isTotal: false, href: "/store/complete" },
        ]
      : [
          { title: "전체", count: 0, isTotal: true, href: `/${type}/all` },
          {
            title: "입찰 중",
            count: 0,
            isTotal: false,
            href: `/${type}/bidding`,
          },
          {
            title: "진행 중",
            count: 0,
            isTotal: false,
            href: `/${type}/progress`,
          },
          {
            title: "종료",
            count: 0,
            isTotal: false,
            href: `/${type}/complete`,
          },
        ];

  return {
    tabs: initialTabs,
    empty: true,
  };
};

// MyHomePage 컴포넌트
const MyHomePage: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData>({
    profileId: 0,
    profileImage: "",
    profileName: "",
    realName: "",
    email: "",
  });
  const [purchaseData, setPurchaseData] = useState<TabData>(
    createInitialTabData("purchase")
  );
  const [salesData, setSalesData] = useState<TabData>(
    createInitialTabData("sales")
  );
  const [storeData] = useState<TabData>(createInitialTabData("store"));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // API 데이터 가져오기
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const data = await getProfileInfo();
        if (data) {
          console.log("이미지경로:", data.profileImage);
          setProfileData({
            profileId: data.profileId,
            profileImage: `https://www.pinjun.xyz/api/profiles/${data.profileId}/image`,
            profileName: data.profileName,
            realName: data.realName,
            email: data.email,
          });
        }
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      }
    };

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // 병렬로 데이터 요청
        const [orderCounts, saleCounts] = await Promise.all([
          getOrderBidCounts(),
          getSaleBidCounts(),
        ]);

        // 주문 입찰 데이터 처리
        if (orderCounts) {
          const tabs = createTabsData(orderCounts, "purchase");
          const totalCount =
            orderCounts.pendingCount +
            orderCounts.matchedCount +
            orderCounts.cancelledOrCompletedCount;
          setPurchaseData({
            tabs,
            empty: totalCount === 0,
          });
        } else {
          // 응답이 없을 경우 빈 상태 설정
          setPurchaseData(createInitialTabData("purchase"));
        }

        // 판매 입찰 데이터 처리
        if (saleCounts) {
          const tabs = createTabsData(saleCounts, "sales");
          const totalCount =
            saleCounts.pendingCount +
            saleCounts.matchedCount +
            saleCounts.cancelledOrCompletedCount;
          setSalesData({
            tabs,
            empty: totalCount === 0,
          });
        } else {
          // 응답이 없을 경우 빈 상태 설정
          setSalesData(createInitialTabData("sales"));
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        // 오류 발생 시 기본 상태로 설정
        setPurchaseData(createInitialTabData("purchase"));
        setSalesData(createInitialTabData("sales"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
    fetchData();
  }, []);

  return (
    <MainContent>
      <MyHome>
        <UserMembership>
          <UserDetail>
            {/* 사용자 썸네일 */}
            <UserThumb>
              <ThumbImg
                src={
                  profileData.profileImage || "https://via.placeholder.com/60"
                }
                alt="User Thumbnail"
              />
            </UserThumb>

            {/* 사용자 정보 */}
            <UserInfo>
              <InfoBox>
                <Name>{profileData.realName || "사용자"}</Name>
                <Email>{profileData.email || "이메일 정보 없음"}</Email>
              </InfoBox>
              <InfoButtons>
                <Button href="/mypage/profile">프로필 관리</Button>
                <Button href="/mypage/style" className="btn_my_style">
                  내 스타일
                </Button>
              </InfoButtons>
            </UserInfo>
          </UserDetail>
        </UserMembership>
        {/* 여백 */}
        <Spacer />
        {/* 숏컷 그리드 섹션 */}
        <ShortcutGridComponent />
        {/* 구매내역 */}
        {isLoading ? (
          <div>로딩 중...</div>
        ) : (
          <>
            {/* 구매내역 */}
            {purchaseData.empty ? (
              <ListBoxComponent title="구매내역" tabs={purchaseData.tabs} />
            ) : (
              <PurchaseBoxComponent title="구매내역" tabs={purchaseData.tabs} />
            )}

            {/* 판매내역 */}
            {salesData.empty ? (
              <ListBoxComponent title="판매내역" tabs={salesData.tabs} />
            ) : (
              <PurchaseBoxComponent title="판매내역" tabs={salesData.tabs} />
            )}

            {/* 보관 판매 내역 */}
            <ListBoxComponent
              title="보관판매내역"
              tabs={dummyData.store.tabs}
            />
            <AdditionalText>
              보관 판매는 앱, 데스크탑에서 이용 가능합니다.
            </AdditionalText>
          </>
        )}
        <div style={{ height: "60px" }} /> {/* 공간 확보 div 추가 */}
        {/* 관심 상품 컴포넌트 */}
        <InterestProduct products={dummyData.interestProducts} />
      </MyHome>
    </MainContent>
  );
};

export default MyHomePage;
