import React, { useEffect, useState } from "react";
import styled from "styled-components";
import AddAddressModal from "../components/AddAddressModal";
import { AddressData } from "../types/mypageTypes";
import AddressCard from "../components/AddressCard";
import {
  AddressCreateDto,
  AddressResponseDto,
  AddressUpdateDto,
} from "../types/address";
import { addressService } from "../services/addressService";

const PageContainer = styled.div`
  padding: 0 20px;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 16px;
  width: 100%;
`;

const Title = styled.h3`
  font-size: 24px;
  line-height: 29px;
  letter-spacing: -0.36px;
  margin: 0;
`;

const Title_box = styled.div`
  font-size: 24px;
  letter-spacing: -0.36px;
`;

const AddressBtnBox = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  padding-left: 30px;
  min-width: fit-content;

  a.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #222;
    border-radius: 10px;
    font-size: 12px;
    height: 34px;
    letter-spacing: -0.06px;
    line-height: 32px;
    padding: 0 14px;
    color: rgba(34, 34, 34, 0.8);
    background-color: #fff;
    text-decoration: none;
    white-space: nowrap;
    min-width: max-content;

    &:hover {
      text-decoration: none;
    }
  }
`;
const AddressBtn_span = styled.span`
  font-size: 12px;
  letter-spacing: -0.06px;
  line-height: 32px;
  color: rgba(34, 34, 34, 0.8);
  white-space: nowrap;
`;

const AddressList = styled.div`
  margin-top: 20px;
`;

const Address: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] =
    useState<AddressResponseDto | null>(null);
  const [addresses, setAddresses] = useState<AddressResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 주소 목록 조회
  const fetchAddresses = async () => {
    try {
      const data = await addressService.getAddresses();
      setAddresses(data);
    } catch (err) {
      setError("주소 목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // 주소 추가
  const handleAdd = async (newAddress: AddressCreateDto) => {
    try {
      await addressService.createAddress(newAddress);
      await fetchAddresses(); // 목록 새로고침
      setIsModalOpen(false);
    } catch (err) {
      alert("주소 추가에 실패했습니다.");
    }
  };

  // 주소 수정
  const handleEdit = async (updatedAddress: AddressUpdateDto) => {
    try {
      await addressService.updateAddress(updatedAddress);
      await fetchAddresses(); // 목록 새로고침
      setIsModalOpen(false);
    } catch (err) {
      alert("주소 수정에 실패했습니다.");
    }
  };

  // 주소 삭제
  const handleDelete = async (addressId: number) => {
    if (window.confirm("정말로 이 주소를 삭제하시겠습니까?")) {
      try {
        await addressService.deleteAddress(addressId);
        await fetchAddresses(); // 목록 새로고침
      } catch (err) {
        alert("주소 삭제에 실패했습니다.");
      }
    }
  };

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;
  return (
    <PageContainer>
      <PageHeader>
        <Title_box>
          <Title>주소록</Title>
        </Title_box>
        <AddressBtnBox>
          <a
            href="#"
            className="btn"
            onClick={(e) => {
              e.preventDefault();
              setSelectedAddress(null);
              setIsModalOpen(true);
            }}
          >
            <AddressBtn_span>+ 새 배송지 추가</AddressBtn_span>
          </a>
        </AddressBtnBox>
      </PageHeader>
      <AddressList>
        {addresses.map((address) => (
          <AddressCard
            key={address.id}
            address={address}
            onEdit={(address) => {
              setSelectedAddress(address);
              setIsModalOpen(true);
            }}
            onDelete={() => handleDelete(address.id)}
          />
        ))}
      </AddressList>
      {isModalOpen && (
        <AddAddressModal
          onClose={() => {
            setIsModalOpen(false);
            setSelectedAddress(null); // 모달이 닫힐 때 선택된 주소 초기화
          }}
          onSubmit={(data) => {
            if ("addressId" in data) {
              handleEdit(data as AddressUpdateDto);
            } else {
              handleAdd(data as AddressCreateDto);
            }
          }}
          initialData={selectedAddress} // null이 허용되도록 수정된 타입에 맞춰 전달
        />
      )}
    </PageContainer>
  );
};
//   return (
//     <PageContainer>
//       {/* 페이지 헤더 */}
//       <PageHeader>
//         <Title_box>
//           <Title>주소록</Title>
//         </Title_box>
//         <AddressBtnBox>
//           <a
//             href="#"
//             className="btn"
//             onClick={(e) => {
//               e.preventDefault(); // 기본 앵커 태그 동작 방지
//               setSelectedAddress(null); // 새로운 주소 추가
//               setIsModalOpen(true); // 모달 상태 변경
//             }}
//           >
//             <AddressBtn_span>+ 새 배송지 추가</AddressBtn_span>
//           </a>
//         </AddressBtnBox>
//       </PageHeader>
//       <AddressList>
//         {sortedAddresses.map((address) => (
//           <AddressCard
//             key={address.id}
//             address={address}
//             onEdit={(address) => {
//               setSelectedAddress(address);
//               setIsModalOpen(true);
//             }}
//             onDelete={handleDelete}
//           />
//         ))}
//       </AddressList>
//       {isModalOpen && (
//         <AddAddressModal
//           onClose={() => setIsModalOpen(false)}
//           onSubmit={(data: AddressData) =>
//             selectedAddress ? handleEdit(data) : handleAdd(data)
//           }
//           initialData={selectedAddress}
//         />
//       )}
//     </PageContainer>
//   );
// };

export default Address;
