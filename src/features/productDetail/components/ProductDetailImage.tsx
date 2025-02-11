// ProductDetailImage.tsx
import { useNavigate } from "react-router-dom";
import { Carousel } from "react-bootstrap";
import styles from "./productDetailImage.module.css";
import { ColorDetailDto } from "../services/productDetailServices";

interface ProductDetailImageProps {
  currentImage: string;
  productId: number;
  otherColors: ColorDetailDto[];
}

const ProductDetailImage = ({
  currentImage,
  productId,
  otherColors,
}: ProductDetailImageProps) => {
  const navigate = useNavigate();

  // 현재 이미지와 다른 색상들의 이미지를 하나의 배열로 결합
  const allImages = [
    currentImage,
    ...otherColors.map((color) => color.thumbnailImageUrl),
  ];

  const handleColorClick = (colorName: string) => {
    navigate(`/products/${productId}?color=${colorName}`);
  };

  return (
    <div className={styles.detailImgForm}>
      <div className={styles.detailImgContainer}>
        <Carousel
          interval={null}
          controls={true}
          indicators={false}
          wrap={true}
          slide={false} // 이 옵션이 중요합니다
          className={styles.customCarousel}
        >
          {allImages.map((img, i) => (
            <Carousel.Item key={i} className={styles.carouselItem}>
              <img
                src={img}
                alt={`Product view ${i + 1}`}
                className={styles.mainImage}
              />
            </Carousel.Item>
          ))}
        </Carousel>
        <div className={styles.detailImgInfo}>
          {otherColors.map((color) => (
            <img
              key={color.colorId}
              src={color.thumbnailImageUrl}
              alt={color.colorName}
              className={styles.colorThumbnail}
              onClick={() => handleColorClick(color.colorName)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailImage;
