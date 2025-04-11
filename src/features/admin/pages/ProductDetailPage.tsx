import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiEdit2, FiPlus, FiTrash2, FiArrowLeft } from "react-icons/fi";
import { useTheme } from "../../../global/context/ThemeContext";
import { AdminProductService } from "../services/adminProductService";
import { ProductColorService } from "../services/productColorService";
import LoadingSpinner from "../../../global/components/common/LoadingSpinner";
import ErrorMessage from "../../../global/components/common/ErrorMessage";
import styles from "./ProductDetailPage.module.css";

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();

  // 상품 정보 상태
  const [productInfo, setProductInfo] = useState<any>(null);
  const [colorVariants, setColorVariants] = useState<any[]>([]);
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);

  // 로딩 및 에러 상태
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 상품 정보 로드
  useEffect(() => {
    const loadProductData = async () => {
      if (!productId) return;

      setIsLoading(true);
      setError(null);

      try {
        // 관리자용 API를 통해 상품 상세 정보 로드
        const productData = await AdminProductService.getProductDetailForAdmin(
          Number(productId)
        );
        setProductInfo(productData);

        // 색상 정보 가공 및 상태 업데이트
        if (productData.colors && productData.colors.length > 0) {
          setColorVariants(
            productData.colors.map((color: any) => ({
              id: color.id,
              colorName: color.colorName,
              sizes: color.sizes,
              content: color.content,
              thumbnailImage: color.thumbnailImageUrl
                ? `/products/query/${productId}/images?imageName=${color.thumbnailImageUrl}`
                : "/api/placeholder/400/300",
              images: color.images.map(
                (img: any) =>
                  `/products/query/${productId}/images?imageName=${img.imageUrl}`
              ),
              detailImages: color.detailImages.map(
                (img: any) =>
                  `/products/query/${productId}/images?imageName=${img.imageUrl}`
              ),
            }))
          );

          // 첫 번째 색상 선택
          setSelectedColorId(productData.colors[0].id);
        }
      } catch (err) {
        console.error("상품 정보 로드 실패:", err);
        setError("상품 정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProductData();
  }, [productId]);

  // 선택된 색상 변경 핸들러
  const handleColorSelect = (colorId: number) => {
    setSelectedColorId(colorId);
  };

  // 선택된 색상 정보
  const selectedColor =
    colorVariants.find((color) => color.id === selectedColorId) || null;

  // 색상 이름 한글 변환
  const getColorKoreanName = (colorName: string): string => {
    const colorMap: Record<string, string> = {
      BLACK: "블랙",
      GREY: "그레이",
      WHITE: "화이트",
      IVORY: "아이보리",
      BEIGE: "베이지",
      BROWN: "브라운",
      KHAKI: "카키",
      GREEN: "그린",
      LIGHT_GREEN: "라이트그린",
      MINT: "민트",
      NAVY: "네이비",
      BLUE: "블루",
      SKY_BLUE: "스카이블루",
      PURPLE: "퍼플",
      PINK: "핑크",
      RED: "레드",
      ORANGE: "오렌지",
      YELLOW: "옐로우",
      SILVER: "실버",
      GOLD: "골드",
      MIX: "믹스",
    };

    return colorMap[colorName] || colorName;
  };

  // 상품 편집 페이지로 이동
  const handleEditProduct = () => {
    navigate(`/admin/products/edit/${productId}`);
  };

  // 색상 편집 페이지로 이동
  const handleEditColor = (colorId: number) => {
    navigate(`/admin/products/color/edit/${productId}/${colorId}`);
  };

  // 색상 추가 페이지로 이동
  const handleAddColor = () => {
    navigate(`/admin/products/color/add/${productId}`);
  };

  // 상품 삭제 핸들러
  const handleDeleteProduct = async () => {
    if (!productId) return;

    if (
      !window.confirm(
        "정말로 이 상품을 삭제하시겠습니까? 연관된 모든 색상과 사이즈 정보도 함께 삭제됩니다. 이 작업은 되돌릴 수 없습니다."
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      await AdminProductService.deleteProduct(Number(productId));
      alert("상품이 성공적으로 삭제되었습니다.");
      navigate("/admin/products");
    } catch (err) {
      console.error("상품 삭제 실패:", err);
      setError("상품 삭제 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 색상 삭제 핸들러
  const handleDeleteColor = async (colorId: number) => {
    if (
      !window.confirm(
        "정말로 이 색상을 삭제하시겠습니까? 연관된 모든 사이즈 정보도 함께 삭제됩니다. 이 작업은 되돌릴 수 없습니다."
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      await ProductColorService.deleteProductColor(colorId);

      // UI에서 색상 제거
      setColorVariants((prev) => prev.filter((color) => color.id !== colorId));

      // 다른 색상이 있으면 선택
      if (selectedColorId === colorId) {
        const remainingColors = colorVariants.filter(
          (color) => color.id !== colorId
        );
        if (remainingColors.length > 0) {
          setSelectedColorId(remainingColors[0].id);
        } else {
          setSelectedColorId(null);
        }
      }

      alert("색상이 성공적으로 삭제되었습니다.");
    } catch (err) {
      console.error("색상 삭제 실패:", err);
      setError("색상 삭제 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div
        className={`${styles.productDetail} ${
          theme === "dark" ? styles.dark : ""
        }`}
      >
        <ErrorMessage
          message={error}
          onRetry={() => window.location.reload()}
        />
        <button
          className={styles.backButton}
          onClick={() => navigate("/admin/products")}
        >
          <FiArrowLeft /> 목록으로 돌아가기
        </button>
      </div>
    );
  }

  if (!productInfo) {
    return (
      <div
        className={`${styles.productDetail} ${
          theme === "dark" ? styles.dark : ""
        }`}
      >
        <ErrorMessage message="상품 정보를 찾을 수 없습니다." />
        <button
          className={styles.backButton}
          onClick={() => navigate("/admin/products")}
        >
          <FiArrowLeft /> 목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div
      className={`${styles.productDetail} ${
        theme === "dark" ? styles.dark : ""
      }`}
    >
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>상품 상세</h1>
        <div className={styles.headerButtons}>
          <button
            className={styles.backButton}
            onClick={() => navigate("/admin/products")}
            title="목록으로 돌아가기"
          >
            <FiArrowLeft /> 목록으로
          </button>
          <button
            className={styles.editButton}
            onClick={handleEditProduct}
            title="상품 정보 수정"
          >
            <FiEdit2 /> 상품 수정
          </button>
          <button
            className={styles.deleteButton}
            onClick={handleDeleteProduct}
            title="상품 삭제"
          >
            <FiTrash2 /> 삭제
          </button>
        </div>
      </div>

      {/* 상품 기본 정보 */}
      <div className={styles.productInfoCard}>
        <div className={styles.productBasicInfo}>
          <h2 className={styles.productName}>{productInfo.name}</h2>
          <p className={styles.productEnglishName}>{productInfo.englishName}</p>

          <div className={styles.productInfoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>브랜드:</span>
              <span className={styles.infoValue}>{productInfo.brandName}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>카테고리:</span>
              <span className={styles.infoValue}>
                {productInfo.mainCategoryName} &gt; {productInfo.categoryName}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>모델번호:</span>
              <span className={styles.infoValue}>
                {productInfo.modelNumber}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>발매가:</span>
              <span className={styles.infoValue}>
                {productInfo.releasePrice.toLocaleString()}원
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>발매일:</span>
              <span className={styles.infoValue}>
                {productInfo.releaseDate}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>성별:</span>
              <span className={styles.infoValue}>
                {productInfo.gender === "UNISEX"
                  ? "유니섹스"
                  : productInfo.gender === "MALE"
                  ? "남성"
                  : productInfo.gender === "FEMALE"
                  ? "여성"
                  : "키즈"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 색상 변형 섹션 */}
      <div className={styles.colorVariantsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>색상 ({colorVariants.length})</h2>
          <button
            className={styles.addButton}
            onClick={handleAddColor}
            title="색상 추가"
          >
            <FiPlus /> 색상 추가
          </button>
        </div>

        {/* 색상 선택 탭 */}
        <div className={styles.colorTabs}>
          {colorVariants.map((color) => (
            <div
              key={color.id}
              className={`${styles.colorTab} ${
                selectedColorId === color.id ? styles.active : ""
              }`}
              onClick={() => handleColorSelect(color.id)}
            >
              <div
                className={styles.colorSwatch}
                style={{ backgroundColor: color.colorName.toLowerCase() }}
              ></div>
              <span>{getColorKoreanName(color.colorName)}</span>
            </div>
          ))}
        </div>

        {/* 선택된 색상 상세 정보 */}
        {selectedColor && (
          <div className={styles.colorDetail}>
            <div className={styles.colorDetailHeader}>
              <h3 className={styles.colorName}>
                {getColorKoreanName(selectedColor.colorName)}
              </h3>
              <div className={styles.colorActions}>
                <button
                  className={styles.editColorButton}
                  onClick={() => handleEditColor(selectedColor.id)}
                  title="색상 수정"
                >
                  <FiEdit2 /> 수정
                </button>
                {colorVariants.length > 1 && (
                  <button
                    className={styles.deleteColorButton}
                    onClick={() => handleDeleteColor(selectedColor.id)}
                    title="색상 삭제"
                  >
                    <FiTrash2 /> 삭제
                  </button>
                )}
              </div>
            </div>

            {/* 색상 이미지 및 정보 */}
            <div className={styles.colorContent}>
              {/* 썸네일 및 이미지 */}
              <div className={styles.colorImages}>
                <div className={styles.thumbnailContainer}>
                  <img
                    src={
                      "https://www.pinjun.xyz" + selectedColor.thumbnailImage
                    }
                    alt={`${productInfo.name} - ${getColorKoreanName(
                      selectedColor.colorName
                    )} 썸네일`}
                    className={styles.thumbnailImage}
                  />
                </div>
                <div className={styles.imagesList}>
                  {selectedColor.images.map((image: string, index: number) => (
                    <div key={index} className={styles.colorImageItem}>
                      <img
                        src={"https://www.pinjun.xyz" + image}
                        alt={`${productInfo.name} - ${getColorKoreanName(
                          selectedColor.colorName
                        )} 이미지 ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* 사이즈 정보 */}
              <div className={styles.sizeInfo}>
                <h4 className={styles.sizeTitle}>사이즈</h4>
                <div className={styles.sizeGrid}>
                  {selectedColor.sizes.map((size: string) => (
                    <div key={size} className={styles.sizeItem}>
                      {size}
                    </div>
                  ))}
                </div>
              </div>

              {/* 상세 설명 */}
              <div className={styles.contentInfo}>
                <h4 className={styles.contentTitle}>상세 설명</h4>
                <div
                  className={styles.htmlContent}
                  dangerouslySetInnerHTML={{ __html: selectedColor.content }}
                ></div>
              </div>

              {/* 상세 이미지 */}
              {selectedColor.detailImages &&
                selectedColor.detailImages.length > 0 && (
                  <div className={styles.detailImages}>
                    <h4 className={styles.detailImagesTitle}>상세 이미지</h4>
                    <div className={styles.detailImagesList}>
                      {selectedColor.detailImages.map(
                        (image: string, index: number) => (
                          <img
                            key={index}
                            src={image}
                            alt={`${productInfo.name} - ${getColorKoreanName(
                              selectedColor.colorName
                            )} 상세 이미지 ${index + 1}`}
                            className={styles.detailImage}
                          />
                        )
                      )}
                    </div>
                  </div>
                )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
