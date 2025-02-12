import React, { useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { fetchShopData } from "src/features/shop/services/shopService";

const url = new URL(window.location.href);
const searchParams = new URLSearchParams(url.search);

interface FilterModalProps {
  open: boolean; // 모달 오픈 여부
  onClose: () => void; // 닫기 함수
  onApplyFilters: () => void;
}

interface Product {
  id: number;
  name: string;
  englishName: string;
  brandName: string;
  releasePrice: number;
  thumbnailImageUrl: string;
  price: number;
  colorName: string;
  colorId: number;
  interestCount: number;
  styleCount: number;
  tradeCount: number;
}

// 필터 상태 타입 정의
interface ModalFilters {
  categories: string[];
  gender: string | null;
  colors: string[];
  priceRange: string | null;
  sizes: string[];
  brands: string[];
}

// 초기 필터값 설정
const initialFilters: ModalFilters = {
  categories: [],
  gender: null,
  colors: [],
  priceRange: null,
  sizes: [],
  brands: [],
};

const FilterModal: React.FC<FilterModalProps> = ({
  open,
  onClose,
  onApplyFilters,
}) => {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [genderOpen, setGenderOpen] = useState(false);
  const [colorOpen, setColorOpen] = useState(false);
  const [discountOpen, setDiscountOpen] = useState(false);
  const [brandOpen, setBrandOpen] = useState(false);
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [sizeOpen, setSizeOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);
  const [modalFilters, setModalFilters] =
    useState<ModalFilters>(initialFilters);
  const [imageList, setImageList] = useState<Product[]>([]);

  if (!open) return null; // open이 false면 null 리턴

  //브랜드 목록 테스트용
  const items = [
    "& Other Stories",
    "0104",
    "032c",
    "&",
    "Apple",
    "Banana",
    "123",
    "Zebra",
    "!start",
    "2001",
    "coca cola",
    "coca cola",
    "coca cola",
    "coca cola",
    "coca cola",
    "coca cola",
  ];
  // 항목들을 그룹화하는 함수 (각 첫 글자별로 묶기)
  const groupItems = (items: string[]) => {
    const sortedItems = [...items].sort(); // 전체 정렬

    const grouped: { [key: string]: string[] } = {};

    sortedItems.forEach((item) => {
      const firstChar = item[0].toUpperCase(); // 첫 글자 추출
      if (!grouped[firstChar]) {
        grouped[firstChar] = [];
      }
      grouped[firstChar].push(item);
    });

    return grouped;
  };

  // 그룹화된 항목 가져오기
  const groupedItems = groupItems(items);
  const groupKeys = Object.keys(groupedItems); // 그룹 키 목록

  //색 출력 코드
  const colors = [
    { name: "블랙", rgb: "rgb(0, 0, 0)" },
    { name: "그레이", rgb: "rgb(204, 204, 204)" },
    { name: "화이트", rgb: "rgb(255, 255, 255)" },
    { name: "아이보리", rgb: "rgb(244, 238, 221)" },
    { name: "베이지", rgb: "rgb(230, 194, 129)" },
    { name: "브라운", rgb: "rgb(102, 50, 3)" },
    { name: "카키", rgb: "rgb(143, 120, 75)" },
    { name: "그린", rgb: "rgb(0, 128, 0)" },
    { name: "라이트그린", rgb: "rgb(144, 238, 144)" },
    { name: "민트", rgb: "rgb(114, 213, 192)" },
    { name: "네이비", rgb: "rgb(0, 0, 128)" },
    { name: "블루", rgb: "rgb(43, 50, 243)" },
    { name: "스카이블루", rgb: "rgb(135, 206, 235)" },
    { name: "퍼플", rgb: "rgb(128, 0, 128)" },
    { name: "핑크", rgb: "rgb(255, 192, 203)" },
    { name: "레드", rgb: "rgb(255, 0, 0)" },
    { name: "오렌지", rgb: "rgb(255, 165, 0)" },
    { name: "옐로우", rgb: "rgb(255, 255, 0)" },
    { name: "실버", img: "/shopcolorimg/silver.png" },
    { name: "골드", img: "/shopcolorimg/gold.png" },
    { name: "믹스", img: "/shopcolorimg/mixColor.png" },
  ];

  //할인 모달버튼
  const filters = [
    {
      title: "혜택",
      options: ["무료배송", "할인", "정가이하"],
    },
    {
      title: "할인율",
      options: ["30% 이하", "30%~50%", "50% 이상"],
    },
  ];

  const priceRanges = [
    { label: "10만원 이하", value: "under_100000" },
    { label: "10만원대", value: "100000_200000" },
    { label: "20만원대", value: "200000_300000" },
    { label: "30만원대", value: "300000_400000" },
    { label: "30~50만원", value: "300000_500000" },
    { label: "50~100만원", value: "500000_1000000" },
    { label: "100~500만원", value: "1000000_5000000" },
    { label: "500만원 이상", value: "over_5000000" },
  ];

  const shoeSizes = ["70", "80", "90", "110"];
  const apparelSizes = ["XXS", "XS", "S", "M", "L", "XL"];

  // 카테고리 필터 선택
  const handleCategoryClick = (category: string) => {
    setModalFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  // 성별 필터 선택
  const handleGenderClick = (gender: string) => {
    setModalFilters((prev) => ({
      ...prev,
      gender: prev.gender === gender ? null : gender, // 같은 걸 누르면 해제
    }));
  };

  // 색상 필터 선택
  const handleColorClick = (color: string) => {
    setModalFilters((prev) => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color],
    }));
  };

  // 가격대 필터 선택
  const handlePriceClick = (price: string) => {
    setModalFilters((prev) => ({
      ...prev,
      priceRange: prev.priceRange === price ? null : price, // 같은 걸 누르면 해제
    }));
  };

  // 사이즈 필터 선택
  const handleSizeClick = (size: string) => {
    setModalFilters((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  // 브랜드 필터 선택
  const handleBrandClick = (brand: string) => {
    setModalFilters((prev) => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter((b) => b !== brand)
        : [...prev.brands, brand],
    }));
  };

  const handleViewProducts = async () => {
    try {
      const data = await fetchShopData(
        searchParams.get("keyword") || undefined
        // modalFilters.categories,
        // modalFilters.gender,
        // modalFilters.colors,
        // modalFilters.priceRange,
        // modalFilters.sizes,
        // modalFilters.brands
      );

      if (data.length === 0) {
        console.error("데이터 가져오기 실패");
        return;
      }

      setImageList(data); // 백엔드에서 받은 데이터를 상태에 저장
    } catch (error) {
      console.error("handleViewProducts 에러:", error);
    }
  };
  //초기화버튼
  const handleResetFilters = () => {
    setModalFilters(initialFilters); // 초기값으로 리셋
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalWrapper onClick={(e) => e.stopPropagation()}>
        <ModalContainer>
          <ModalBackground onClick={onClose} />
          {/* 배경 클릭으로 닫기 */}
          {/* 실제 컨텐츠 */}
          <ModalInner>
            {/* 닫기 버튼 */}
            <CloseButton onClick={onClose}>x</CloseButton>
            <ModalHeader>
              <h2 className="title">필터</h2>
            </ModalHeader>

            <ModalContent>
              {/* 카테고리 필터 */}
              <div className="filter-section">
                <div className="section-header">
                  <div>
                    <h3>카테고리</h3>
                    {!categoryOpen ? (
                      <p className="title">모든 카테고리</p>
                    ) : null}
                  </div>
                  <FontAwesomeIcon
                    icon={categoryOpen ? faMinus : faPlus}
                    onClick={() => setCategoryOpen(!categoryOpen)}
                    style={{ cursor: "pointer" }}
                  />
                </div>

                {categoryOpen && (
                  <div className="filter-options">
                    <div className="subhead">
                      <p className="subheading">신발</p>
                      <button className="btn_multiple">모두 선택</button>
                    </div>
                    <div className="section-content">
                      <label className="bubble">
                        <input
                          type="checkbox"
                          onClick={() => handleCategoryClick("스니커즈")}
                        />
                        <div>
                          <button className="filter_button">스니커즈</button>
                        </div>
                      </label>
                      <label className="bubble">
                        <input type="checkbox" />
                        <div>
                          <button
                            className="filter_button"
                            onClick={() => handleCategoryClick("샌들/슬리퍼")}
                          >
                            샌들/슬리퍼
                          </button>
                        </div>
                      </label>
                    </div>
                    <div className="subhead">
                      <p className="subheading">아우터</p>
                      <button className="btn_multiple">모두 선택</button>
                    </div>
                    <div className="section-content">
                      <label className="bubble">
                        <input type="checkbox" />
                        <div>
                          <button className="filter_button">블루종</button>
                        </div>
                      </label>
                      <label className="bubble">
                        <input type="checkbox" />
                        <div>
                          <button className="filter_button">후드 자켓</button>
                        </div>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* 성별 필터 */}
              <div className="filter-section">
                <div className="section-header">
                  <div>
                    <h3>성별</h3>
                    {!genderOpen ? <p className="title">모든 성별</p> : null}
                  </div>
                  <FontAwesomeIcon
                    icon={genderOpen ? faMinus : faPlus}
                    onClick={() => setGenderOpen(!genderOpen)}
                    style={{ cursor: "pointer" }}
                  />
                </div>

                {genderOpen && (
                  <div className="filter-options">
                    <p className="subheading">성별</p>
                    <div className="section-content">
                      <label className="bubble">
                        <input
                          type="radio"
                          name="gender"
                          onClick={() => handleGenderClick("남성")}
                        />
                        <div>
                          <button className="filter_button">남성</button>
                        </div>
                      </label>
                      <label className="bubble">
                        <input
                          type="radio"
                          name="gender"
                          onClick={() => handleGenderClick("여성")}
                        />
                        <div>
                          <button className="filter_button">여성</button>
                        </div>
                      </label>
                      <label className="bubble">
                        <input
                          type="radio"
                          name="gender"
                          onClick={() => handleGenderClick("키즈")}
                        />
                        <div>
                          <button className="filter_button">키즈</button>
                        </div>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* 색상 필터 */}
              <div className="filter-section">
                <div className="section-header">
                  <div>
                    <h3>색상</h3>
                    {!colorOpen ? <p className="title">모든 색상</p> : null}
                  </div>
                  <FontAwesomeIcon
                    icon={colorOpen ? faMinus : faPlus}
                    onClick={() => setColorOpen(!colorOpen)}
                    style={{ cursor: "pointer" }}
                  />
                </div>
                {colorOpen && (
                  <div className="filter-options">
                    <div className="section-content color">
                      {colors.map((color, index) => (
                        <div className="filter-shortcut" key={index}>
                          {color.img ? (
                            <img
                              src={color.img}
                              alt={color.name}
                              className="color-box image-style"
                            />
                          ) : (
                            <div
                              className="color-box"
                              style={{ backgroundColor: color.rgb }}
                            ></div>
                          )}
                          <div className="title-color">
                            <p>{color.name}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 혜택/할인 필터 */}
              <div className="filter-section">
                <div className="section-header">
                  <div>
                    <h3>혜택/할인</h3>
                    {!discountOpen ? (
                      <p className="title">모든 혜택/할인</p>
                    ) : null}
                  </div>
                  <FontAwesomeIcon
                    icon={discountOpen ? faMinus : faPlus}
                    onClick={() => setDiscountOpen(!discountOpen)}
                    style={{ cursor: "pointer" }}
                  />
                </div>
                {discountOpen && (
                  <div className="filter-options">
                    {filters.map((filter, index) => (
                      <div key={index}>
                        <div className="subhead">
                          <p className="subheading">{filter.title}</p>
                          <button className="btn_multiple">모두 선택</button>
                        </div>
                        <div className="section-content">
                          {filter.options.map((option, idx) => (
                            <label className="bubble" key={idx}>
                              <input type="checkbox" />
                              <div>
                                <button className="filter_button">
                                  {option}
                                </button>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 브랜드 */}
              <div className="filter-section">
                <div className="section-header">
                  <div>
                    <h3>브랜드</h3>
                    {!brandOpen ? <p className="title">모든 브랜드</p> : null}
                  </div>
                  <FontAwesomeIcon
                    icon={brandOpen ? faMinus : faPlus}
                    onClick={() => setBrandOpen(!brandOpen)}
                    style={{ cursor: "pointer" }}
                  />
                </div>

                {brandOpen && (
                  <div
                    className="filter-options"
                    style={{ overflowY: "auto", maxHeight: "400px" }}
                  >
                    {groupKeys.map((key, index) => (
                      <div key={index}>
                        {/* 그룹 제목 */}
                        <div
                          className="group-title"
                          style={{
                            marginBottom: "9px",
                            fontSize: "16px",
                            fontWeight: "bold",
                          }}
                        >
                          {key}
                        </div>

                        {/* 그룹 항목 출력 */}
                        {groupedItems[key].map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className="item"
                            style={{ marginBottom: "9px", fontSize: "14px" }}
                          >
                            {item}
                          </div>
                        ))}

                        {/* 그룹이 변경될 때마다 구분선 추가 */}
                        <hr
                          style={{
                            margin: "9px 0",
                            border: "none",
                            borderTop: "1px solid rgba(0, 0, 0, .06)",
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 컬렉션 */}
              <div className="filter-section">
                <div className="section-header">
                  <div>
                    <h3>컬렉션</h3>
                    {!collectionOpen ? (
                      <p className="title">모든 컬렉션</p>
                    ) : null}
                  </div>
                  <FontAwesomeIcon
                    icon={collectionOpen ? faMinus : faPlus}
                    onClick={() => setCollectionOpen(!collectionOpen)}
                    style={{ cursor: "pointer" }}
                  />
                </div>

                {collectionOpen && <div className="filter-options"></div>}
              </div>

              {/* 사이즈 */}
              <div className="filter-section">
                <div className="section-header">
                  <div>
                    <h3>사이즈</h3>
                    {!sizeOpen ? <p className="title">모든 사이즈</p> : null}
                  </div>
                  <FontAwesomeIcon
                    icon={sizeOpen ? faMinus : faPlus}
                    onClick={() => setSizeOpen(!sizeOpen)}
                    style={{ cursor: "pointer" }}
                  />
                </div>

                {sizeOpen && (
                  <div className="filter-options">
                    <p>신발</p>
                    <div className="section-content">
                      {shoeSizes.map((size) => (
                        <label className="bubble" key={size}>
                          <input
                            type="checkbox"
                            checked={modalFilters.sizes.includes(size)}
                            onChange={() => handleSizeClick(size)}
                          />
                          <div>
                            <button className="filter_button">{size}</button>
                          </div>
                        </label>
                      ))}
                    </div>
                    <p>의류</p>
                    <div className="section-content">
                      {apparelSizes.map((size) => (
                        <label className="bubble" key={size}>
                          <input
                            type="checkbox"
                            checked={modalFilters.sizes.includes(size)}
                            onChange={() => handleSizeClick(size)}
                          />
                          <div>
                            <button className="filter_button">{size}</button>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 가격대 */}
              <div className="filter-section">
                <div className="section-header">
                  <div>
                    <h3>가격대</h3>
                    {!priceOpen ? <p className="title">모든 가격대</p> : null}
                  </div>
                  <FontAwesomeIcon
                    icon={priceOpen ? faMinus : faPlus}
                    onClick={() => setPriceOpen(!priceOpen)}
                    style={{ cursor: "pointer" }}
                  />
                </div>

                {priceOpen && (
                  <div className="filter-options">
                    <p>가격대</p>
                    <div className="section-content">
                      {priceRanges.map((range, index) => (
                        <label className="bubble" key={index}>
                          <input
                            type="checkbox"
                            checked={modalFilters.priceRange === range.value}
                            onChange={() => handlePriceClick(range.value)}
                          />
                          <div>
                            <button className="filter_button">
                              {range.label}
                            </button>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ModalContent>

            <ModalFooter>
              <button className="btn_reset" onClick={handleResetFilters}>
                초기화
              </button>
              <button className="btn_submit" onClick={handleViewProducts}>
                상품보기
              </button>
            </ModalFooter>
          </ModalInner>
        </ModalContainer>
      </ModalWrapper>
    </ModalOverlay>
  );
};

export default FilterModal;

/* ===========================
     styled-components
   =========================== */
const ModalOverlay = styled.div`
  /* 전체 화면 덮는 오버레이 */
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000; /* 페이지 위를 덮는 가장 큰 z-index */
`;

const ModalWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const ModalContainer = styled.div`
  /* 레이어 자체 위치 */
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;

  width: 420px; /* PC 기준 예시 */
  background: transparent;
  display: flex;
  flex-direction: column;
  z-index: 2010; /* 배경(2000)보다 위 */
`;

const ModalBackground = styled.div`
  /* 회색 반투명 배경 */
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2000;
`;

const ModalInner = styled.div`
  /* 실제 컨텐츠 부분 */
  position: relative;
  background: #fff;
  width: 100%;
  height: 100%;
  z-index: 2010;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 14px;
  right: 20px;
  cursor: pointer;
  background: none;
  border: none;
  font-size: 20px;
`;

const ModalHeader = styled.div`
  text-align: center;
  padding: 18px 50px;
  border-bottom: 1px solid #eee;

  h2.title {
    font-size: 18px;
    font-weight: 700;
    color: #000;
    line-height: 22px;
  }
`;

const ModalContent = styled.div`
  flex: 1;
  overflow-y: auto;

  .filter-section {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 24px 16px;
    position: relative;
    justify-content: space-between;
    border-bottom: 1px solid #f0f0f0;

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;

      .filter-options {
        display: flex;
        flex-direction: row; /* 가로로 배치 */
        justify-content: space-between; /* 두 요소 간의 공간을 균등 배분 */
        align-items: center; /* 세로 중앙 정렬 */
        margin-top: 10px;
        padding-left: 10px;
      }

      h3 {
        font-size: 17px;
        font-weight: 600;
      }
      .title {
        color: #909090;
        display: inline-block;
        font-size: 14px;
        margint-top: 4px;
        text-overfiw: elliosis;
      }
    }
    .scrollable-list {
      max-height: 200px; /* 목록의 최대 높이 */
      overflow-y: auto; /* 스크롤이 가능하도록 설정 */
      margin-top: 10px;
    }
    input[type="checkbox"] {
      display: none; /* 체크박스 숨기기 */
    }
    .item {
      margin-bottom: 9px;
      font-size: 14px;
    }

    .btn_multiple {
      border: none;
      background: none;
      cursor: pointer;
      font-size: 14px;
      color: #888;
    }

    .subhead {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .subheading {
      font-size: 14px;
      font-weight: 600;
      padding-top: 8px;
      padding-bottom: 10px;
    }

    .color {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
    }

    .contents {
      padding: 16px;
      border-radius: 50%;
      border: 1px solid rgba(0, 0, 0, 0.04);
    }

    .filter-shortcut {
      align-items: center;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      gap: 5px;
      white-space: nowrap;
    }

    .title-color {
      display: flex;
      justify-content: center;
    }
    .title-color p {
      color: rgb(34, 34, 34, 0.8);
      font-size: 12px;
    }
    .color-box {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
    .image-style {
      width: 40px;
      height: 40px;
      object-fit: cover;
      border-radius: 50%;
      border: 1px solid rgba(0, 0, 0, 0.04);
    }

    .section-content {
      flex-wrap: wrap;
      gap: 6px;

      label.bubble {
        display: inline-flex;
        align-items: center;

        input {
          display: none;
        }
        div {
          button.filter_button {
            background-color: #f4f4f4;
            border-radius: 30px;
            color: #4e4e4e;
            cursor: pointer;
            font-size: 13px;
            border: 1px solid #f0f0f0;
            padding: 0 8px;
            height: 30px;
            margin-left: 5px;
          }
        }
      }
    }
  }
`;

const ModalFooter = styled.div`
  border-top: 1px solid #eee;
  padding: 16px;
  display: flex;
  gap: 8px;

  .btn_reset {
    flex: 0 0 auto;
    background-color: #f4f4f4;
    color: #222;
    border: none;
    border-radius: 18px;
    width: 80px;
    height: 40px;
    cursor: pointer;
  }
  .btn_submit {
    flex: 1;
    border-radius: 18px;
    background-color: #000;
    color: #fff;
    border: none;
    height: 40px;
    cursor: pointer;
  }
`;
