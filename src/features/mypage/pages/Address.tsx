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
  padding-bottom: 16px;
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
  align-items: center;
  display: flex;
  flex-shrink: 0;
  margin-left: auto;
  padding-left: 30px;

  /* a 태그에 대한 스타일링 */
  a.btn {
    border: 1px solid #222;
    border-radius: 10px;
    font-size: 12px;
    height: 34px;
    letter-spacing: -0.06px;
    line-height: 32px;
    margin-right: 0;
    padding: 0 14px;
    align-items: center;
    display: flex;
    justify-content: center;
    color: rgba(34, 34, 34, 0.8);
    background-color: #fff;
    text-decoration: none;

    &:hover {
      text-decoration: none;
    }
  }
`;
const AddressBtn_span = styled.span`
  font-size: 12px;
  height: 34px;
  letter-spacing: -0.06px;
  line-height: 32px;
  color: rgba(34, 34, 34, 0.8);
`;
const AddressList = styled.div`
  margin-top: 20px;
`;

const Address: React.FC = () => {
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [selectedAddress, setSelectedAddress] = useState<null | AddressData>(
  //   null
  // ); // 선택된 주소 데이터

  // // 더미 주소 데이터
  // // 주소 리스트를 useState로 관리
  // const [addressList, setAddressList] = useState<AddressData[]>([
  //   {
  //     id: 1,
  //     name: "홍길동",
  //     phoneNumber: "01012345678",
  //     zonecode: "12345",
  //     roadAddress: "서울특별시 강남구 테헤란로",
  //     detailAddress: "123호",
  //     isDefaultAddress: true,
  //   },
  //   {
  //     id: 2,
  //     name: "김철수",
  //     phoneNumber: "01098765432",
  //     zonecode: "54321",
  //     roadAddress: "부산광역시 해운대구 우동",
  //     detailAddress: "456호",
  //     isDefaultAddress: false,
  //   },
  // ]);

  // const sortedAddresses = [
  //   ...addressList.filter((address) => address.isDefaultAddress),
  //   ...addressList.filter((address) => !address.isDefaultAddress),
  // ];

  // // 주소 추가
  // const handleAdd = (newAddress: AddressData) => {
  //   setAddressList((prevList) => [
  //     ...prevList.map((address) => ({
  //       ...address,
  //       isDefaultAddress: false, // 기본 주소를 하나로 유지
  //     })),
  //     { ...newAddress, id: prevList.length + 1 },
  //   ]);
  //   setIsModalOpen(false);
  // };

  // // 주소 수정
  // const handleEdit = (updatedAddress: AddressData) => {
  //   setAddressList((prevList) =>
  //     prevList.map((address) =>
  //       address.id === updatedAddress.id ? updatedAddress : address
  //     )
  //   );
  //   setIsModalOpen(false);
  // };

  // // 주소 삭제
  // const handleDelete = (addressToDelete: AddressData) => {
  //   setAddressList((prevList) =>
  //     prevList.filter((address) => address.id !== addressToDelete.id)
  //   );
  //   alert(`${addressToDelete.name}의 주소가 삭제되었습니다.`);
  // };
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
