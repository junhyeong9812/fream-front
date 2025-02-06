import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FiX } from "react-icons/fi";
import DeliveryCheck from "./DeliveryCheck";
import { AddAddressModalProps, AddressData } from "../types/mypageTypes";

// 다음 주소 API 스크립트 추가
declare global {
  interface Window {
    daum: any;
  }
}
// 스타일 추가: 레이어 버튼 영역
const LayerButton = styled.div`
  display: flex;
  justify-content: center;
  padding: 24px 32px 32px;
`;

// 스타일 추가: 버튼 공통 스타일
const Button = styled.a<{ variant: "outline" | "solid" }>`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  vertical-align: middle;
  border-radius: 10px;
  font-size: 14px;
  height: 42px;
  padding: 0 18px;
  width: 120px;
  cursor: pointer;
  text-decoration: none;

  ${(props) =>
    props.variant === "outline"
      ? `
    border: 1px solid #d3d3d3;
    color: rgba(34, 34, 34, 0.8);
    background-color: #fff;
  `
      : `
    background-color: #222;
    color: #fff;
    font-weight: 700;
  `}

  &:not(:first-child) {
    margin-left: 8px;
  }
`;

// 레이어 배경 스타일
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(34, 34, 34, 0.5);
  z-index: 1010;
`;
// 스타일 추가: 컨텐츠 영역
const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 32px;
`;

// 모달 컨테이너
const ModalContainer = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.1);
  width: 520px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

// 닫기 버튼 스타일
const CloseButton = styled(FiX)`
  position: absolute;
  top: 14px;
  right: 20px;
  cursor: pointer;
  width: 24px;
  height: 24px;
`;

// 제목 스타일
const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  text-align: center;
`;

// 인풋박스 스타일
const InputBox = styled.div<{
  isFirstChild?: boolean;
  hasError?: boolean;
  isActive?: boolean;
}>`
  padding: ${(props) =>
    props.isFirstChild
      ? "0 0 14px"
      : "16px 0 14px"}; /* 첫 번째 요소만 위쪽 패딩 제거 */
  position: relative;

  h4 {
    font-size: 13px;
    color: ${(props) => (props.hasError ? "#f15746" : "#222")};
    letter-spacing: -0.07px;
  }

  input {
    border: none; /* 모든 방향의 보더 제거 */
    border-bottom: 1px solid
      ${(props) =>
        props.hasError ? "#f15746" : props.isActive ? "#000" : "#ebebeb"};
    font-size: 15px;
    padding: 8px 0;
    width: 100%;
    outline: none;
    color: #222;
  }

  p {
    color: #f15746;
    font-size: 11px;
    line-height: 16px;
    position: absolute;
    display: ${(props) => (props.hasError ? "block" : "none")};
  }
  a {
    bottom: 8px;
    position: absolute;
    right: 0;
    border: 1px solid #d3d3d3;
    border-radius: 10px;
    font-size: 12px;
    height: 34px;
    letter-spacing: -0.06px;
    padding: 0 14px;
    align-items: center;
    background-color: #fff;
    color: rgba(34, 34, 34, 0.8);
    cursor: pointer;
    display: inline-flex;
    justify-content: center;
    text-align: center;
    vertical-align: middle;
    margin-bottom: 10px;
  }
`;
// 체크박스 아이템 스타일
const CheckboxItem = styled.div`
  font-size: 0;
  position: relative;
  float: left;
  margin-right: 19px;

  &:last-child {
    margin-right: 0;
  }
`;

// 모달 타이틀 영역
const TitleSection = styled.div`
  padding: 18px 50px;
`;

// 모달 컴포넌트
const AddAddressModal: React.FC<AddAddressModalProps> = ({
  onClose,
  onSubmit,
  initialData,
}) => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [zonecode, setZonecode] = useState("");
  const [roadAddress, setRoadAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [isDefaultAddress, setIsDefaultAddress] = useState(false); // 체크박스 상태 관리

  const [activeInput, setActiveInput] = useState<string | null>(null);

  // 초기값 설정
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setPhoneNumber(initialData.phoneNumber);
      setZonecode(initialData.zonecode);
      setRoadAddress(initialData.roadAddress);
      setDetailAddress(initialData.detailAddress);
      setIsDefaultAddress(initialData.isDefaultAddress);
    }
  }, [initialData]);

  const handleSubmit = () => {
    const newData: AddressData = {
      id: initialData?.id || 0, // 수정 시 기존 id 유지
      name,
      phoneNumber,
      zonecode,
      roadAddress,
      detailAddress,
      isDefaultAddress,
    };

    onSubmit(newData);
  };

  // 다음 주소 API 호출
  const openPostcode = () => {
    new window.daum.Postcode({
      oncomplete: (data: any) => {
        setZonecode(data.zonecode);
        setRoadAddress(data.roadAddress);
      },
    }).open();
  };

  // 에러 상태
  const [nameError, setNameError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);

  const validateName = () => {
    const isValid = name.length >= 2 && name.length <= 50;
    setNameError(!isValid);
  };

  const validatePhoneNumber = () => {
    const isValid = /^010\d{8}$/.test(phoneNumber);
    setPhoneError(!isValid);
  };

  return (
    <ModalOverlay>
      <ModalContainer>
        <CloseButton onClick={onClose} />
        {/* 타이틀 영역 */}
        <TitleSection>
          <ModalTitle>새 주소 추가</ModalTitle>
        </TitleSection>

        {/* 입력 폼 영역 */}
        <ContentSection>
          {/* 이름 입력 */}
          <InputBox
            hasError={nameError}
            isActive={activeInput === "name"}
            isFirstChild={true}
          >
            <h4>이름</h4>
            <input
              type="text"
              placeholder="이름을 입력하세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setActiveInput("name")}
              onBlur={() => {
                validateName();
                setActiveInput(null);
              }}
            />
            <p>올바른 이름을 입력해주세요.(2자~50자)</p>
          </InputBox>

          {/* 휴대폰 번호 입력 */}
          <InputBox hasError={phoneError} isActive={activeInput === "phone"}>
            <h4>휴대폰 번호</h4>
            <input
              type="text"
              placeholder="-없이 입력"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              onFocus={() => setActiveInput("phone")}
              onBlur={() => {
                validatePhoneNumber();
                setActiveInput(null);
              }}
            />
            <p>정확한 휴대폰 번호를 입력해주세요.</p>
          </InputBox>
          {/* 우편번호 번호 입력 */}
          <InputBox>
            <h4>우편번호 번호</h4>
            <input
              type="text"
              placeholder="우편 번호를 검색하세요."
              value={zonecode}
              readOnly
            />
            <a onClick={openPostcode}>우편번호</a>
          </InputBox>
          {/* 주소 입력 */}
          <InputBox isActive={activeInput === "address"}>
            <h4>주소</h4>
            <input
              type="text"
              placeholder="우편 번호 검색 후, 자동 입력됩니다."
              value={roadAddress}
              readOnly
            />
          </InputBox>

          {/* 상세 주소 입력 */}
          <InputBox isActive={activeInput === "detail"}>
            <h4>상세 주소</h4>
            <input
              type="text"
              placeholder="건물, 아파트, 동/호수 입력"
              value={detailAddress}
              onChange={(e) => setDetailAddress(e.target.value)}
              onFocus={() => setActiveInput("detail")}
              onBlur={() => setActiveInput(null)}
            />
          </InputBox>
          {/* 기본 배송지 체크박스 */}
          <CheckboxItem>
            <DeliveryCheck
              isChecked={isDefaultAddress}
              onToggle={() => setIsDefaultAddress((prev) => !prev)}
            />
          </CheckboxItem>
        </ContentSection>
        {/* 버튼 영역 */}
        <LayerButton>
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button variant="solid" onClick={handleSubmit}>
            저장하기
          </Button>
        </LayerButton>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default AddAddressModal;
