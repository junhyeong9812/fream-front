// ProductDetailPage.tsx
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import styles from "./productDetailPage.module.css";
import {
  getProductDetail,
  ProductDetailResponse,
} from "../services/productDetailServices";
import ProductDetailHeader from "../components/ProductdetailHeader";
import ProductDetailImage from "../components/ProductDetailImage";

const ProductDetailPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [selectedSize, setSelectedSize] = useState("모든 사이즈");
  const [productDetail, setProductDetail] =
    useState<ProductDetailResponse | null>(null);
  const [colorName, setColorName] = useState(
    () => searchParams.get("color") || ""
  ); // URL의 color 파라미터로 초기화
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // URL의 color 파라미터가 변경될 때 colorName 업데이트
    const urlColor = searchParams.get("color") || "";
    setColorName(urlColor);
  }, [searchParams]);

  useEffect(() => {
    const fetchProductDetail = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const data = await getProductDetail(id, colorName);
        setProductDetail(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch product details"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetail();
  }, [id, colorName]);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!productDetail) return <div>No product found</div>;

  return (
    <>
      <ProductDetailHeader
        detail_main_image={[productDetail.thumbnailImageUrl]}
        main_info_shoes={{
          gender: "MAN", // 백엔드 응답에 gender 필드 추가 필요
          nameEng: productDetail.englishName,
          nameKor: productDetail.name,
        }}
        final_size={selectedSize}
        setFinal_Size={setSelectedSize}
      />
      <div className={styles.detailRoot}>
        <div className={styles.detailMainContainer}>
          <ProductDetailImage
            currentImage={productDetail.thumbnailImageUrl}
            productId={productDetail.id}
            otherColors={productDetail.otherColors}
          />
          <div className={styles.detailDivider} />
          {/* Product Info Component will go here */}
        </div>

        <div className={styles.detailSecondContainer}>
          {/* Additional Product Details Component will go here */}
        </div>

        <div className={styles.detailThirdContainer}>
          {/* Size Information Component will go here */}
        </div>

        <div className={styles.detailFourthContainer}>
          {/* Related Products Component 1 will go here */}
        </div>

        <div className={styles.detailFourthContainer}>
          {/* Related Products Component 2 will go here */}
        </div>

        <div className={styles.detailSpacer} />
      </div>
    </>
  );
};

export default ProductDetailPage;
