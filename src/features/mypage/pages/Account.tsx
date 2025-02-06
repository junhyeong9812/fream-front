import React, { useState } from "react";
import styled from "styled-components";
import { IoIosArrowDown } from "react-icons/io";

const PageContainer = styled.div`
  padding: 0 20px;
  width: 480px;
`;

const PageHeader = styled.div`
  display: flex;
  padding-bottom: 16px;
  margin-bottom: 40px;
`;

const Title = styled.h3`
  font-size: 24px;
  line-height: 29px;
  letter-spacing: -0.36px;
  margin: 0;
`;

const Content = styled.div`
  width: 100%;
`;

const AccountRegistration = styled.div`
  padding-top: 20px;
`;

const RegistrationButtonBox = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 20px;
`;

const InputBox = styled.div`
  position: relative;
  padding: 10px 0 14px;

  &:not(:first-child) {
    margin-top: 8px;
  }
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
  letter-spacing: -0.15px;
  border: none;
  border-bottom: 1px solid #ebebeb;
  background-color: transparent;
  outline: none;
  appearance: none;
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

const ErrorMessage = styled.p<{ visible: boolean }>`
  font-size: 12px;
  color: red;
  margin-top: 4px;
  visibility: ${({ visible }) => (visible ? "visible" : "hidden")};
`;

const Dropdown = styled.ul`
  position: absolute;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  list-style: none;
  margin: 0;
  padding: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 100;

  li {
    padding: 8px;
    cursor: pointer;

    &:hover {
      background: #f5f5f5;
    }
  }
`;
const SaveButton = styled.button<{ disabled: boolean }>`
  display: block;
  width: 100px;
  text-align: center;
  padding: 10px 0;
  background-color: ${({ disabled }) => (disabled ? "#ccc" : "#222")};
  color: white;
  text-decoration: none;
  border-radius: 10px;
  border: none;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
`;

const Account: React.FC = () => {
  const [bankName, setBankName] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [accountHolder, setAccountHolder] = useState<string>("");
  const [accountNumberError, setAccountNumberError] = useState<boolean>(false);
  const [accountHolderError, setAccountHolderError] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const bankOptions = ["신한은행", "국민은행", "기업은행"];

  const handleBankSelection = (bank: string) => {
    setBankName(bank);
    setShowDropdown(false);
  };

  const validateAccountNumber = () => {
    setAccountNumberError(
      accountNumber.length < 10 || accountNumber.length > 14
    );
  };

  const validateAccountHolder = () => {
    setAccountHolderError(
      accountHolder.length < 2 || accountHolder.length > 50
    );
  };

  const isSaveDisabled = accountNumberError || accountHolderError || !bankName;

  return (
    <PageContainer>
      {/* 페이지 헤더 */}
      <PageHeader>
        <Title>판매 정산 계좌</Title>
      </PageHeader>

      {/* 컨텐츠 영역 */}
      <Content>
        <AccountRegistration>
          <InputBox>
            <InputTitle>은행명</InputTitle>
            <InputItem>
              <Input
                type="text"
                placeholder="선택하세요"
                readOnly
                value={bankName}
                onClick={() => setShowDropdown(!showDropdown)}
              />
              <DropdownButton>
                <IoIosArrowDown size={20} />
              </DropdownButton>
              {showDropdown && (
                <Dropdown>
                  {bankOptions.map((bank) => (
                    <li key={bank} onClick={() => handleBankSelection(bank)}>
                      {bank}
                    </li>
                  ))}
                </Dropdown>
              )}
            </InputItem>
          </InputBox>

          <InputBox>
            <InputTitle>계좌번호</InputTitle>
            <InputItem>
              <Input
                type="tel"
                placeholder="- 없이 입력하세요"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                onBlur={validateAccountNumber}
              />
            </InputItem>
            <ErrorMessage visible={accountNumberError}>
              올바른 계좌번호를 입력해주세요. (10자리~14자리)
            </ErrorMessage>
          </InputBox>

          <InputBox>
            <InputTitle>예금주</InputTitle>
            <InputItem>
              <Input
                type="text"
                placeholder="예금주명을 정확히 입력하세요."
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
                onBlur={validateAccountHolder}
              />
            </InputItem>
            <ErrorMessage visible={accountHolderError}>
              올바른 이름을 입력해주세요. (2-50자)
            </ErrorMessage>
          </InputBox>
        </AccountRegistration>

        <RegistrationButtonBox>
          <SaveButton
            disabled={isSaveDisabled}
            onClick={() => {
              if (!isSaveDisabled) {
                console.log({ bankName, accountNumber, accountHolder });
              }
            }}
          >
            저장하기
          </SaveButton>
        </RegistrationButtonBox>
      </Content>
    </PageContainer>
  );
};

export default Account;
