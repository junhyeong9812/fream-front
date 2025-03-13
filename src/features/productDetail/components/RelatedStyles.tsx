import React, { useEffect, useState } from "react";
import styles from "./RelatedStyles.module.css";
import styleService from "../../style/services/styleService";
import StylePostItem from "../../style/components/StylePostItem";
import { StyleResponseDto } from "../../style/types/styleTypes";

interface RelatedStylesProps {
  brandName: string;
}

const RelatedStyles: React.FC<RelatedStylesProps> = ({ brandName }) => {
  const [styleItems, setStyleItems] = useState<StyleResponseDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [totalElements, setTotalElements] = useState<number>(0);

  const fetchStyles = async (pageNumber: number) => {
    try {
      setLoading(true);
      const result = await styleService.getStyles(pageNumber, 10, {
        brandName,
      });

      if (pageNumber === 0) {
        setStyleItems(result.content);
      } else {
        setStyleItems((prev) => [...prev, ...result.content]);
      }

      setHasMore(!result.last);
      setTotalElements(result.totalElements);
      setError(null);
    } catch (err) {
      setError("스타일 정보를 불러오는데 실패했습니다.");
      console.error("스타일 로딩 오류:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (brandName) {
      fetchStyles(0);
    }
  }, [brandName]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchStyles(nextPage);
  };

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.relatedStylesContainer}>
      <h2 className={styles.title}>관련 스타일</h2>

      {styleItems.length > 0 ? (
        <>
          <div className={styles.stylesGrid}>
            {styleItems.map((item) => (
              <StylePostItem key={item.id} {...item} />
            ))}
          </div>

          <div className={styles.loadMoreContainer}>
            {loading && <div className={styles.loading}>로딩 중...</div>}

            {!loading && hasMore && (
              <button
                className={styles.loadMoreButton}
                onClick={handleLoadMore}
              >
                더 보기
              </button>
            )}

            {!hasMore && styleItems.length > 0 && (
              <div className={styles.noMoreItems}>
                더 이상 스타일이 없습니다.
              </div>
            )}
          </div>
        </>
      ) : (
        !loading && (
          <div className={styles.noItems}>관련 스타일이 없습니다.</div>
        )
      )}
    </div>
  );
};

export default RelatedStyles;
