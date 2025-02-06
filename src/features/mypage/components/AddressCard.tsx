import React from "react";
import styled from "styled-components";

// 스타일드 컴포넌트
const AddressCardContainer = styled.div<{ isDefault?: boolean }>`
  padding: ${(props) => (props.isDefault ? "30px 0 29px" : "20px 0 19px")};
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${(props) => props.isDefault && "border-bottom: 2px solid #222;"}
`;

const AddressInfo = styled.div`
  flex: 1;
`;

const NameBox = styled.div`
  display: flex;
  align-items: center;
`;

const Name = styled.span`
  font-size: 15px;
  font-weight: 700;
`;

const Mark = styled.span`
  margin-left: 4px;
  font-size: 12px;
  background-color: #f4f4f4;
  border-radius: 10px;
  padding: 3px 6px;
`;

const Phone = styled.p`
  font-size: 15px;
  margin-top: 5px;
`;

const AddressBox = styled.div`
  font-size: 14px;
  margin-top: 4px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.a`
  border: 1px solid #d3d3d3;
  border-radius: 10px;
  font-size: 12px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(34, 34, 34, 0.8);
  background-color: #fff;
  padding: 0 14px;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    background-color: #f9f9f9;
  }
`;

// AddressCard 컴포넌트 정의
export interface AddressData {
  id: number;
  name: string;
  phoneNumber: string;
  zonecode: string;
  roadAddress: string;
  detailAddress: string;
  isDefaultAddress: boolean;
}

interface AddressCardProps {
  address: AddressData;
  onEdit: (address: AddressData) => void;
  onDelete: (address: AddressData) => void;
}

const AddressCard: React.FC<AddressCardProps> = ({
  address,
  onEdit,
  onDelete,
}) => {
  return (
    <AddressCardContainer isDefault={address.isDefaultAddress}>
      <AddressInfo>
        <NameBox>
          <Name>{address.name}</Name>
          {address.isDefaultAddress && <Mark>기본 배송지</Mark>}
        </NameBox>
        <Phone>
          {address.phoneNumber.slice(0, 3)}-{address.phoneNumber.slice(3, 7)}-
          {address.phoneNumber.slice(7)}
        </Phone>
        <AddressBox>
          {address.zonecode}, {address.roadAddress} {address.detailAddress}
        </AddressBox>
      </AddressInfo>
      <ButtonContainer>
        <ActionButton
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onEdit(address);
          }}
        >
          수정
        </ActionButton>
        <ActionButton
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onDelete(address);
          }}
        >
          삭제
        </ActionButton>
      </ButtonContainer>
    </AddressCardContainer>
  );
};

export default AddressCard;
