// src/components/listBoxComponents.tsx
import React from "react";
import styled from "styled-components";

// 여백 스타일
const Spacer = styled.div`
  height: 40px;
`;

// 컨테이너 스타일
const Container = styled.div`
  border-radius: 10px;
  padding: 20px 16px;
  background-color: #fafafa;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px 0;
`;

// 텍스트 스타일
const TextBody = styled.p`
  color: rgba(34, 34, 34, 0.5);
  text-align: center;
  width: 100%;
  font-size: 13px;
  line-height: 1.2;
`;

// 버튼 컨테이너 스타일
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 8px;
`;

// 버튼 스타일 수정
const Button = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  text-decoration: none;
  color: rgb(34, 34, 34);
  background-color: #fff; /* 버튼 배경 흰색 */
  border-radius: 8px;
  cursor: pointer;
  width: 100%; /* 버튼이 부모 컨테이너 가로 전체를 채움 */

  &:hover {
    background-color: #f0f0f0; /* 호버 시 약간 회색 */
  }
`;

// 구매내역 타이틀 컨테이너 스타일
const TitleContainer = styled.div`
  display: flex;
  max-width: 100%;
  padding-bottom: 16px;
`;

// 구매내역 타이틀 스타일
const Title = styled.h3`
  font-size: 18px;
  letter-spacing: -0.27px;
  margin: 0;
  font-weight: bold;
`;

// props 타입 정의
interface ListBoxProps {
  title: string; // "판매내역" | "보관판매내역" | "구매내역"
  tabs?: Array<{
    title: string;
    count: number;
    isTotal?: boolean;
    href: string;
  }>;
  onTabClick?: (href: string) => void;
}

const ListBoxComponent: React.FC<ListBoxProps> = ({
  title,
  tabs = [],
  onTabClick,
}) => {
  // 타이틀 기반 설정 (구매내역 추가)
  const getConfig = () => {
    switch (title) {
      case "판매내역":
        return {
          text: "Fream을 통해 판매해보세요",
          buttonText: "판매하기",
          href: "/sell",
        };
      case "보관판매내역":
        return {
          text: "한번에 신청하고 한번에 발송하세요",
          buttonText: "보관 판매하기",
          href: "/store",
        };
      case "구매내역":
        return {
          text: "Fream을 통해 구매해보세요",
          buttonText: "쇼핑하기",
          href: "/search",
        };
      default:
        return {
          text: "Fream과 함께하세요",
          buttonText: "쇼핑하기",
          href: "/search",
        };
    }
  };

  const config = getConfig();

  return (
    <>
      <Spacer /> {/* 여백 */}
      <TitleContainer>
        <Title>{title}</Title> {/* 동적으로 타이틀 표시 */}
      </TitleContainer>
      <Container>
        {/* 텍스트 */}
        <TextBody>{config.text}</TextBody>

        {/* 버튼 */}
        <ButtonContainer>
          <Button href={config.href}>{config.buttonText}</Button>
        </ButtonContainer>
      </Container>
    </>
  );
};

export default ListBoxComponent;
