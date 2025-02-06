import React, { useState } from "react";
import styled from "styled-components";
import { IoIosArrowDown } from "react-icons/io";
import { FaCheck } from "react-icons/fa";

const PageContainer = styled.div`
  padding: 0 20px;
`;

const PageHeader = styled.div`
  display: flex;
  border-bottom: 3px solid #222;
  padding-bottom: 16px;
  margin-bottom: 40px;
`;

const Title = styled.h3`
  font-size: 24px;
  line-height: 29px;
  letter-spacing: -0.36px;
  margin: 0;
`;

const MyAccount = styled.div`
  width: 480px;
  margin: 0;
`;

const ContentTitle = styled.div`
  display: flex;
  padding-bottom: 16px;
`;

const FormWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

const Description = styled.p`
  font-size: 13px;
  font-weight: 400;
  letter-spacing: -0.07px;
  margin-bottom: 20px;
`;

const InputBox = styled.div`
  position: relative;
  padding: 10px 0 14px;
`;

const InputTitle = styled.h4`
  font-size: 13px;
  letter-spacing: -0.07px;
  line-height: 18px;
`;

const InputItem = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px 0;
  font-size: 15px;
  line-height: 22px;
  border: none; /* 테두리 제거 */
  border-bottom: 1px solid #ebebeb; /* 하단에만 선 추가 */
  outline: none;
  cursor: pointer;
  text-align: left; /* 좌측 정렬 */
`;

const DropdownButton = styled.button`
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const DropdownLayer = styled.div`
  position: absolute;
  top: 37px;
  left: 0;
  width: 100%;
  background: #fff;
  border: 1px solid #ebebeb;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  z-index: 1010;
`;

const DropdownList = styled.ul`
  max-height: 240px;
  overflow-y: auto;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const DropdownItem = styled.li<{ selected: boolean }>`
  position: relative;
  padding: 11px 50px 10px 16px;
  cursor: pointer;
  font-size: 13px;
  letter-spacing: -0.07px;
  color: ${({ selected }) => (selected ? "#222" : "rgba(34, 34, 34, 0.8)")};
  font-weight: ${({ selected }) => (selected ? 700 : 400)};

  &:hover {
    background: #f5f5f5;
  }
`;

const CheckIcon = styled(FaCheck)`
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  font-size: 16px;
  color: #222;
`;

const ButtonWrap = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 20px;
`;

const SubmitButton = styled.button`
  width: 128px;
  height: 42px;
  background-color: #222;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const CashReceipt: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>("미신청");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const options = [
    "미신청",
    "개인소득공제(휴대폰)",
    "개인소득공제(현금영수증카드)",
  ];

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setShowDropdown(false);
  };

  return (
    <PageContainer>
      <MyAccount>
        <ContentTitle>
          <Title>현금영수증 정보</Title>
        </ContentTitle>
        <FormWrap>
          <Description>
            현금영수증은 판매 거래 시 발생하는 수수료에 대해{" "}
            <strong>정산완료</strong> 후 7일 이내에 건별로 발급됩니다. ‘미신청'
            선택 시 자진발급으로 처리됩니다.
          </Description>
          <InputBox>
            <InputTitle>형태</InputTitle>
            <InputItem>
              <Input
                type="text"
                readOnly
                value={selectedOption}
                onClick={() => setShowDropdown(!showDropdown)}
              />
              <DropdownButton onClick={() => setShowDropdown(!showDropdown)}>
                <IoIosArrowDown size={20} />
              </DropdownButton>
              {showDropdown && (
                <DropdownLayer>
                  <DropdownList>
                    {options.map((option) => (
                      <DropdownItem
                        key={option}
                        selected={option === selectedOption}
                        onClick={() => handleOptionSelect(option)}
                      >
                        {option}
                        {option === selectedOption && <CheckIcon />}
                      </DropdownItem>
                    ))}
                  </DropdownList>
                </DropdownLayer>
              )}
            </InputItem>
          </InputBox>
          <ButtonWrap>
            <SubmitButton>저장하기</SubmitButton>
          </ButtonWrap>
        </FormWrap>
      </MyAccount>
    </PageContainer>
  );
};

export default CashReceipt;
