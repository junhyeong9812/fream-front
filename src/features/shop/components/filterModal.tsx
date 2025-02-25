import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus, faCheck } from "@fortawesome/free-solid-svg-icons";
import { fetchShopData } from "src/features/shop/services/shopService";

const url = new URL(window.location.href);
const searchParams = new URLSearchParams(url.search);

interface FilterModalProps {
  open: boolean; // 모달 오픈 여부
  onClose: () => void; // 닫기 함수
  onApplyFilters: () => void;
  categoryList: ButtonOption[];
  outerwearList: ButtonOption[];
  shirtsList: ButtonOption[];
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
//버튼 타입 설정
interface ButtonOption {
  value: string;
  label: string;
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
  categoryList,
  outerwearList,
  shirtsList,
}) => {
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [genderOpen, setGenderOpen] = useState(true);
  const [colorOpen, setColorOpen] = useState(false);
  const [discountOpen, setDiscountOpen] = useState(true);
  const [brandOpen, setBrandOpen] = useState(false);
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [sizeOpen, setSizeOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);
  const [modalFilters, setModalFilters] =
    useState<ModalFilters>(initialFilters);
  const [imageList, setImageList] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showMore, setShowMore] = useState(false); //더보기 버튼
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null); //가격대 필터
  //모달창 버튼 백에서 받아옴
  const [filterData, setFilterData] = useState<{
    sizes: Record<string, string[]>;
    genders: string[];
    colors: { key: string; name: string }[];
    discounts: { title: string; options: string[] }[];
    priceRanges: { label: string; value: string }[];
  }>({
    sizes: {},
    genders: [],
    colors: [],
    discounts: [],
    priceRanges: [],
  });

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await fetch("/api/filters"); // 백엔드 API 엔드포인트
        const data = await response.json();
        setFilterData(data);
      } catch (error) {
        console.error("필터 데이터 가져오기 실패:", error);

        // API 호출 실패 시 바로 mockData 설정
        const mockData = {
          sizes: {
            CLOTHING: ["XS", "S", "M", "L", "XL"],
            SHOES: ["230", "240", "250", "260", "270"],
            ACCESSORIES: ["ONE_SIZE"],
          },
          genders: ["MALE", "FEMALE", "KIDS", "UNISEX"],
          colors: [
            { key: "BLACK", name: "블랙" },
            { key: "WHITE", name: "화이트" },
            { key: "BLUE", name: "블루" },
          ],
          discounts: [
            { title: "혜택", options: ["무료배송", "할인", "정가이하"] },
            { title: "할인율", options: ["30% 이하", "30%~50%", "50% 이상"] },
          ],
          priceRanges: [
            { label: "10만원 이하", value: "under_100000" },
            // 나머지 가격대 옵션들...
          ],
        };
        setFilterData(mockData);
      }
    };

    fetchFilters();
  }, []);

  //버튼 선택 저장 state
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, Set<string>>
  >({});
  if (!open) return null;

  //브랜드 0목록 테스트용
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

  // const priceRanges = [
  //   { label: "10만원 이하", value: "under_100000" },
  //   { label: "10만원대", value: "100000_200000" },
  //   { label: "20만원대", value: "200000_300000" },
  //   { label: "30만원대", value: "300000_400000" },
  //   { label: "30~50만원", value: "300000_500000" },
  //   { label: "50~100만원", value: "500000_1000000" },
  //   { label: "100~500만원", value: "1000000_5000000" },
  //   { label: "500만원 이상", value: "over_5000000" },
  // ];

  const categories = [
    { label: "스니커즈", value: "스니커즈" },
    { label: "샌들/슬리퍼", value: "샌들/슬리퍼" },
  ];
  const outerwear = [
    { label: "블루종1", value: "블루종1" },
    { label: "블루종2", value: "블루종2" },
    { label: "블루종3", value: "블루종3" },
    { label: "블루종4", value: "블루종4" },
    { label: "블루종5", value: "블루종5" },
    { label: "블루종6", value: "블루종6" },
    { label: "블루종7", value: "블루종7" },
  ];

  const shirts = [
    { label: "블루종8", value: "블루종8" },
    { label: "블루종9", value: "블루종9" },
    { label: "블루종10", value: "블루종10" },
    { label: "블루종11", value: "블루종11" },
    { label: "블루종12", value: "블루종12" },
    { label: "블루종13", value: "블루종13" },
    { label: "블루종14", value: "블루종14" },
  ];

  //최적화
  const categoryData = [
    { name: "신발", options: categories },
    { name: "아우터", options: outerwear },
    { name: "셔츠", options: shirts },
    // 카테고리 추가
  ];

  //카테고리 2번째부터 출력
  const visibleCategories = showMore ? categoryData : categoryData.slice(0, 2);

  //데이터 전송시 모달창 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // 브랜드 목록 스크롤
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
  const handleFilterClick = (category: string, value: string) => {
    setSelectedFilters((prevFilters) => {
      const newFilters = { ...prevFilters };

      if (category === "gender" || category === "priceRange") {
        // 기존에 같은 값이 있으면 해제
        if (newFilters[category]?.has(value)) {
          newFilters[category] = new Set(); // 선택 해제
        } else {
          newFilters[category] = new Set([value]); // 새 값 선택
        }
      } else {
        if (!newFilters[category]) {
          newFilters[category] = new Set();
        } else {
          newFilters[category] = new Set(newFilters[category]); // 불변성 유지
        }

        if (newFilters[category].has(value)) {
          newFilters[category].delete(value); // 선택 해제
        } else {
          newFilters[category].add(value); // 선택 추가
        }
      }

      // 선택된 필터를 JSON 형태로 변환
      const filterPayload = Object.fromEntries(
        Object.entries(newFilters).map(([key, valueSet]) => [
          key,
          Array.from(valueSet),
        ])
      );

      console.log("현재 선택된 필터:", JSON.stringify(filterPayload, null, 2));

      fetch("/api/filters/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filterPayload),
      })
        .then((response) => response.json())
        .then((data) => console.log("서버 응답:", data))
        .catch((error) => console.error("필터 적용 요청 실패:", error));

      return newFilters;
    });
  };

  const handleViewProducts = async () => {
    try {
      const data = await fetchShopData(
        searchParams.get("keyword") || undefined,
        modalFilters.categories,
        modalFilters.gender,
        modalFilters.colors,
        modalFilters.priceRange,
        modalFilters.sizes,
        modalFilters.brands
      );

      if (data.length === 0) {
        console.error("데이터 가져오기 실패");
        return;
      }

      setImageList(data);
      console.log("데이터:", data);

      //모달 닫기
      handleCloseModal();
    } catch (error) {
      console.error("handleViewProducts 에러:", error);
    }
  };

  const handleRemoveFilter = (category: string, value: string) => {
    setSelectedFilters((prevFilters) => {
      const newFilters = { ...prevFilters };
      newFilters[category].delete(value);

      // 만약 카테고리가 비어 있으면 삭제
      if (newFilters[category].size === 0) {
        delete newFilters[category];
      }

      return { ...newFilters };
    });
  };

  //필터 모두선택 버튼
  const handleSelectAll = (category: string, options: ButtonOption[]) => {
    setSelectedFilters((prevFilters) => {
      const isAllSelected = options.every((item) =>
        prevFilters[category]?.has(item.value)
      );

      if (isAllSelected) {
        const updatedFilters = { ...prevFilters };
        updatedFilters[category] = new Set(); // 모든 선택 해제
        return updatedFilters;
      } else {
        // 모든 선택
        return {
          ...prevFilters,
          [category]: new Set(options.map((item) => item.value)),
        };
      }
    });
  };

  //초기화버튼
  const handleResetFilters = () => {
    setModalFilters(initialFilters);
    setSelectedFilters({});

    console.log("필터 초기화:", initialFilters);

    fetch("/api/filters/reset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(initialFilters),
    })
      .then((response) => response.json())
      .then((data) => console.log("서버 응답:", data))
      .catch((error) => console.error("필터 초기화 실패:", error));
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
                {/*  */}
                {visibleCategories.map(({ name, options }) => {
                  const allSelected = options.every((item) =>
                    selectedFilters[name]?.has(item.value)
                  );
                  return (
                    <div key={name} className="filter-options">
                      <div className="subhead">
                        <p className="subheading">{name}</p>
                        <button
                          className="btn_multiple"
                          onClick={() => handleSelectAll(name, options)}
                        >
                          {allSelected ? "모두 해제" : "모두 선택"}
                        </button>
                      </div>
                      <div className="section-content">
                        {options.map((item) => (
                          <label key={item.value} className="bubble">
                            <div>
                              <button
                                className="filter_button"
                                style={{
                                  backgroundColor: selectedFilters[name]?.has(
                                    item.value
                                  )
                                    ? "black"
                                    : "transparent",
                                  color: selectedFilters[name]?.has(item.value)
                                    ? "white"
                                    : "black",
                                }}
                                onClick={() =>
                                  handleFilterClick(name, item.value)
                                }
                              >
                                {item.label}
                              </button>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {/* 더보기 버튼 */}
                {!showMore && (
                  <div>
                    <button
                      className="seeCategory"
                      onClick={() => setShowMore(true)}
                    >
                      더보기
                    </button>
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
                      {filterData.genders.map((gender) => (
                        <label className="bubble" key={gender}>
                          <div>
                            <button
                              className="filter_button"
                              style={{
                                backgroundColor: selectedFilters.gender?.has(
                                  gender
                                )
                                  ? "black"
                                  : "transparent",
                                color: selectedFilters.gender?.has(gender)
                                  ? "white"
                                  : "black",
                              }}
                              onClick={() =>
                                handleFilterClick("gender", gender)
                              }
                            >
                              {gender === "MALE"
                                ? "남성"
                                : gender === "FEMALE"
                                ? "여성"
                                : gender === "KIDS"
                                ? "키즈"
                                : "공용"}
                            </button>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              ;{/* 색상 필터 */}
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
                        <label className="filter-shortcut" key={index}>
                          <div
                            className="color-box contents"
                            style={{
                              backgroundColor: color.rgb,
                              position: "relative",
                            }}
                            onClick={() =>
                              handleFilterClick("color", color.name)
                            }
                          >
                            {color.img && (
                              <img
                                src={color.img}
                                alt={color.name}
                                className="image-style"
                              />
                            )}
                            {selectedFilters.color?.has(color.name) && (
                              <FontAwesomeIcon
                                icon={faCheck}
                                style={{
                                  position: "absolute",
                                  top: "50%",
                                  left: "50%",
                                  transform: "translate(-50%, -50%)",
                                  color: [
                                    "화이트",
                                    "아이보리",
                                    "옐로우",
                                  ].includes(color.name)
                                    ? "black"
                                    : "white",
                                  fontSize: "1.2em",
                                }}
                              />
                            )}
                          </div>
                          <div className="title-color">
                            <p>{color.name}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              ;{/* 혜택/할인 필터 */}
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
                {discountOpen &&
                  filterData.discounts &&
                  filterData.discounts.map((filter, index) => (
                    <div key={index}>
                      <div className="subhead">
                        <p className="subheading">{filter.title}</p>
                        <button
                          className="btn_multiple"
                          onClick={() =>
                            handleSelectAll(
                              filter.title,
                              filter.options.map((option) => ({
                                value: option,
                                label: option,
                              }))
                            )
                          }
                        >
                          {filter.options.every((option) =>
                            selectedFilters[filter.title]?.has(option)
                          )
                            ? "모두 해제"
                            : "모두 선택"}
                        </button>
                      </div>
                      <div className="section-content">
                        {filter.options.map((option, idx) => (
                          <label className="bubble" key={idx}>
                            <input
                              type="checkbox"
                              checked={
                                selectedFilters[filter.title]?.has(option) ||
                                false
                              }
                              onChange={() =>
                                handleFilterClick(filter.title, option)
                              }
                            />
                            <div>
                              <button
                                className="filter_button"
                                style={{
                                  backgroundColor: selectedFilters[
                                    filter.title
                                  ]?.has(option)
                                    ? "black"
                                    : "transparent",
                                  color: selectedFilters[filter.title]?.has(
                                    option
                                  )
                                    ? "white"
                                    : "black",
                                }}
                                onClick={() =>
                                  handleFilterClick(filter.title, option)
                                }
                              >
                                {option}
                              </button>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
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
              {/* 사이즈 필터 */}
              <div className="filter-section">
                <div className="section-header">
                  <div>
                    <h3>사이즈</h3>
                  </div>
                  <FontAwesomeIcon
                    icon={sizeOpen ? faMinus : faPlus}
                    onClick={() => setSizeOpen(!sizeOpen)}
                    style={{ cursor: "pointer" }}
                  />
                </div>
                {sizeOpen && (
                  <div className="filter-options">
                    {Object.entries(filterData.sizes).map(
                      ([category, sizes]) => (
                        <div key={category}>
                          <p className="subheading">
                            {category === "CLOTHING"
                              ? "의류"
                              : category === "SHOES"
                              ? "신발"
                              : "액세서리"}
                          </p>

                          <div className="section-content">
                            {sizes.map((option, idx) => (
                              <label className="bubble" key={idx}>
                                <input
                                  type="checkbox"
                                  checked={
                                    selectedFilters[category]?.has(option) ||
                                    false
                                  }
                                  onChange={() =>
                                    handleFilterClick(category, option)
                                  }
                                />
                                <div>
                                  <button
                                    className="filter_button"
                                    style={{
                                      backgroundColor: selectedFilters[
                                        category
                                      ]?.has(option)
                                        ? "black"
                                        : "transparent",
                                      color: selectedFilters[category]?.has(
                                        option
                                      )
                                        ? "white"
                                        : "black",
                                    }}
                                    onClick={() =>
                                      handleFilterClick(category, option)
                                    }
                                  >
                                    {option}
                                  </button>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      )
                    )}
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
                      {filterData.priceRanges.map((range, index) => {
                        const isSelected =
                          selectedFilters.priceRange?.has(range.value) ?? false;

                        return (
                          <label className="bubble" key={index}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() =>
                                handleFilterClick("priceRange", range.value)
                              }
                            />
                            <div>
                              <button
                                className="filter_button"
                                style={{
                                  backgroundColor: isSelected
                                    ? "black"
                                    : "transparent",
                                  color: isSelected ? "white" : "black",
                                }}
                                onClick={() =>
                                  handleFilterClick("priceRange", range.value)
                                }
                              >
                                {range.label}
                              </button>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </ModalContent>

            <FilterContainer>
              <div>
                {/* {Array.from(newSet)} */}
                <ul className="px-3 py-1">
                  {Object.entries(selectedFilters).map(([category, values]) =>
                    Array.from(values).map((value) => (
                      <li key={value} className="filterButton">
                        <span>{value}</span>
                        <button
                          onClick={() => handleRemoveFilter(category, value)}
                        >
                          ✕
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </FilterContainer>

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
      display: flex;
      justify-content: center;
      align-items: center;
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
  .seeCategory {
    width: 100%;
    height: 40px;
    border-radius: 8px;
    border: 1px solid #f0f0f0;
    background: none;
    color: #4e4e4e;
    font-size: 14px;
    cursor: pointer;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  align-items: center;

  .filterButton {
    cursor: pointer;
    font-size: 13px;
    border: none;
    padding: 0 8px;
    height: 30px;
    margin-left: 5px;
  }

  ul {
    display: flex; /* 가로 정렬을 위한 추가 */
    flex-wrap: wrap;
    align-items: center;
    list-style: none;
    padding: 0;
    margin: 0;
    gap: 8px; /* 버튼 사이 간격 추가 */
  }

  li {
    display: flex;
    align-items: center;
  }

  li button {
    border: none;
    background: none;
    padding: 6px 12px;
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
