import React, { useState, useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faNewspaper } from "@fortawesome/free-regular-svg-icons";
import {
  faBolt,
  faTruck,
  faDollarSign,
  faArrowUp,
  faArrowDown,
} from "@fortawesome/free-solid-svg-icons";

// 리액트 아이콘
import { FaChevronDown, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import FilterModal from "../components/filterModal";
import PopularModal from "../components/popularityModal";

// 최상위 컨테이너
const ShopContainer = styled.div`
  position: relative; /* 자식(오버레이)이 absolute로 전체를 덮을 수 있도록 */
  width: 1200px;
  margin: 0 auto;
`;
// FilterButton에 사용할 타입 정의
interface FilterButtonProps {
  isClicked: boolean;
}
// 검색 영역
const SearchContainer = styled.div``;
export const SearchPcTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 0;
  position: relative;

  .title_txt {
    color: #000;
    cursor: pointer;
    font-size: 28px;
    font-weight: 600;
    letter-spacing: -0.12px;
  }

  .suggests-visibility {
    position: absolute;
    top: -22px;
  }
`;
export const SearchArea = styled.div``;
export const SearchInner = styled.div`
  border-bottom: 3px solid #000;
  flex: none;
  flex-grow: 1;
  margin: 0 8px;
  padding-bottom: 16px;
  width: 500px;

  .input_search {
    color: #000;
    font-size: 24px;
    font-weight: 700;
    letter-spacing: -0.015em;
    line-height: 29px;
    overflow: hidden;
    padding: 0 13px 0 1px;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 468px;

    background-color: transparent;
    border: 0;
    outline: 0;
    -webkit-appearance: none;
  }

  .btn_search_delete {
    float: right;
    height: 24px;
    margin-right: 3px;
    margin-top: 3px;
    width: 24px;
    background: none;
    border: 0;
    cursor: pointer;
  }
`;

/*---------------------------------
    네비게이션 탭
----------------------------------*/
export const ShopTab = styled.nav`
  background: #fff;
  position: sticky;
  top: var(--global-header-height);
  z-index: 1;

  /* nav 좌우 padding */
  padding-left: 40px;
  padding-right: 40px;

  &.top-fixed {
    border-bottom: 0;
  }
  @media (min-width: 961px) {
    z-index: 2;
  }
`;

export const Tabs = styled.div`
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  position: relative;
`;

export const UlTab = styled.ul`
  display: flex;
  flex-wrap: nowrap;
  height: 45px;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;

  /* 기본 padding 제거
     nav에서 이미 padding-left,right:40px 을 줬으므로
     여기서는 0 처리 (또는 원하는 값으로 조정) */
  padding-left: 0;
  padding-right: 0;

  width: 100%;

  .li_tab {
    display: inline-flex;

    /* 아래와 같이 padding-left/right 혹은 margin-left/right를 주어 간격을 벌릴 수 있음 */
    padding: 0 12px 0 0;
  }
`;

// 탭 a: 선택 시 검정글자+보더바텀, 미선택 시 회색글자+투명바텀
export const TabLink = styled.a<{ active?: boolean }>`
  display: inline-flex;
  align-items: center;
  height: 100%;
  padding-top: 15px;
  padding-bottom: 6px;
  border-bottom: 2px solid transparent;
  color: #999; /* 미선택 시 회색 */

  cursor: pointer;
  position: relative;

  ${({ active }) =>
    active &&
    css`
      color: #222;
      border-bottom-color: #222;
      font-weight: 700;
    `}
`;

/*---------------------------------
    트렌드 키워드 슬라이드
----------------------------------*/
export const TrendContainer = styled.div`
  padding: 16px;
  //margin: 0 48.5px;
  max-width: 1280px;
  overflow-x: hidden;

  .lg & .trend_keywords_grid {
    max-width: 1200px;
    overflow: visible;
    padding: 16px 0;
    position: relative;
  }
`;

export const TrendKeywordsGrid = styled.div`
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  position: relative;
  padding: 16px 0;

  .flicking-viewport {
    overflow: hidden;
    position: relative;
    z-index: 0;
    user-select: none;
    -webkit-user-drag: none;
    touch-action: pan-y;
  }
  .flicking-camera {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
    position: relative;
    will-change: transform;
    z-index: 1;

    > * {
      flex-shrink: 0;
    }
  }
  .trending_keyword_slide {
    display: inline-flex !important;
    justify-content: center;
  }
`;

export const TrendKeyword = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  cursor: pointer;

  .img {
    display: flex;
    width: 68px;
    height: 68px;
    @media (min-width: 961px) {
      width: 90px;
      height: 90px;
    }
  }

  .name {
    font-size: 12px;
    white-space: nowrap;
    @media (min-width: 961px) {
      font-size: 13px;
    }
  }
`;

export const MovingControl = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 16px;

  /* 화살표(React Icons) 대신 기본 이미지 없애고 커스텀 */
  .arrow {
    background: none; /* 원래 svg이미지를 없앰 */
    border: 0;
    outline: none;
    appearance: none;

    color: #222; /* 아이콘 색상 */
    font-size: 24px; /* 아이콘 크기 */
    cursor: pointer;
    margin: 0 15px;

    &.disabled {
      color: #bbb; /* 비활성시 연한색 */
      cursor: not-allowed;
    }
  }

  .paginations {
    display: flex;
    .pagination {
      background: #d3d3d3;
      border-radius: 6px;
      color: transparent;
      cursor: pointer;
      font-size: 0;
      height: 6px;
      margin: 0 4px;
      width: 6px;
      &.active {
        background-color: #222;
      }
    }
  }
`;

/* =============================
    메인 컨텐츠(필터 영역)
============================= */
const ContentContainer = styled.div`
  /* .content-container[data-v-35c8927f] */
  @media (min-width: 961px) {
    padding-bottom: 80px;
    position: relative;
  }
`;

const ShopFilterOpenButtonsContainer = styled.div`
  /* .search-container-shop-filter-open-buttons-container */
  background-color: #fff;
  position: static;
  top: 105px; /* 모바일 기본값 */
  z-index: 5;

  /* PC */
  @media (min-width: 961px) {
    top: 130px; /* PC에서는 130px */
    &.top-fixed {
      top: 132px;
    }
`;

const ShopFilters = styled.div`
  /* .shop-filters.search-container-shop-filter-open-buttons */
  margin-left: auto;
  margin-right: auto;
  max-width: 1280px;

  display: flex;
  padding: 12px 0 0;

  @media (min-width: 961px) {
    padding: 16px 0 0;
  }
`;

const FilterDeliveryContainer = styled.div`
  flex-shrink: 0;
  -ms-overflow-style: none;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0 16px;
  scrollbar-width: none;
`;

const FilterChipButtons = styled.div`
  display: inline-flex;
  flex-basis: content;
  gap: 6px;
  padding-right: 16px;
  width: max-content;

  @media (min-width: 961px) {
    gap: 8px;
    padding-right: 0;
  }
`;

const FilterButton = styled.button<FilterButtonProps>`
  background: ${(props) => (props.isClicked ? "#000" : "#fff")};
  color: ${(props) => (props.isClicked ? "#fff" : "#000")};
  border: 1px solid #f0f0f0;
  border-radius: 30px;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;

  .buttonIcon {
    margin-right: 4px;
  }
`;

const FilterButtonMeun = styled.button`
  background: #f4f4f4;
  border: 1px solid #f0f0f0;
  border-radius: 30px;
  color: #4e4e4e;
  display: flex;
  flex-direction: row;
  font-size: 13px;
  font-weight: 600;
  height: 30px;
  align-items: center;
  padding: 0 8px;
  cursor: pointer;
`;

const SearchFilterButtons = styled.div`
  display: grid;
  grid-gap: 6px;
  //grid-template-columns: 32px auto;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 12px 16px 0;

  @media (min-width: 961px) {
    gap: 8px;
    grid-template-columns: auto auto;
    overflow: visible;
    overflow: initial;
    padding: 0;
  }
`;

const FilterBasic = styled.div`
  position: relative;
`;

const ScrollContainer = styled.div`
  /* 가로 스크롤 */
  @media (min-width: 961px) {
    -ms-overflow-style: none;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;
  }
`;

const SearchContainerShopSortingCounts = styled.div`
  /* .search-container-shop-sorting-and-counts-container */
`;

const ShopCounts = styled.div`
  /* .shop_counts */
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;

  .filter_sorting button.sorting_title {
    border: none;
    background: none;
    padding: 8px 16px;
    cursor: pointer;
    font-size: 13px;
    gap: 4px;
  }
`;

const FilterFixed = styled.div`
  display: flex;
  gap: 12px;

  input[type="checkbox"] {
    margin-right: 8px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    vertical-align: middle; /* 텍스트와 체크박스를 동일 라인에 위치시킴 */
  }
  .filter-check-button {
    display: flex;
    align-items: center;
    background-color: #fff;
    cursor: pointer;
    padding: 5px 16px;
  }
  line-height: 1; /* 텍스트 라인 높이 */
  font-size: 16px; /* 텍스트 크기 */
`;

const SearchContent = styled.div`
  //1
  display: grid;
  grid-gap: 20px 12px;
  grid-template-columns: repeat(auto-fill, minmax(min(192px, 100%), 1fr));
`;

const ShopMainContent = styled.div`
  /* .shop-content 2 */
`;
const SearchResult = styled.div`
  /* .search_result 3 */
  display: flex;
  flex-direction: column;
`;

const ImageGrid = styled.div`
  // 4
`;

const ImageWrapper = styled.div`
  position: relative; /* 텍스트를 이미지 위에 겹치게 하기 위해 사용 */
  width: 150px; /* 이미지와 텍스트의 공통 영역 크기 */
  height: 150px;
  img {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    background-color: green;
  }
`;

const OverlayText = styled.div`
  position: absolute; /* 부모를 기준으로 위치 설정 */
  top: 7%; /* 세로 중앙 정렬 */
  left: 56%; /* 가로 중앙 정렬 */
  transform: translate(-50%, -50%); /* 중앙 정렬을 위한 변환 */
  font-size: 13px;
  font-weight: bold;
  width: 120px;
  text-align: right;
`;
const ImageInfo = styled.div`
  text-align: left;
  margin-top: 8px;
  font-size: 13px;
  font-weight: 700;
  line-height: 16px;
  color: #333;

  .imgTitle {
    padding-left: 4px;
    padding-right: 4px;
  }

  .brandName {
    align-items: center;
    color: #333;
    display: flex;
    font-size: 13px;
    line-height: 16px;
    margin-bottom: 2px;
    font-weight: 700;
  }

  .name {
    display: block;
    font-size: 13px;
  }

  .translated_name {
    color: rgba(34, 34, 34, 0.5);
    font-size: 11px;
    line-height: 13px;
    margin-top: 2px;
  }

  .infoPrice {
    display: block;
    font-size: 17px;
    font-weight: 700;
    line-height: 17px;
  }

  .price {
    margin-top: 12px;
  }

  .action_icon {
    display: flex;
    column-gap: 12px;
    padding-top: 12px;
  }
`;
/*-----------------------------
    예시: 탭 데이터 / 슬라이드 데이터
------------------------------*/
const TAB_MENU_DATA = [
  { id: "all", label: "전체", filterValue: "" },
  { id: "luxury", label: "럭셔리", filterValue: "43" },
  { id: "outer", label: "아우터", filterValue: "49" },
  { id: "tops", label: "상의", filterValue: "50" },
  { id: "shoes", label: "신발", filterValue: "44" },
  { id: "pants", label: "하의", filterValue: "51" },
  { id: "bag", label: "가방", filterValue: "63" },
  { id: "wallet", label: "지갑", filterValue: "53" },
  { id: "watch", label: "시계", filterValue: "64" },
  { id: "accessory", label: "패션잡화", filterValue: "46" },
  { id: "collectible", label: "컬렉터블", filterValue: "54" },
  { id: "beauty", label: "뷰티", filterValue: "65" },
  { id: "tech", label: "테크", filterValue: "48" },
  { id: "camping", label: "캠핑", filterValue: "66" },
  { id: "living", label: "가구/리빙", filterValue: "55" },
];

// 슬라이드 데이터
const SLIDE_DATA = [
  { id: 1, imgUrl: "https://via.placeholder.com/90", name: "패딩 계급도" },
  { id: 2, imgUrl: "https://via.placeholder.com/90", name: "올해의 신발?" },
  { id: 3, imgUrl: "https://via.placeholder.com/90", name: "푸른 뱀의 해" },
  { id: 4, imgUrl: "https://via.placeholder.com/90", name: "어그 총정리" },
  { id: 5, imgUrl: "https://via.placeholder.com/90", name: "인기 니트" },
  { id: 6, imgUrl: "https://via.placeholder.com/90", name: "인기 후드" },
  { id: 7, imgUrl: "https://via.placeholder.com/90", name: "인기 맨투맨" },
  { id: 8, imgUrl: "https://via.placeholder.com/90", name: "나이키" },
  { id: 9, imgUrl: "https://via.placeholder.com/90", name: "아디다스" },
  { id: 10, imgUrl: "https://via.placeholder.com/90", name: "아식스" },
  { id: 11, imgUrl: "https://via.placeholder.com/90", name: "베이프" },
  { id: 12, imgUrl: "https://via.placeholder.com/90", name: "살로몬" },
  { id: 13, imgUrl: "https://via.placeholder.com/90", name: "뉴발란스" },
  { id: 14, imgUrl: "https://via.placeholder.com/90", name: "스투시" },
  { id: 15, imgUrl: "https://via.placeholder.com/90", name: "슈프림" },
  { id: 16, imgUrl: "https://via.placeholder.com/90", name: "노스페이스" },
  { id: 17, imgUrl: "https://via.placeholder.com/90", name: "아크테릭스" },
  { id: 18, imgUrl: "https://via.placeholder.com/90", name: "인기 후드집업" },
  { id: 19, imgUrl: "https://via.placeholder.com/90", name: "인기 롱슬리브" },
  { id: 20, imgUrl: "https://via.placeholder.com/90", name: "패딩 정리" },
];

const FILTER_DATA = [
  { id: "category", label: "카테고리" },
  { id: "gender", label: "성별" },
  { id: "color", label: "색상" },
  { id: "benefit", label: "혜택/할인" },
  { id: "brand", label: "브랜드" },
  { id: "collection", label: "컬렉션" },
  { id: "size", label: "사이즈" },
  { id: "price", label: "가격대" },
];

/*--------------------------------
      ShopPage 컴포넌트
---------------------------------*/
type FilterKey = "isBelowOriginalPrice" | "isExcludeSoldOut";

const PopularityButtonWrapper = styled.div`
  position: relative; /* 자식이 absolute로 뜨도록 하기 위함 */
  width: 100%;
  height: 100%;
`;
// display: inline-block; /* 버튼 크기에 맞춰 wrapping */

const ShopPage: React.FC = () => {
  // 모달 열림 여부
  const [open, setOpen] = useState(false);

  // 모달 DOM을 가리킬 ref
  const modalRef = useRef<HTMLDivElement>(null);

  // 모달 외부 클릭 시 닫기 위한 전역 클릭 핸들러
  const handleGlobalClick = (e: React.MouseEvent) => {
    // 모달이 열려 있고, ref가 존재하면
    if (open && modalRef.current) {
      // e.target이 모달 내부가 아니면 => 닫기
      if (!modalRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
  };

  // 모달에서 선택된 값 (ex. "인기순", "남성 인기순" 등)
  const [selectedValue, setSelectedValue] = useState("");

  // 모달에서 아이템 선택 시 호출할 콜백
  const handleSelectItem = (item: string) => {
    console.log("선택된 아이템:", item);
    setSelectedValue(item);
    // 모달은 이미 모달 내부에서 onClose()가 호출되어 닫힘
  };

  // 탭 상태
  const [activeTabId, setActiveTabId] = useState<string>("all");

  // 슬라이드 페이지네이션
  const [page, setPage] = useState<number>(1);
  const itemsPerPage = 9;

  const totalPage = Math.ceil(SLIDE_DATA.length / itemsPerPage);
  const offset = (page - 1) * itemsPerPage;
  const currentPageData = SLIDE_DATA.slice(offset, offset + itemsPerPage);

  // 모달 열고 닫기
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => {
    setIsModalOpen(true); // 모달 열기
  };
  const handleCloseModal = () => {
    console.log("모달창 닫기 완료"); // 로그로 확인
    setIsModalOpen(false); // 모달 닫기
  };

  //배송버튼 변경 함수
  const [clickedButton, setClickedButton] = useState<string | null>(null);

  // 배송버튼 클릭 시 호출되는 함수
  const handleButtonClick = (buttonLabel: string) => {
    console.log(`${buttonLabel}`);
    setClickedButton((prevLabel) =>
      prevLabel === buttonLabel ? null : buttonLabel
    );
    sendToBackend(buttonLabel); // 클릭된 데이터를 백엔드로 전송
  };
  //배송버튼 백앤드 전송 코드
  const sendToBackend = async (buttonLabel: string) => {
    try {
      const response = await fetch("주소넣음.", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filter: buttonLabel }),
      });

      if (!response.ok) {
        throw new Error("Failed to send data to the backend");
      }

      console.log("Data successfully sent to the backend");
    } catch (error) {
      console.error("Error sending data to the backend:", error);
    }
  };

  //라디오 버튼 (정가이하, 품절제외)
  const [filters, setFilters] = useState<{
    isBelowOriginalPrice: boolean;
    isExcludeSoldOut: boolean;
  }>({
    isBelowOriginalPrice: false,
    isExcludeSoldOut: false,
  });
  const handleToggle = (filterKey: FilterKey) => {
    const newFilters = {
      ...filters,
      [filterKey]: !filters[filterKey], // 해당 키의 상태만 반전
    };

    setFilters(newFilters);

    // 백엔드로 전송
    sendFiltersToBackend(newFilters);

    console.log(filterKey, newFilters[filterKey]);
  };
  //체크박스 백앤드 데이터 전송코드
  const sendFiltersToBackend = async (updatedFilters: {
    isBelowOriginalPrice: boolean;
    isExcludeSoldOut: boolean;
  }) => {
    try {
      const response = await fetch("주소", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFilters),
      });

      if (!response.ok) {
        throw new Error("Failed to send filters to backend");
      }

      console.log("Filters successfully sent to backend:", updatedFilters);
    } catch (error) {
      console.error("Error sending filters to backend:", error);
    }
  };

  //인기순 버튼의 모달창
  const [buttonListModal, setButtonListModal] = useState(false);

  const handlePopularityOpenModal = () => setButtonListModal(true);
  const handlePopularityCloseModal = () => setButtonListModal(false);

  //shop의 이미지 출력
  // const imageList = [
  //   { id: 1, imgUrl: "/logo512.png", brandName: "아디다스", productName: "제품명" , productPrice: "50000"},
  //   { id: 2, imgUrl: "/logo512.png", brandName: "닥스", productName: "제품명", productPrice: "50000"},
  //   { id: 3, imgUrl: "/logo512.png", brandName: "구찌", productName: "제품명", productPrice: "50000"},
  //   { id: 4, imgUrl: "/logo512.png", brandName: "아디다스", productName: "제품명", productPrice: "50000"},
  //   { id: 5, imgUrl: "/logo512.png", brandName: "닥스", productName: "제품명", productPrice: "50000"},
  //   { id: 6, imgUrl: "/logo512.png", brandName: "아디다스", productName: "제품명", productPrice: "50000"},
  //   { id: 7, imgUrl: "/logo512.png", brandName: "구찌", productName: "제품명", productPrice: "50000" },
  //   { id: 8, imgUrl: "/logo512.png", brandName: "닥스", productName: "제품명", productPrice: "50000" }
  // ];

  //이미지 데이터 get 코드
  type ImageData = {
    id: number;
    imgUrl: string;
    brandName: string;
    productName: string;
    productPrice: string;
  };

  const [imageList, setImageList] = useState<ImageData[]>([]);

  // 데이터를 백엔드에서 받아오는 함수
  const fetchImageData = async () => {
    try {
      const response = await fetch("주소"); // 백엔드 API URL로 변경
      if (!response.ok) {
        throw new Error("fetchImageData에서 발생");
      }

      const data: ImageData[] = await response.json(); // JSON 데이터를 배열 형태로 파싱
      console.log("확인데이터:", data); // 데이터 확인용 로그
      setImageList(data); // 상태 업데이트
    } catch (error) {
      console.error("fetchImageData data에서 발생", error);
    }
  };

  // 컴포넌트가 처음 렌더링될 때 데이터 가져오기
  useEffect(() => {
    fetchImageData();
  }, []);

  return (
    <>
      <ShopContainer onClick={handleGlobalClick}>
        {/* 상단 검색 */}
        {/* <SearchContainer> */}
        <SearchPcTitle>
          <div className="suggests-visibility" />
          <SearchArea style={{ display: "none" }}>
            <SearchInner>
              <input
                type="text"
                placeholder="브랜드, 상품, 프로필, 태그 등"
                title="검색창"
                className="input_search show_placeholder_on_focus"
              />
              <button className="btn_search_delete">X</button>
            </SearchInner>
          </SearchArea>
          <h1 className="title_txt">SHOP</h1>
        </SearchPcTitle>
        {/* </SearchContainer> */}

        {/* 네비게이션 탭 */}
        <ShopTab>
          <Tabs>
            <UlTab className="ul_search_tab">
              {TAB_MENU_DATA.map((menu) => (
                <li key={menu.id} className="li_tab">
                  <TabLink
                    active={activeTabId === menu.id}
                    onClick={() => setActiveTabId(menu.id)}
                  >
                    {menu.label}
                  </TabLink>
                </li>
              ))}
            </UlTab>
          </Tabs>
        </ShopTab>

        {/* 트렌드 키워드 슬라이드 */}
        <TrendContainer>
          <TrendKeywordsGrid className="trend_keywords_grid">
            <div className="flicking-viewport">
              <div className="flicking-camera">
                {currentPageData.map((item) => (
                  <div
                    key={item.id}
                    className="trending_keyword_slide"
                    style={{ width: "133.333px" }}
                  >
                    <a
                      style={{
                        userSelect: "none",
                        touchAction: "pan-y",
                      }}
                    >
                      <TrendKeyword>
                        <div className="img">
                          <img
                            src={item.imgUrl}
                            alt={item.name}
                            style={{ width: "100%", height: "100%" }}
                          />
                        </div>
                        <span className="name">{item.name}</span>
                      </TrendKeyword>
                    </a>
                  </div>
                ))}
              </div>
            </div>
            <MovingControl>
              {/* 이전 버튼(React Icon) */}
              <button
                className={`arrow prev ${page === 1 ? "disabled" : ""}`}
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                <FaChevronLeft />
              </button>

              <div className="paginations">
                {Array.from({ length: totalPage }).map((_, idx) => {
                  const pageNum = idx + 1;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      className={`pagination ${
                        pageNum === page ? "active" : ""
                      }`}
                      onClick={() => setPage(pageNum)}
                    />
                  );
                })}
              </div>

              {/* 다음 버튼(React Icon) */}
              <button
                className={`arrow next ${page === totalPage ? "disabled" : ""}`}
                disabled={page === totalPage}
                onClick={() => setPage(page + 1)}
              >
                <FaChevronRight />
              </button>
            </MovingControl>
          </TrendKeywordsGrid>
        </TrendContainer>

        {/* 메인 컨텐츠 */}
        <ContentContainer>
          <ShopFilterOpenButtonsContainer>
            <ShopFilters>
              <FilterDeliveryContainer>
                <FilterChipButtons>
                  <FilterButton
                    isClicked={clickedButton === "빠른배송"}
                    onClick={() => handleButtonClick("빠른배송")}
                  >
                    <FontAwesomeIcon className="buttonIcon" icon={faBolt} />
                    빠른배송
                  </FilterButton>

                  <FilterButton
                    isClicked={clickedButton === "브랜드배송"}
                    onClick={() => handleButtonClick("브랜드배송")}
                  >
                    <FontAwesomeIcon className="buttonIcon" icon={faTruck} />
                    브랜드배송
                  </FilterButton>

                  <FilterButton
                    isClicked={clickedButton === "프리미엄배송"}
                    onClick={() => handleButtonClick("프리미엄배송")}
                  >
                    <FontAwesomeIcon
                      className="buttonIcon"
                      icon={faDollarSign}
                    />
                    프리미엄배송
                  </FilterButton>
                </FilterChipButtons>
              </FilterDeliveryContainer>
              <div id="search-filter-divider" className="divider" />
              <SearchFilterButtons>
                <button
                  className="btn_reset tint"
                  id="search-filter-reset-button"
                  style={{ display: "none" }}
                >
                  리셋
                </button>
                <FilterBasic>
                  <ScrollContainer>
                    <FilterChipButtons>
                      {/* 필터 모달 열기 버튼 */}
                      {/* 카테고리 */}
                      <FilterButtonMeun onClick={handleOpenModal}>
                        <p className="text-group">
                          <span className="title">카테고리</span>
                          {/* ▼ 아이콘 (React Icons) */}
                          <FaChevronDown />
                        </p>
                      </FilterButtonMeun>

                      {/* 성별 */}
                      <FilterButtonMeun onClick={handleOpenModal}>
                        <p className="text-group">
                          <span className="title">성별</span>
                          <FaChevronDown />
                        </p>
                      </FilterButtonMeun>

                      {/* 색상 */}
                      <FilterButtonMeun onClick={handleOpenModal}>
                        <p className="text-group">
                          <span className="title">색상</span>
                          <FaChevronDown />
                        </p>
                      </FilterButtonMeun>

                      {/* 혜택/할인 */}
                      <FilterButtonMeun onClick={handleOpenModal}>
                        <p className="text-group">
                          <span className="title">혜택/할인</span>
                          <FaChevronDown />
                        </p>
                      </FilterButtonMeun>

                      {/* 브랜드 */}
                      <FilterButtonMeun onClick={handleOpenModal}>
                        <p className="text-group">
                          <span className="title">브랜드</span>
                          <FaChevronDown />
                        </p>
                      </FilterButtonMeun>

                      {/* 컬렉션 */}
                      <FilterButtonMeun onClick={handleOpenModal}>
                        <p className="text-group">
                          <span className="title">컬렉션</span>
                          <FaChevronDown />
                        </p>
                      </FilterButtonMeun>

                      {/* 사이즈 */}
                      <FilterButtonMeun onClick={handleOpenModal}>
                        <p className="text-group">
                          <span className="title">사이즈</span>
                          <FaChevronDown />
                        </p>
                      </FilterButtonMeun>

                      {/* 가격대 */}
                      <FilterButtonMeun onClick={handleOpenModal}>
                        <p className="text-group">
                          <span className="title">가격대</span>
                          <FaChevronDown />
                        </p>
                      </FilterButtonMeun>
                      {/* ... 나머지 필터 */}
                    </FilterChipButtons>
                  </ScrollContainer>
                </FilterBasic>
              </SearchFilterButtons>
            </ShopFilters>
          </ShopFilterOpenButtonsContainer>

          <SearchContainerShopSortingCounts>
            <ShopCounts>
              <FilterFixed>
                <div className="filter-check-button">
                  <label>
                    <input
                      type="checkbox"
                      className="checkBox"
                      checked={filters.isBelowOriginalPrice}
                      onChange={() => handleToggle("isBelowOriginalPrice")}
                      style={{ marginRight: "8px" }}
                    ></input>
                  </label>
                  <span>정가이하</span>
                </div>
                <div className="filter-check-button">
                  <label>
                    <input
                      type="checkbox"
                      checked={filters.isExcludeSoldOut}
                      onChange={() => handleToggle("isExcludeSoldOut")}
                      style={{ marginRight: "8px" }}
                    ></input>
                  </label>
                  <span>품절제외</span>
                </div>
              </FilterFixed>
              <div className="filter_sorting">
                <PopularityButtonWrapper>
                  <button
                    type="button"
                    className="sorting_title"
                    onClick={
                      // handlePopularityOpenModal
                      () => setOpen(true)
                    }
                  >
                    <span>
                      인기순 <FontAwesomeIcon icon={faArrowUp} />
                      <FontAwesomeIcon icon={faArrowDown} />
                    </span>
                  </button>
                  {open && (
                    <PopularModal
                      ref={modalRef} // ← forwardRef로 연결
                      open={open}
                      onClose={() => setOpen(false)}
                      onSelectItem={handleSelectItem} // ← 아이템 선택 콜백
                    />
                  )}
                </PopularityButtonWrapper>
              </div>
              {/* <!--> */}
            </ShopCounts>
          </SearchContainerShopSortingCounts>

          <SearchContent>
            {imageList.map((image) => (
              <ShopMainContent key={image.id}>
                <SearchResult>
                  <ImageGrid>
                    <ImageWrapper>
                      <img src={image.imgUrl} alt={`sample-${image.id}`} />
                      <OverlayText>거래 12.3만</OverlayText>
                    </ImageWrapper>
                  </ImageGrid>

                  <ImageInfo>
                    <div className="imgTitle">
                      <span className="brandName">{image.brandName}</span>
                      <div className="img_info">
                        <span className="name">{image.productName}</span>
                        <span className="translated_name">
                          {image.productName}
                        </span>
                      </div>
                    </div>
                    <div className="img_info price">
                      <span className="infoPrice">{image.productPrice}원</span>
                      <span className="translated_name">즉시 구매가</span>
                    </div>
                    <div className="action_icon">
                      <FontAwesomeIcon
                        className="translated_name"
                        icon={faBookmark}
                      />
                      <span className="translated_name">00.0만</span>
                      <FontAwesomeIcon
                        className="translated_name"
                        icon={faNewspaper}
                      />
                      <span className="translated_name">1,1234</span>
                    </div>
                  </ImageInfo>
                </SearchResult>
              </ShopMainContent>
            ))}
          </SearchContent>
        </ContentContainer>
      </ShopContainer>
      {/* 모달 컴포넌트: open 상태이면 출력 */}
      <FilterModal open={isModalOpen} onClose={handleCloseModal} />
    </>
  );
};

export default ShopPage;
