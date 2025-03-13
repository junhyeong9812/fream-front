import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./StyleImageCarousel.module.css";

interface StyleImageCarouselProps {
  mediaUrls: string[];
}

const StyleImageCarousel: React.FC<StyleImageCarouselProps> = ({
  mediaUrls,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  if (!mediaUrls || mediaUrls.length === 0) {
    return (
      <div className={styles.styleImageContainer}>
        <img src="/api/placeholder/600/600" alt="이미지 없음" />
      </div>
    );
  }

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? mediaUrls.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === mediaUrls.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className={styles.styleImageContainer}>
      <div className={styles.carouselWrapper}>
        <div
          className={styles.imageSlide}
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {mediaUrls.map((url, index) => (
            <div className={styles.imageItem} key={index}>
              <img src={url} alt={`스타일 이미지 ${index + 1}`} />
            </div>
          ))}
        </div>

        {mediaUrls.length > 1 && (
          <>
            <button
              className={styles.prevButton}
              onClick={handlePrev}
              type="button"
              aria-label="이전 이미지"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              className={styles.nextButton}
              onClick={handleNext}
              type="button"
              aria-label="다음 이미지"
            >
              <ChevronRight size={24} />
            </button>

            <div className={styles.indicators}>
              {mediaUrls.map((_, index) => (
                <div
                  key={index}
                  className={
                    index === activeIndex
                      ? styles.activeIndicator
                      : styles.indicator
                  }
                  onClick={() => goToSlide(index)}
                  role="button"
                  tabIndex={0}
                  aria-label={`이미지 ${index + 1}로 이동`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StyleImageCarousel;
