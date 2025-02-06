import React, { useState } from "react";
import styled from "styled-components";
import AddCardModal from "../components/AddCardModal";

const PageContainer = styled.div`
  padding: 0 20px;
`;

const PageHeader = styled.div`
  display: flex;
  border-bottom: 3px solid #222;
  padding: 5px 0 22px;
`;
const TitleContainer = styled.div`
  display: block;
  unicode-bidi: isolate;
  font-size: 24px;
  letter-spacing: -0.36px;
  margin: 0;
  padding: 0;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  box-sizing: border-box;
`;

const Title = styled.h3`
  font-size: 24px;
  line-height: 29px;
  letter-spacing: -0.36px;
  margin: 0;
`;
const SubTitle = styled.p`
  color: rgba(34, 34, 34, 0.5);
  font-size: 12px;
  letter-spacing: -0.005em;
  margin: 0;
`;
const SubTitleButtonContainer = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  margin-left: auto;
  padding-left: 30px;
  padding-top: 4px;
`;

const AddButton = styled.a`
  align-items: center;
  display: inline-flex;
  justify-content: center;
  text-align: center;
  vertical-align: middle;
  background-color: #fff;
  color: rgba(34, 34, 34, 0.8);
  cursor: pointer;
  border: 1px solid #222;
  border-radius: 10px;
  font-size: 12px;
  height: 34px;
  letter-spacing: -0.06px;
  line-height: 32px;
  margin-right: 0;
  padding: 0 14px;
  text-decoration: none;

  &:hover {
    background-color: #f5f5f5;
  }
`;
const MyList = styled.div``;

const CardItem = styled.div`
  border-bottom: 2px solid #222;
  padding: 30px 0 29px;
  display: flex;
  align-items: center;
  position: relative;
`;

const InfoBind = styled.div`
  margin-right: 24px;
`;

const CardInfo = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 50px 17px 21px;
`;

const CardName = styled.span`
  background-color: #fff;
  border: 1px solid #ebebeb;
  border-radius: 8px;
  padding: 9px;
  text-align: center;
  font-size: 15px;
  letter-spacing: -0.15px;
`;

const CardNumber = styled.div`
  display: flex;
  align-items: center;
  margin-left: 17px;
`;

const Dot = styled.span`
  &::before {
    background-color: #222;
    border-radius: 100%;
    content: "";
    display: inline-flex;
    height: 5px;
    margin-left: 2px;
    width: 5px;
  }
`;

const Hyphen = styled.span`
  background-color: #000;
  height: 1px;
  margin: 0 2px;
  width: 4px;
`;

const Mark = styled.span`
  background-color: #bbb;
  border-radius: 10px;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  height: 18px;
  line-height: 18px;
  padding: 0 6px;
  margin-top: 2px;
`;

const ButtonBind = styled.div`
  margin-top: 12px;
  margin-left: auto;
`;

const DeleteButton = styled.a`
  border: 1px solid #d3d3d3;
  border-radius: 10px;
  font-size: 12px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  height: 34px;
  padding: 0 12px 0 11px;
  text-align: center;
  background-color: #fff;
  color: rgba(34, 34, 34, 0.8);
  cursor: pointer;
  &:hover {
    background-color: #f5f5f5;
  }
`;

const PaymentInfo: React.FC = () => {
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [cardList, setCardList] = useState([
    {
      cardNumber: "1234-5678-****-****", // 마스킹된 카드 번호
      cardName: "Visa", // 카드 이름 (예: Visa, MasterCard)
      expiryDate: "12/25", // 유효기간
      birthDate: "2000/01/01", // 생년월일
      password: "12", // 비밀번호 앞 2자리
      isDefault: true, // 기본 결제 카드 여부
      originalCardNumber: "1234-5678-1234-5678", // 원본 카드 번호
    },
  ]);
  const getCardName = (cardNumber: string): string => {
    const prefix = cardNumber.slice(0, 4);
    switch (prefix) {
      case "1234":
        return "Visa";
      case "5678":
        return "MasterCard";
      case "4321":
        return "Amex";
      default:
        return "Unknown";
    }
  };

  const openModal = () => setIsModalOpened(true);
  // 모달 닫기 및 데이터 처리
  const closeModal = (card?: {
    cardNumber: string;
    password: string;
    expiryDate: string;
    birthDate: string;
  }) => {
    setIsModalOpened(false);

    if (card) {
      const cardName = getCardName(card.cardNumber); // 카드사 결정
      const maskedCardNumber = card.cardNumber.replace(
        /(\d{4})-(\d{4})-(\d{4})-(\d{4})/,
        "$1-$2-****-****"
      );

      setCardList((prev) => [
        ...prev,
        {
          cardNumber: maskedCardNumber, // 마스킹된 카드 번호
          cardName, // 카드 이름
          expiryDate: card.expiryDate,
          birthDate: card.birthDate,
          password: card.password,
          isDefault: prev.length === 0, // 첫 번째 카드는 기본 결제 카드로 설정
          originalCardNumber: card.cardNumber, // 원본 카드 번호 저장
        },
      ]);
    }
  };
  // 새로운 카드 추가

  const CardNumberWrapper = styled.div`
    display: flex;
    flex-direction: column; /* 세로 방향으로 배치 */
    align-items: flex-start; /* 왼쪽 정렬 */
    margin-top: 8px; /* 카드 번호와 기본결제 간격 조정 */
  `;

  const removeCard = (index: number) => {
    setCardList((prev) => prev.filter((_, i) => i !== index));
  };
  return (
    <PageContainer>
      {/* 페이지 헤더 */}
      <PageHeader>
        <TitleContainer>
          결제 정보
          <SubTitle>
            수수료(페널티, 착불배송비 등)가 정산되지 않을 경우, 별도 고지 없이
            해당 금액을 결제 시도할 수 있습니다.
          </SubTitle>
        </TitleContainer>
        <SubTitleButtonContainer>
          <AddButton onClick={openModal}>
            <span>+ 새 카드 추가하기</span>
          </AddButton>
        </SubTitleButtonContainer>
      </PageHeader>

      {isModalOpened && (
        <AddCardModal isOpened={isModalOpened} onClose={closeModal} />
      )}
      <MyList>
        {cardList.map((card, index) => (
          <CardItem key={index}>
            <InfoBind>
              <CardInfo>
                <CardName>{card.cardName}</CardName>
                <CardNumberWrapper>
                  <CardNumber>
                    ••••
                    <Hyphen />
                    ••••
                    <Hyphen />
                    ••••
                    <Hyphen />
                    <span>{card.originalCardNumber.slice(15, 18)}</span>•
                  </CardNumber>
                  {card.isDefault && <Mark>기본결제</Mark>}
                </CardNumberWrapper>
              </CardInfo>
            </InfoBind>
            <ButtonBind>
              <DeleteButton onClick={() => removeCard(index)}>
                삭제
              </DeleteButton>
            </ButtonBind>
          </CardItem>
        ))}
      </MyList>
    </PageContainer>
  );
};

export default PaymentInfo;
