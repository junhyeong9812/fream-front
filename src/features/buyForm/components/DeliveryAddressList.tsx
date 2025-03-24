import React, { useState, useEffect } from "react";
import styles from "./DeliveryAddressList.module.css";
import { AddressResponseDto } from "../types/address";
import { addressService } from "../services/addressService";
import DeliveryAddressModal from "./DeliveryAddressModal";

interface DeliveryAddressListProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAddress: (address: AddressResponseDto) => void;
  selectedAddressId?: number;
}

const DeliveryAddressList: React.FC<DeliveryAddressListProps> = ({
  isOpen,
  onClose,
  onSelectAddress,
  selectedAddressId,
}) => {
  const [addresses, setAddresses] = useState<AddressResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] =
    useState<AddressResponseDto | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<number | null>(null);

  // 주소 목록 불러오기
  const fetchAddresses = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await addressService.getAddresses();
      setAddresses(data);
    } catch (err) {
      console.error("주소 목록 불러오기 실패:", err);
      setError("주소 목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAddresses();
    }
  }, [isOpen]);

  // 주소 선택 처리
  const handleSelectAddress = (address: AddressResponseDto) => {
    onSelectAddress(address);
    onClose();
  };

  // 주소 수정 모달 열기
  const handleEditAddress = (address: AddressResponseDto) => {
    setSelectedAddress(address);
    setIsAddressModalOpen(true);
  };

  // 주소 삭제 확인 모달 열기
  const handleDeleteClick = (addressId: number) => {
    setAddressToDelete(addressId);
    setIsDeleteConfirmOpen(true);
  };

  // 주소 삭제 처리
  const handleDeleteConfirm = async () => {
    if (addressToDelete === null) return;

    try {
      await addressService.deleteAddress(addressToDelete);
      await fetchAddresses(); // 목록 다시 불러오기
      setIsDeleteConfirmOpen(false);
      setAddressToDelete(null);
    } catch (err) {
      console.error("주소 삭제 실패:", err);
      alert("주소를 삭제하는데 실패했습니다.");
    }
  };

  // 주소 추가/수정 완료 후 처리
  // 주소 추가/수정 완료 후 처리
  const handleAddressModalSave = async (
    name: string,
    phoneNumber: string,
    zonecode: string,
    roadAddress: string,
    bname: string,
    buildingName: string,
    detailAddress: string
  ) => {
    // 주소 생성 또는 수정 로직은 이미 DeliveryAddressModal 내부에서 처리됨
    setIsAddressModalOpen(false);
    await fetchAddresses(); // 목록 다시 불러오기
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>배송지 선택</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.modalBody}>
          {isLoading ? (
            <div className={styles.loadingState}>
              주소 목록을 불러오는 중...
            </div>
          ) : error ? (
            <div className={styles.errorState}>{error}</div>
          ) : addresses.length === 0 ? (
            <div className={styles.emptyState}>
              <p>등록된 배송지가 없습니다.</p>
              <p>배송지를 추가해주세요.</p>
            </div>
          ) : (
            <ul className={styles.addressList}>
              {addresses.map((address) => (
                <li
                  key={address.id}
                  className={`${styles.addressItem} ${
                    address.id === selectedAddressId
                      ? styles.selectedAddress
                      : ""
                  }`}
                >
                  {address.id === selectedAddressId && (
                    <div className={styles.selectedBadge}>선택</div>
                  )}
                  {address.isDefault && (
                    <div className={styles.defaultBadge}>기본 배송지</div>
                  )}
                  <div className={styles.addressContent}>
                    <div className={styles.addressName}>
                      {address.recipientName}
                      <span className={styles.phoneNumber}>
                        {address.phoneNumber.replace(
                          /(\d{3})(\d{4})(\d{4})/,
                          "$1-$2-$3"
                        )}
                      </span>
                    </div>
                    <div className={styles.addressDetail}>
                      <p>
                        ({address.zipCode}) {address.address}{" "}
                        {address.detailedAddress}
                      </p>
                    </div>
                  </div>
                  <div className={styles.addressActions}>
                    <button
                      className={styles.selectButton}
                      onClick={() => handleSelectAddress(address)}
                    >
                      선택
                    </button>
                    <button
                      className={styles.editButton}
                      onClick={() => handleEditAddress(address)}
                    >
                      변경
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDeleteClick(address.id)}
                    >
                      삭제
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className={styles.addButtonContainer}>
            <button
              className={styles.addButton}
              onClick={() => {
                setSelectedAddress(null);
                setIsAddressModalOpen(true);
              }}
            >
              + 새 배송지 추가
            </button>
          </div>
        </div>
      </div>

      {/* 주소 추가/수정 모달 */}
      {isAddressModalOpen && (
        <DeliveryAddressModal
          isOpen={isAddressModalOpen}
          onClose={() => setIsAddressModalOpen(false)}
          onSave={handleAddressModalSave}
          selectedAddress={selectedAddress || undefined}
        />
      )}

      {/* 삭제 확인 모달 */}
      {isDeleteConfirmOpen && (
        <div className={styles.confirmModalOverlay}>
          <div className={styles.confirmModal}>
            <h3>배송지 삭제</h3>
            <p>정말 이 배송지를 삭제하시겠습니까?</p>
            <div className={styles.confirmButtons}>
              <button
                className={styles.cancelButton}
                onClick={() => setIsDeleteConfirmOpen(false)}
              >
                취소
              </button>
              <button
                className={styles.deleteConfirmButton}
                onClick={handleDeleteConfirm}
              >
                삭제하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryAddressList;
