import React, { useState, useEffect } from "react";
import styled from "styled-components";
import AddCardModal from "../components/AddCardModal";
import { PaymentInfoDto } from "../types/paymentInfoTypes";
import { getPaymentInfos, deletePaymentInfo } from "../services/paymentService";

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

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px 0;
  color: #888;
  font-size: 16px;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px 0;
  color: #ef6253;
  font-size: 16px;
`;

const EmptyCardList = styled.div`
  text-align: center;
  padding: 40px 0;
  color: #888;
  font-size: 16px;
`;

const PaymentInfo: React.FC = () => {
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [cards, setCards] = useState<PaymentInfoDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 결제 정보 목록 불러오기
  const fetchCards = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPaymentInfos();
      setCards(data);
    } catch (err) {
      setError("결제 정보를 불러오는 데 실패했습니다.");
      console.error("결제 정보 불러오기 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const openModal = () => setIsModalOpened(true);

  // 모달 닫기 및 데이터 처리
  const closeModal = () => {
    setIsModalOpened(false);
    // 카드 추가 후 목록 다시 불러오기
    fetchCards();
  };

  // 카드 삭제 처리
  const handleDeleteCard = async (id: number) => {
    if (window.confirm("정말로 이 카드를 삭제하시겠습니까?")) {
      try {
        await deletePaymentInfo(id);
        // 삭제 후 목록 다시 불러오기
        fetchCards();
      } catch (err) {
        alert("카드 삭제에 실패했습니다.");
        console.error("카드 삭제 실패:", err);
      }
    }
  };

  // 카드 종류 결정 함수
  const getCardName = (cardNumber: string): string => {
    const firstDigit = cardNumber.charAt(0);

    switch (firstDigit) {
      case "3":
        return "AMEX";
      case "4":
        return "VISA";
      case "5":
        return "MasterCard";
      case "6":
        return "Discover";
      default:
        return "신용카드";
    }
  };

  // 마스킹된 카드 번호 반환
  const formatCardNumber = (cardNumber: string): string => {
    // 이미 마스킹 처리된 번호일 경우
    if (cardNumber.includes("*")) {
      return cardNumber;
    }

    // 마스킹 처리
    const parts = cardNumber.split("-");
    if (parts.length === 4) {
      return `${parts[0]}-${parts[1]}-****-${parts[3].slice(-3)}*`;
    }

    return cardNumber;
  };

  return (
    <PageContainer>
      {/* 페이지 헤더 */}
      <PageHeader>
        <TitleContainer>
          <Title>결제 정보</Title>
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
        {loading ? (
          <LoadingMessage>결제 정보를 불러오는 중입니다...</LoadingMessage>
        ) : error ? (
          <ErrorMessage>{error}</ErrorMessage>
        ) : cards.length === 0 ? (
          <EmptyCardList>
            등록된 결제 정보가 없습니다. 새 카드를 추가해주세요.
          </EmptyCardList>
        ) : (
          cards.map((card, index) => (
            <CardItem key={card.id}>
              <InfoBind>
                <CardInfo>
                  <CardName>{getCardName(card.cardNumber)}</CardName>
                  <CardNumber>
                    ••••
                    <Hyphen />
                    ••••
                    <Hyphen />
                    ••••
                    <Hyphen />
                    <span>{card.cardNumber.slice(-4, -1)}</span>•
                  </CardNumber>
                  {index === 0 && <Mark>기본결제</Mark>}
                </CardInfo>
              </InfoBind>
              <ButtonBind>
                <DeleteButton onClick={() => handleDeleteCard(card.id)}>
                  삭제
                </DeleteButton>
              </ButtonBind>
            </CardItem>
          ))
        )}
      </MyList>
    </PageContainer>
  );
};

export default PaymentInfo;
