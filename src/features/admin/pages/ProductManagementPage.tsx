import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import { useTheme } from "../../../global/context/ThemeContext";
import { ProductService } from "../services/productManagementService";
import {
  ProductSearchDto,
  ProductSearchResponseDto,
  SortOption,
} from "../types/productManagementTypes";
import ProductSearchBar from "../components/ProductSearchBar";
import ProductFilter from "../components/ProductFilter";
import ProductSort from "../components/ProductSort";
import ProductList from "../components/ProductList";
import LoadingSpinner from "../../../global/components/common/LoadingSpinner";
import ErrorMessage from "../../../global/components/common/ErrorMessage";
import styles from "./ProductManagementPage.module.css";

// 페이지 모드 상태 타입
type PageMode = "list" | "view" | "create" | "edit";

const ProductManagementPage: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  // 상태 관리
  const [pageMode, setPageMode] = useState<PageMode>("list");
  const [products, setProducts] = useState<ProductSearchResponseDto[]>([]);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductSearchResponseDto | null>(null);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [currentFilter, setCurrentFilter] = useState<ProductSearchDto>({});
  const [currentSort, setCurrentSort] = useState<SortOption>({
    field: "interestCount",
    order: "desc",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  const pageSize = 20;

  // 초기 상품 데이터 로드
  useEffect(() => {
    loadProducts();
  }, [currentPage, currentSort]);

  // 상품 데이터 로드 함수
  const loadProducts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 검색 요청 구성
      const searchRequest: ProductSearchDto = {
        ...currentFilter,
        keyword: searchKeyword,
        sortOption: currentSort,
      };

      // 상품 검색 API 호출
      const response = await ProductService.searchProducts(
        searchRequest,
        currentPage,
        pageSize
      );

      // 결과 처리
      setProducts(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (err) {
      console.error("상품 로드 실패:", err);
      setError("상품을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 검색 핸들러
  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    setCurrentPage(0); // 검색 시 첫 페이지로 리셋

    // 검색 실행
    const searchRequest: ProductSearchDto = {
      ...currentFilter,
      keyword,
      sortOption: currentSort,
    };

    setIsLoading(true);
    setError(null);

    ProductService.searchProducts(searchRequest, 0, pageSize)
      .then((response) => {
        setProducts(response.content);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
      })
      .catch((err) => {
        console.error("상품 검색 실패:", err);
        setError("상품 검색 중 오류가 발생했습니다.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // 필터 적용 핸들러
  const handleApplyFilter = (filter: ProductSearchDto) => {
    setCurrentFilter(filter);
    setCurrentPage(0); // 필터 변경 시 첫 페이지로 리셋

    // 필터 적용하여 검색
    const searchRequest: ProductSearchDto = {
      ...filter,
      keyword: searchKeyword,
      sortOption: currentSort,
    };

    setIsLoading(true);
    setError(null);

    ProductService.searchProducts(searchRequest, 0, pageSize)
      .then((response) => {
        setProducts(response.content);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
      })
      .catch((err) => {
        console.error("상품 필터링 실패:", err);
        setError("상품 필터링 중 오류가 발생했습니다.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // 정렬 변경 핸들러
  const handleSortChange = (sortOption: SortOption) => {
    setCurrentSort(sortOption);
    // 정렬 변경 시 페이지는 유지 (useEffect에서 loadProducts 호출)
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // 페이지 변경 시 useEffect에서 loadProducts 호출
  };

  // 상품 상세 보기
  const handleViewProduct = (product: ProductSearchResponseDto) => {
    setSelectedProduct(product);
    navigate(`/admin/products/detail/${product.id}/${product.colorId}`);
  };

  // 상품 등록 페이지로 이동
  const handleCreateProduct = () => {
    navigate("/admin/products/add");
  };

  return (
    <div
      className={`${styles.productManagement} ${
        theme === "dark" ? styles.dark : ""
      }`}
    >
      <h1 className={styles.pageTitle}>상품 관리</h1>

      {/* 상품 통계 요약 */}
      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>전체 상품 수</div>
          <div className={styles.statValue}>
            {totalElements.toLocaleString()}
          </div>
        </div>
      </div>

      {/* 검색 및 필터 영역 */}
      <div className={styles.topControls}>
        <ProductSearchBar onSearch={handleSearch} theme={theme} />

        <div className={styles.actionButtons}>
          <button className={styles.createButton} onClick={handleCreateProduct}>
            <FiPlus /> 상품 등록
          </button>
        </div>
      </div>

      {/* 필터 영역 */}
      <ProductFilter onApplyFilter={handleApplyFilter} theme={theme} />

      {/* 정렬 영역 */}
      <ProductSort
        onSort={handleSortChange}
        currentSort={currentSort}
        theme={theme}
      />

      {/* 상품 목록 영역 */}
      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <ProductList
          products={products}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onViewProduct={handleViewProduct}
          theme={theme}
        />
      )}
    </div>
  );
};

export default ProductManagementPage;
