import React from "react";
import styled from "styled-components";

// 관심상품 리스트 스타일
const InterestProductContainer = styled.div`
  margin: 20px 0;
`;
const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const Title = styled.h3`
  font-size: 18px;
  letter-spacing: -0.27px;
  font-weight: bold;
  margin: 0;
`;

const MoreLink = styled.a`
  font-size: 13px;
  color: rgba(34, 34, 34, 0.5);
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const EmptyArea = styled.div`
  text-align: center;
  padding: 90px 0;
  border-radius: 12px;
  background-color: #fafafa;
  color: rgba(34, 34, 34, 0.5);
`;

const EmptyText = styled.p`
  font-size: 14px;
  margin: 0;
`;

const EmptyButton = styled.a`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  border: 1px solid #d3d3d3;
  border-radius: 10px;
  font-size: 12px;
  padding: 10px 14px;
  margin-top: 12px;
  text-decoration: none;
  color: rgba(34, 34, 34, 0.8);
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const ProductList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 10px;
`;

const ProductItem = styled.div`
  width: 20%;
  padding: 0 12px;
  position: relative;
  margin: 20px 0;
`;

const ItemInner = styled.a`
  display: block;
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  text-decoration: none;
`;

const ThumbBox = styled.div`
  position: relative;
  padding-top: 100%;
  background-color: #ebf0f5;
  border-radius: 8px;
`;

const ProductImage = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const InfoBox = styled.div`
  padding: 9px 4px 0;
`;

const BrandText = styled.p`
  font-size: 13px;
  font-weight: bold;
  color: #222;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProductName = styled.p`
  font-size: 13px;
  color: #222;
  line-height: 16px;
  max-height: 32px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 4px;
`;

const TagItem = styled.div`
  background-color: #f2f9f6;
  color: #31b46e;
  font-size: 10px;
  padding: 4px;
  border-radius: 2px;
`;

const Price = styled.div`
  padding-top: 12px;
`;

const Amount = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: #222;
`;

const Desc = styled.p`
  font-size: 11px;
  color: rgba(34, 34, 34, 0.5);
  margin-top: 2px;
`;

// 컴포넌트 정의
const InterestProduct = ({ products }: { products: any[] }) => {
  return (
    <InterestProductContainer>
      {/* 타이틀 섹션 */}
      <TitleContainer>
        <Title>관심 상품</Title>
        <MoreLink href="#">더보기 &gt;</MoreLink>
      </TitleContainer>
      {products.length === 0 ? (
        <EmptyArea>
          <EmptyText>추가하신 관심 상품이 없습니다.</EmptyText>
          <EmptyButton href="#">Shop 바로가기</EmptyButton>
        </EmptyArea>
      ) : (
        <ProductList>
          {products.map((product, index) => (
            <ProductItem key={index}>
              <ItemInner href="#">
                <ThumbBox>
                  <ProductImage src={product.image} alt={product.name} />
                </ThumbBox>
                <InfoBox>
                  <BrandText>{product.brand}</BrandText>
                  <ProductName>{product.name}</ProductName>
                  <Tags>
                    {product.tags.map((tag: string, tagIndex: number) => (
                      <TagItem key={tagIndex}>{tag}</TagItem>
                    ))}
                  </Tags>
                  <Price>
                    <Amount>{product.price}</Amount>
                    <Desc>즉시 구매가</Desc>
                  </Price>
                </InfoBox>
              </ItemInner>
            </ProductItem>
          ))}
        </ProductList>
      )}
    </InterestProductContainer>
  );
};

export default InterestProduct;
