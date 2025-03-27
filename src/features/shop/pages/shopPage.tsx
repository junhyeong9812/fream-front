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
  PaginatedResponse,
} from "../types/filterTypes";
import {
  fetchShopData,
  setAdditionalFilters,
  setDeliveryOption,
  setSortOption,
} from "../services/shopService";
import styles from "./shopPage.module.css";
import FilterModal from "../components/filterModal";
import PopularityModal from "../components/popularityModal";
import { SortOptionKey } from "../types/sortOptions";
import debounce from "lodash/debounce";

const ShopPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { headerHeight } = useHeader();
  const [searchParams, setSearchParams] = useSearchParams();

  // State for filter modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // State for delivery filter buttons
  const [clickedButton, setClickedButton] = useState<string | null>(null);

  // State for additional filters (checkboxes)
  const [additionalFilters, setAdditionalFilters] = useState({
    isBelowOriginalPrice: false,
    isExcludeSoldOut: false,
  });

  // State for sort modal
  const [isSortModalOpen, setIsSortModalOpen] = useState<boolean>(false);
  const sortModalRef = useRef<HTMLDivElement>(null);
  const [selectedSortOption, setSelectedSortOption] =
    useState<SortOptionKey>("인기순");

  // State for product data with infinite scroll
  const [productData, setProductData] = useState<ImageData[]>([]);
  const [page, setPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [isIntersectionProcessed, setIsIntersectionProcessed] =
    useState<boolean>(false);

  // State for active tab
  const [activeTabId, setActiveTabId] = useState<string>("all");

  // State for slide pagination
  const [slidePage, setSlidePage] = useState<number>(1);
  const itemsPerPage = 9;

  // State for applied filters
  const [appliedFilters, setAppliedFilters] = useState<SelectedFiltersPayload>(
    {}
  );

  // 디바운스된 페이지 설정 함수 생성 - 수정됨: 함수를 받도록 변경
  const debouncedSetPage = useCallback(
    debounce((nextPageFn: ((prevPage: number) => number) | number) => {
      setPage(typeof nextPageFn === "function" ? nextPageFn(page) : nextPageFn);
      setIsIntersectionProcessed(false);
    }, 800),
    []
  );

  // Observer for infinite scroll - 수정됨: 의존성 최적화
  const observer = useRef<IntersectionObserver | null>(null);
  const lastProductElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading || !hasMore || isIntersectionProcessed) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (
            entries[0].isIntersecting &&
            entries[0].intersectionRatio >= 0.5 &&
            hasMore &&
            !isLoading
          ) {
            setIsIntersectionProcessed(true); // 중복 처리 방지
            debouncedSetPage((prevPage) => prevPage + 1); // 함수형 업데이트 사용
          }
        },
        {
          root: null,
          rootMargin: "0px",
          threshold: 0.5,
        }
      );

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, isIntersectionProcessed, debouncedSetPage] // page 의존성 제거
  );

  // Example data
  const categories: ButtonOption[] = [
    { value: "shoes", label: "신발" },
    { value: "clothes", label: "의류" },
  ];

  const outerwear: ButtonOption[] = [
    { value: "jackets", label: "재킷" },
    { value: "coats", label: "코트" },
  ];

  const shirts: ButtonOption[] = [
    { value: "tshirts", label: "티셔츠" },
    { value: "dressShirts", label: "드레스 셔츠" },
  ];

  // Mock data for slides
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

  // Pagination calculations
  const totalPage = Math.ceil(SLIDE_DATA.length / itemsPerPage);
  const offset = (slidePage - 1) * itemsPerPage;
  const currentPageData = SLIDE_DATA.slice(offset, offset + itemsPerPage);

  // Tab data
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

  // 필터 파라미터 생성 함수 - 중복 코드 제거
  const createFilterPayload = useCallback((): SelectedFiltersPayload => {
    const filterPayload: SelectedFiltersPayload = {
      ...appliedFilters,
      keyword: searchParams.get("keyword") || undefined,
      sortOption: selectedSortOption,
      deliveryOption: clickedButton || undefined,
      isBelowOriginalPrice: additionalFilters.isBelowOriginalPrice,
      isExcludeSoldOut: additionalFilters.isExcludeSoldOut,
    };

    // If there's an active tab other than "all", add it to category filter
    if (activeTabId !== "all") {
      const activeTab = TAB_MENU_DATA.find((tab) => tab.id === activeTabId);
      if (activeTab && activeTab.filterValue) {
        filterPayload.categoryIds = [parseInt(activeTab.filterValue, 10)];
      }
    }

    return filterPayload;
  }, [
    appliedFilters,
    searchParams,
    selectedSortOption,
    clickedButton,
    additionalFilters,
    activeTabId,
  ]);

  // Reset product data and pagination when filters change
  const resetProductData = useCallback(() => {
    setProductData([]);
    setPage(0);
    setHasMore(true);
    setIsIntersectionProcessed(false);
  }, []);

  // Load products (최적화됨)
  const loadProducts = useCallback(
    async (pageNum: number) => {
      // 이미 로딩 중이거나 더 이상 불러올 데이터가 없으면 요청하지 않음
      if (!hasMore || isLoading) return;

      try {
        setIsLoading(true);

        // 필터 객체 생성
        const filterPayload = createFilterPayload();

        // 요청 로그
        console.log(`[ShopPage] 상품 로드 요청: 페이지 ${pageNum}`);

        // Fetch products with filters and pagination
        const result = await fetchShopData(filterPayload, pageNum);

        // 결과 확인: 데이터가 비어 있거나 적은 경우 hasMore를 false로 설정
        const hasResultData = result.content && result.content.length > 0;

        // Update state with new data
        if (pageNum === 0) {
          setProductData(result.content);
        } else {
          // 중복 방지 로직 최적화
          setProductData((prevData) => {
            // ID로 빠른 조회를 위한 Set 사용
            const existingIds = new Set(prevData.map((item) => item.id));
            // 중복되지 않은 새 데이터만 필터링
            const newItems = result.content.filter(
              (newItem) => !existingIds.has(newItem.id)
            );

            // 새 데이터가 있을 때만 상태 업데이트
            return newItems.length > 0 ? [...prevData, ...newItems] : prevData;
          });
        }

        // hasMore 상태 업데이트 - 서버가 마지막 페이지임을 알려주거나 데이터가 없으면 false
        setHasMore(!result.last && hasResultData && result.content.length >= 5);
        setTotalProducts(result.totalElements);
      } catch (error) {
        console.error("상품 로드 에러:", error);
        setHasMore(false); // 오류 발생 시 더 이상 로드하지 않음
      } finally {
        setIsLoading(false);
      }
    },
    [createFilterPayload] // 필터 관련 의존성을 createFilterPayload로 통합
  );

  // Effect to load initial products - 수정됨: 의존성 최적화
  useEffect(() => {
    resetProductData();
    loadProducts(0);
  }, [
    searchParams,
    appliedFilters,
    activeTabId,
    clickedButton,
    additionalFilters,
    selectedSortOption,
    resetProductData, // 함수를 실제로 사용하므로 의존성에 추가
    loadProducts,
  ]);

  // Effect to load more products when page changes - 수정됨: 불필요한 의존성 제거
  useEffect(() => {
    // 페이지가 0보다 크고 로딩 중이 아니며 더 불러올 데이터가 있는 경우에만 요청
    if (page > 0 && !isLoading && hasMore) {
      loadProducts(page);
    }
  }, [page, isLoading, hasMore, loadProducts]);

  // Handle delivery button click - 최적화됨: 불필요한 리셋 방지
  const handleDeliveryButtonClick = async (buttonLabel: string) => {
    const newValue = clickedButton === buttonLabel ? null : buttonLabel;

    // 상태가 실제로 변경될 때만 처리
    if (newValue !== clickedButton) {
      setClickedButton(newValue);

      // Update backend
      if (newValue) {
        await setDeliveryOption(newValue);
      }

      // 상태가 변경되었을 때만 리셋
      resetProductData();
    }
  };

  // Handle additional filter toggles (checkboxes) - 최적화됨: 불필요한 리셋 방지
  const handleAdditionalFilterToggle = async (
    filterKey: "isBelowOriginalPrice" | "isExcludeSoldOut"
  ) => {
    const newValue = !additionalFilters[filterKey];

    const newFilters = {
      ...additionalFilters,
      [filterKey]: newValue,
    };

    // 상태가 실제로 변경되었을 때만 업데이트
    if (additionalFilters[filterKey] !== newValue) {
      setAdditionalFilters(newFilters);

      // Update backend
      await setAdditionalFilters(newFilters);

      // 상태가 변경되었을 때만 리셋
      resetProductData();
    }
  };

  // Handle sort option selection - 최적화됨: 불필요한 리셋 방지
  const handleSortOptionSelect = async (option: SortOptionKey) => {
    // 동일한 정렬 옵션 선택 시 무시
    if (option === selectedSortOption) {
      setIsSortModalOpen(false);
      return;
    }

    setSelectedSortOption(option);
    setIsSortModalOpen(false);

    // Update backend
    await setSortOption(option);

    // Reset product list and pagination
    resetProductData();
  };

  // Handle filter modal open/close
  const handleOpenFilterModal = () => setIsModalOpen(true);
  const handleCloseFilterModal = () => setIsModalOpen(false);

  // Handle applying filters from modal - 최적화됨: 불필요한 리셋 방지
  const handleApplyFilters = (filters: SelectedFiltersPayload) => {
    // 필터 변경 여부 확인
    const isFilterChanged =
      JSON.stringify(filters) !== JSON.stringify(appliedFilters);

    if (isFilterChanged) {
      // 기존 필터 상태 업데이트 유지
      setAppliedFilters(filters);

      // 새 URL 파라미터 객체 생성
      const newParams = new URLSearchParams(searchParams);

      // 기존 필터 관련 파라미터 모두 제거
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

      // 카테고리 ID 추가
      if (filters.categoryIds && filters.categoryIds.length > 0) {
        newParams.set("categoryIds", filters.categoryIds.join(","));
      }

      // 브랜드 ID 추가
      if (filters.brandIds && filters.brandIds.length > 0) {
        newParams.set("brandIds", filters.brandIds.join(","));
      }

      // 컬렉션 ID 추가
      if (filters.collectionIds && filters.collectionIds.length > 0) {
        newParams.set("collectionIds", filters.collectionIds.join(","));
      }

      // 성별 추가
      if (filters.genders && filters.genders.length > 0) {
        newParams.set("genders", filters.genders.join(","));
      }

      // 색상 추가
      if (filters.colors && filters.colors.length > 0) {
        newParams.set("colors", filters.colors.join(","));
      }

      // 사이즈 추가
      if (filters.sizes && filters.sizes.length > 0) {
        newParams.set("sizes", filters.sizes.join(","));
      }

      // 가격 범위 추가
      if (filters.minPrice) {
        newParams.set("minPrice", filters.minPrice.toString());
      }

      if (filters.maxPrice) {
        newParams.set("maxPrice", filters.maxPrice.toString());
      }

      // URL 파라미터 업데이트
      setSearchParams(newParams);

      // 필터가 변경되었을 때만 리셋
      resetProductData();
    }
  };

  // Handle product click navigation
  const handleProductClick = (productId: number, colorName: string) => {
    navigate(`/products/${productId}?color=${colorName}`);
  };

  // Handle tab click - 최적화됨: 불필요한 리셋 방지
  const handleTabClick = (tabId: string) => {
    // 같은 탭 클릭 시 무시
    if (tabId === activeTabId) return;

    setActiveTabId(tabId);
    resetProductData();
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
                {Array.from({ length: totalPage }).map((_, idx) => {
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
                  slidePage === totalPage ? styles.arrowDisabled : ""
                }`}
                disabled={slidePage === totalPage}
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
            {productData.map((product, index) => {
              // 마지막 아이템에서 3번째 전에 ref 추가하여 무한 스크롤 관찰 (일찍 로드 시작)
              const isTargetItem =
                productData.length > 5 && index === productData.length - 3;

              return (
                <div
                  key={`${product.id}-${index}`}
                  ref={isTargetItem ? lastProductElementRef : null}
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
                        <span className={styles.translatedName}>
                          즉시 구매가
                        </span>
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
              );
            })}

            {/* 로딩 인디케이터 */}
            {isLoading && (
              <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p>상품을 불러오는 중...</p>
              </div>
            )}

            {/* 더 이상 상품이 없을 때 메시지 */}
            {!isLoading && !hasMore && productData.length > 0 && (
              <div className={styles.noMoreProductsContainer}>
                <p>더 이상 상품이 없습니다.</p>
              </div>
            )}

            {/* 검색 결과가 없을 때 메시지 */}
            {!isLoading && productData.length === 0 && !isLoading && (
              <div className={styles.noProductsContainer}>
                <p>검색 결과가 없습니다.</p>
              </div>
            )}
          </div>
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
