import React from "react";
import { ProductSearchResponseDto } from "../types/productManagementTypes";
import styles from "./ProductList.module.css";

interface ProductListProps {
  products: ProductSearchResponseDto[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onViewProduct: (product: ProductSearchResponseDto) => void;
  theme: "light" | "dark";
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  currentPage,
  totalPages,
  onPageChange,
  onViewProduct,
  theme,
}) => {
  // 가격 포맷 함수
  const formatPrice = (price: number) => {
    return price.toLocaleString("ko-KR") + "원";
  };

  // 페이지네이션 처리
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    // 현재 페이지 그룹 계산 (5개씩 그룹화)
    const currentGroup = Math.floor(currentPage / 5);
    const startPage = currentGroup * 5;
    const endPage = Math.min(startPage + 4, totalPages - 1);

    const pageNumbers = [];

    // 이전 그룹 버튼
    if (currentGroup > 0) {
      pageNumbers.push(
        <button
          key="prev-group"
          onClick={() => onPageChange(startPage - 1)}
          className={styles.pageButton}
        >
          &lt;&lt;
        </button>
      );
    }

    // 이전 페이지 버튼
    if (currentPage > 0) {
      pageNumbers.push(
        <button
          key="prev-page"
          onClick={() => onPageChange(currentPage - 1)}
          className={styles.pageButton}
        >
          &lt;
        </button>
      );
    }

    // 페이지 번호 버튼
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`${styles.pageButton} ${
            currentPage === i ? styles.activePage : ""
          }`}
        >
          {i + 1}
        </button>
      );
    }

    // 다음 페이지 버튼
    if (currentPage < totalPages - 1) {
      pageNumbers.push(
        <button
          key="next-page"
          onClick={() => onPageChange(currentPage + 1)}
          className={styles.pageButton}
        >
          &gt;
        </button>
      );
    }

    // 다음 그룹 버튼
    if (endPage < totalPages - 1) {
      pageNumbers.push(
        <button
          key="next-group"
          onClick={() => onPageChange(endPage + 1)}
          className={styles.pageButton}
        >
          &gt;&gt;
        </button>
      );
    }

    return <div className={styles.pagination}>{pageNumbers}</div>;
  };

  return (
    <div
      className={`${styles.productListContainer} ${
        theme === "dark" ? styles.dark : ""
      }`}
    >
      {products.length === 0 ? (
        <div className={styles.emptyProducts}>
          <p>검색 결과가 없습니다.</p>
        </div>
      ) : (
        <>
          <div className={styles.tableContainer}>
            <table className={styles.productTable}>
              <thead>
                <tr>
                  <th className={styles.idCol}>ID</th>
                  <th className={styles.imageCol}>이미지</th>
                  <th className={styles.nameCol}>상품명</th>
                  <th className={styles.brandCol}>브랜드</th>
                  <th className={styles.colorCol}>색상</th>
                  <th className={styles.priceCol}>발매가</th>
                  <th className={styles.priceCol}>현재가</th>
                  <th className={styles.interestCol}>관심수</th>
                  <th className={styles.actionCol}>액션</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={`${product.id}-${product.colorId}`}
                    className={styles.productRow}
                    onClick={() => onViewProduct(product)}
                  >
                    <td className={styles.idCol}>{product.colorId}</td>
                    <td className={styles.imageCol}>
                      <img
                        src={
                          product.thumbnailImageUrl ||
                          "https://via.placeholder.com/60"
                        }
                        alt={product.name}
                        className={styles.productImage}
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://via.placeholder.com/60";
                        }}
                      />
                    </td>
                    <td className={styles.nameCol}>
                      <div className={styles.productName}>{product.name}</div>
                      <div className={styles.productEnglishName}>
                        {product.englishName}
                      </div>
                    </td>
                    <td className={styles.brandCol}>{product.brandName}</td>
                    <td className={styles.colorCol}>{product.colorName}</td>
                    <td className={styles.priceCol}>
                      {formatPrice(product.releasePrice)}
                    </td>
                    <td className={styles.priceCol}>
                      {formatPrice(product.price)}
                    </td>
                    <td className={styles.interestCol}>
                      {product.interestCount.toLocaleString()}
                    </td>
                    <td className={styles.actionCol}>
                      <button
                        className={styles.viewButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewProduct(product);
                        }}
                      >
                        상세보기
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {renderPagination()}
        </>
      )}
    </div>
  );
};

export default ProductList;
