import React, { useState, useEffect, useRef, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faNewspaper } from "@fortawesome/free-regular-svg-icons";
import {
  faBolt,
  faTruck,
  faDollarSign,
  faArrowUp,
  faArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import { FaChevronDown, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useHeader } from "src/global/context/HeaderContext";
import {
  ButtonOption,
  ImageData,
  SelectedFiltersPayload,
} from "../types/filterTypes";
import {
  fetchShopData,
  setAdditionalFilters,
  setDeliveryOption,
} from "../services/shopService";
import styles from "./shopPage.module.css";
import FilterModal from "../components/filterModal";
import PopularityModal from "../components/popularityModal";

const ShopPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { headerHeight } = useHeader();
  const [searchParams, setSearchParams] = useSearchParams();

  // 필터 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clickedButton, setClickedButton] = useState<string | null>(null);
  const [additionalFilters, setAdditionalFilters] = useState({
    isBelowOriginalPrice: false,
    isExcludeSoldOut: false,
  });

  // 정렬 상태
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const sortModalRef = useRef<HTMLDivElement>(null);
  const [selectedSortOption, setSelectedSortOption] = useState("인기순");

  // 상품 데이터 상태
  const [productData, setProductData] = useState<ImageData[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>("all");

  // 페이징 상태
  const [page, setPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(0);

  // 슬라이드 상태
  const [slidePage, setSlidePage] = useState<number>(1);
  const itemsPerPage = 9;

  // 필터 상태
  const [appliedFilters, setAppliedFilters] = useState<SelectedFiltersPayload>(
    {}
  );

  // 예시 데이터
  const categories = [
    { value: "shoes", label: "신발" },
    { value: "clothes", label: "의류" },
  ];

  const outerwear = [
    { value: "jackets", label: "재킷" },
    { value: "coats", label: "코트" },
  ];

  const shirts = [
    { value: "tshirts", label: "티셔츠" },
    { value: "dressShirts", label: "드레스 셔츠" },
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
  ];

  // 슬라이드 페이지네이션 계산
  const totalSlidePage = Math.ceil(SLIDE_DATA.length / itemsPerPage);
  const offset = (slidePage - 1) * itemsPerPage;
  const currentPageData = SLIDE_DATA.slice(offset, offset + itemsPerPage);

  // 탭 데이터
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

  // 스크롤 감지 및 페이지 로드 로직
  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (isLoading || !hasMore) return;

  //     const { scrollTop, scrollHeight, clientHeight } =
  //       document.documentElement;
  //     const scrollPercentage =
  //       (scrollTop / (scrollHeight - clientHeight)) * 100;

  //     if (scrollPercentage > 70) {
  //       setPage((prev) => prev + 1);
  //     }
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, [isLoading, hasMore]);
  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      const scrollPercentage =
        (scrollTop / (scrollHeight - clientHeight)) * 100;

      // 로딩 중이 아니고, 더 로드할 페이지가 있을 때만 페이지 증가
      if (scrollPercentage > 70 && !isLoading && hasMore) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading, hasMore]);

  // 상품 로드 함수
  const loadProducts = useCallback(
    async (pageToLoad: number) => {
      if (
        isLoading ||
        (pageToLoad > 0 && !hasMore) ||
        (totalPages > 0 && pageToLoad >= totalPages)
      )
        return;

      setIsLoading(true);

      try {
        // 필터 객체 구성
        const filterPayload: SelectedFiltersPayload = {
          ...appliedFilters,
          keyword: searchParams.get("keyword") || undefined,
        };

        // 카테고리 필터 추가
        if (activeTabId !== "all") {
          const activeTab = TAB_MENU_DATA.find((tab) => tab.id === activeTabId);
          if (activeTab && activeTab.filterValue) {
            filterPayload.categoryIds = [parseInt(activeTab.filterValue, 10)];
          }
        }

        // 상품 가져오기
        const result = await fetchShopData(
          filterPayload,
          pageToLoad,
          20,
          selectedSortOption
        );

        // 첫 페이지면 데이터 교체, 아니면 추가
        if (pageToLoad === 0) {
          setProductData(result.content);
        } else {
          setProductData((prev) => [...prev, ...result.content]);
        }

        // 페이징 상태 업데이트
        setTotalPages(result.totalPages);
        setHasMore(!result.last);
      } catch (error) {
        console.error("상품 로드 실패:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [
      appliedFilters,
      searchParams,
      activeTabId,
      selectedSortOption,
      totalPages,
      hasMore,
      isLoading,
    ]
  );

  // 페이지 변경시 상품 로드
  useEffect(() => {
    loadProducts(page);
  }, [page, loadProducts]);

  // 필터, 탭, 정렬 변경시 첫 페이지부터 다시 로드
  useEffect(() => {
    setPage(0);
    setHasMore(true);
    loadProducts(0);
  }, [
    appliedFilters,
    activeTabId,
    selectedSortOption,
    location.state,
    searchParams,
  ]);

  // 배송 버튼 클릭 핸들러
  const handleDeliveryButtonClick = async (buttonLabel: string) => {
    const newValue = clickedButton === buttonLabel ? null : buttonLabel;
    setClickedButton(newValue);

    if (newValue) {
      await setDeliveryOption(newValue);
    }
  };

  // 추가 필터 토글 핸들러
  const handleAdditionalFilterToggle = async (
    filterKey: "isBelowOriginalPrice" | "isExcludeSoldOut"
  ) => {
    const newFilters = {
      ...additionalFilters,
      [filterKey]: !additionalFilters[filterKey],
    };

    setAdditionalFilters(newFilters);
    await setAdditionalFilters(newFilters);

    // 필터 변경시 첫 페이지부터 다시 로드
    setPage(0);
    setHasMore(true);
    loadProducts(0);
  };

  // 정렬 옵션 선택 핸들러
  const handleSortOptionSelect = (option: string) => {
    setSelectedSortOption(option);
    setIsSortModalOpen(false);

    // 정렬 변경시 첫 페이지부터 다시 로드
    setPage(0);
    setHasMore(true);
  };

  // 필터 모달 핸들러
  const handleOpenFilterModal = () => setIsModalOpen(true);
  const handleCloseFilterModal = () => setIsModalOpen(false);

  // 필터 적용 핸들러
  const handleApplyFilters = (filters: SelectedFiltersPayload) => {
    setAppliedFilters(filters);

    const newParams = new URLSearchParams(searchParams);

    // 기존 필터 파라미터 제거
    [
      "categoryIds",
      "brandIds",
      "collectionIds",
      "genders",
      "colors",
      "sizes",
      "minPrice",
      "maxPrice",
    ].forEach((param) => {
      newParams.delete(param);
    });

    // 새 필터 파라미터 추가
    if (filters.categoryIds?.length) {
      newParams.set("categoryIds", filters.categoryIds.join(","));
    }

    if (filters.brandIds?.length) {
      newParams.set("brandIds", filters.brandIds.join(","));
    }

    if (filters.collectionIds?.length) {
      newParams.set("collectionIds", filters.collectionIds.join(","));
    }

    if (filters.genders?.length) {
      newParams.set("genders", filters.genders.join(","));
    }

    if (filters.colors?.length) {
      newParams.set("colors", filters.colors.join(","));
    }

    if (filters.sizes?.length) {
      newParams.set("sizes", filters.sizes.join(","));
    }

    if (filters.minPrice) {
      newParams.set("minPrice", filters.minPrice.toString());
    }

    if (filters.maxPrice) {
      newParams.set("maxPrice", filters.maxPrice.toString());
    }

    setSearchParams(newParams);
  };

  // 상품 클릭 핸들러
  const handleProductClick = (productId: number, colorName: string) => {
    navigate(`/products/${productId}?color=${colorName}`);
  };

  // 탭 클릭 핸들러
  const handleTabClick = (tabId: string) => {
    setActiveTabId(tabId);
  };

  return (
    <>
      {/* Shop Container */}
      <div className={styles.shopContainer}>
        {/* Shop title */}
        <div className={styles.searchPcTitle}>
          <div className={styles.suggestsVisibility} />
          <div style={{ display: "none" }}>
            <div className={styles.searchInner}>
              <input
                type="text"
                placeholder="브랜드, 상품, 프로필, 태그 등"
                title="검색창"
                className={styles.inputSearch}
              />
              <button className={styles.btnSearchDelete}>X</button>
            </div>
          </div>
          <h1 className={styles.titleText}>SHOP</h1>
        </div>

        {/* Navigation tabs */}
        <nav className={styles.shopTab} style={{ top: `${headerHeight}px` }}>
          <div className={styles.tabs}>
            <ul className={styles.ulTab}>
              {TAB_MENU_DATA.map((menu) => (
                <li key={menu.id} className={styles.liTab}>
                  <a
                    className={`${styles.tabLink} ${
                      activeTabId === menu.id ? styles.tabLinkActive : ""
                    }`}
                    onClick={() => handleTabClick(menu.id)}
                  >
                    {menu.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Trend keywords slider */}
        <div className={styles.trendContainer}>
          <div className={styles.trendKeywordsGrid}>
            <div className={styles.flickingViewport}>
              <div className={styles.flickingCamera}>
                {currentPageData.map((item) => (
                  <div
                    key={item.id}
                    className={styles.trendingKeywordSlide}
                    style={{ width: "133.333px" }}
                  >
                    <a style={{ userSelect: "none", touchAction: "pan-y" }}>
                      <div className={styles.trendKeyword}>
                        <div className={styles.trendKeywordImg}>
                          <img
                            src={item.imgUrl}
                            alt={item.name}
                            style={{ width: "100%", height: "100%" }}
                          />
                        </div>
                        <span className={styles.trendKeywordName}>
                          {item.name}
                        </span>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.movingControl}>
              {/* Previous button */}
              <button
                className={`${styles.arrow} ${
                  slidePage === 1 ? styles.arrowDisabled : ""
                }`}
                disabled={slidePage === 1}
                onClick={() => setSlidePage(slidePage - 1)}
              >
                <FaChevronLeft />
              </button>

              {/* Pagination dots */}
              <div className={styles.paginations}>
                {Array.from({ length: totalSlidePage }).map((_, idx) => {
                  const pageNum = idx + 1;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      className={`${styles.pagination} ${
                        pageNum === slidePage ? styles.paginationActive : ""
                      }`}
                      onClick={() => setSlidePage(pageNum)}
                    />
                  );
                })}
              </div>

              {/* Next button */}
              <button
                className={`${styles.arrow} ${
                  slidePage === totalSlidePage ? styles.arrowDisabled : ""
                }`}
                disabled={slidePage === totalSlidePage}
                onClick={() => setSlidePage(slidePage + 1)}
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className={styles.contentContainer}>
          {/* Filter buttons */}
          <div
            className={styles.shopFilterOpenButtonsContainer}
            style={{ top: `${headerHeight + 105}px` }}
          >
            <div className={styles.shopFilters}>
              {/* Delivery filter buttons */}
              <div className={styles.filterDeliveryContainer}>
                <div className={styles.filterChipButtons}>
                  <button
                    className={`${styles.filterButton} ${
                      clickedButton === "빠른배송"
                        ? styles.filterButtonActive
                        : styles.filterButtonInactive
                    }`}
                    onClick={() => handleDeliveryButtonClick("빠른배송")}
                  >
                    <FontAwesomeIcon
                      className={styles.buttonIcon}
                      icon={faBolt}
                    />
                    빠른배송
                  </button>

                  <button
                    className={`${styles.filterButton} ${
                      clickedButton === "브랜드배송"
                        ? styles.filterButtonActive
                        : styles.filterButtonInactive
                    }`}
                    onClick={() => handleDeliveryButtonClick("브랜드배송")}
                  >
                    <FontAwesomeIcon
                      className={styles.buttonIcon}
                      icon={faTruck}
                    />
                    브랜드배송
                  </button>

                  <button
                    className={`${styles.filterButton} ${
                      clickedButton === "프리미엄배송"
                        ? styles.filterButtonActive
                        : styles.filterButtonInactive
                    }`}
                    onClick={() => handleDeliveryButtonClick("프리미엄배송")}
                  >
                    <FontAwesomeIcon
                      className={styles.buttonIcon}
                      icon={faDollarSign}
                    />
                    프리미엄배송
                  </button>
                </div>
              </div>

              <div className={styles.divider} />

              {/* Filter menu buttons */}
              <div className={styles.searchFilterButtons}>
                <button
                  className="btn_reset tint"
                  id="search-filter-reset-button"
                  style={{ display: "none" }}
                >
                  리셋
                </button>
                <div className={styles.filterBasic}>
                  <div className={styles.scrollContainer}>
                    <div className={styles.filterChipButtons}>
                      {/* Filter buttons that open the modal */}
                      {[
                        "카테고리",
                        "성별",
                        "색상",
                        "혜택/할인",
                        "브랜드",
                        "컬렉션",
                        "사이즈",
                        "가격대",
                      ].map((filter) => (
                        <button
                          key={filter}
                          className={styles.filterButtonMenu}
                          onClick={handleOpenFilterModal}
                        >
                          <p className={styles.textGroup}>
                            <span className="title">{filter}</span>
                            <FaChevronDown />
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sorting and additional filters */}
          <div>
            <div className={styles.shopCounts}>
              {/* Additional filter checkboxes */}
              <div className={styles.filterFixed}>
                <div className={styles.filterCheckButton}>
                  <label>
                    <input
                      type="checkbox"
                      className={styles.checkBox}
                      checked={additionalFilters.isBelowOriginalPrice}
                      onChange={() =>
                        handleAdditionalFilterToggle("isBelowOriginalPrice")
                      }
                    />
                    <span>정가이하</span>
                  </label>
                </div>
                <div className={styles.filterCheckButton}>
                  <label>
                    <input
                      type="checkbox"
                      className={styles.checkBox}
                      checked={additionalFilters.isExcludeSoldOut}
                      onChange={() =>
                        handleAdditionalFilterToggle("isExcludeSoldOut")
                      }
                    />
                    <span>품절제외</span>
                  </label>
                </div>
              </div>

              {/* Sort options button */}
              <div>
                <div className={styles.popularityButtonWrapper}>
                  <button
                    type="button"
                    className={styles.sortingTitle}
                    onClick={() => setIsSortModalOpen(true)}
                  >
                    <span>
                      {selectedSortOption}
                      <FontAwesomeIcon
                        icon={faArrowUp}
                        style={{ marginLeft: "5px" }}
                      />
                      <FontAwesomeIcon
                        icon={faArrowDown}
                        style={{ marginLeft: "2px" }}
                      />
                    </span>
                  </button>
                  {isSortModalOpen && (
                    <PopularityModal
                      ref={sortModalRef}
                      open={isSortModalOpen}
                      onClose={() => setIsSortModalOpen(false)}
                      onSelectItem={handleSortOptionSelect}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Product grid */}
          <div className={styles.searchContent}>
            {productData.map((product) => (
              <div
                key={product.id}
                onClick={() =>
                  handleProductClick(product.id, product.colorName)
                }
                style={{ cursor: "pointer" }}
              >
                <div className={styles.searchResult}>
                  <div>
                    <div className={styles.imageWrapper}>
                      <img
                        src={product.thumbnailImageUrl || product.imgUrl}
                        alt={`${product.brandName} ${product.name}`}
                        className={styles.productImage}
                      />
                      <div className={styles.overlayText}>
                        거래 {product.tradeCount}
                      </div>
                    </div>
                  </div>

                  <div className={styles.imageInfo}>
                    <div className={styles.imgTitle}>
                      <span className={styles.brandName}>
                        {product.brandName}
                      </span>
                      <div>
                        <span className={styles.name}>
                          {product.name || product.productName}
                        </span>
                        <span className={styles.translatedName}>
                          {product.englishName}
                        </span>
                      </div>
                    </div>
                    <div className={`${styles.price}`}>
                      <span className={styles.infoPrice}>
                        {product.productPrice ||
                          `${product.price?.toLocaleString()}원`}
                      </span>
                      <span className={styles.translatedName}>즉시 구매가</span>
                    </div>
                    <div className={styles.actionIcon}>
                      <FontAwesomeIcon
                        className={styles.translatedName}
                        icon={faBookmark}
                      />
                      <span className={styles.translatedName}>
                        {product.interestCount > 10000
                          ? `${(product.interestCount / 10000).toFixed(1)}만`
                          : product.interestCount.toLocaleString()}
                      </span>
                      <FontAwesomeIcon
                        className={styles.translatedName}
                        icon={faNewspaper}
                      />
                      <span className={styles.translatedName}>
                        {product.styleCount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Loading indicator */}
          {isLoading && (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}></div>
            </div>
          )}

          {/* No more products message */}
          {!hasMore && productData.length > 0 && (
            <div className={styles.noMoreProducts}>
              더 이상 상품이 없습니다.
            </div>
          )}
        </div>
      </div>

      {/* Filter Modal */}
      <FilterModal
        open={isModalOpen}
        onClose={handleCloseFilterModal}
        onApplyFilters={handleApplyFilters}
        categoryList={categories}
        outerwearList={outerwear}
        shirtsList={shirts}
      />
    </>
  );
};

export default ShopPage;
