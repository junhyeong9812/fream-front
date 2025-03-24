import React, { useState, useEffect } from "react";
import styles from "./DeliveryAddressModal.module.css";
import { AddressResponseDto, AddressCreateDto } from "../types/address";
import { addressService } from "../services/addressService";

declare global {
  interface Window {
    daum: any;
  }
}

interface DeliveryAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (address: AddressResponseDto) => void;
  selectedAddress?: AddressResponseDto;
}

const DeliveryAddressModal: React.FC<DeliveryAddressModalProps> = ({
  isOpen,
  onClose,
  onSave,
  selectedAddress,
}) => {
  const [recipientName, setRecipientName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [address, setAddress] = useState("");
  const [detailedAddress, setDetailedAddress] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 이미 선택된 주소가 있는 경우 폼에 채우기
  useEffect(() => {
    if (selectedAddress) {
      setRecipientName(selectedAddress.recipientName);
      setPhoneNumber(selectedAddress.phoneNumber);
      setZipCode(selectedAddress.zipCode);
      setAddress(selectedAddress.address);
      setDetailedAddress(selectedAddress.detailedAddress);
      setIsDefault(selectedAddress.isDefault);
    } else {
      resetForm();
    }
  }, [selectedAddress, isOpen]);

  // 다음 우편번호 스크립트 로드
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const resetForm = () => {
    setRecipientName("");
    setPhoneNumber("");
    setZipCode("");
    setAddress("");
    setDetailedAddress("");
    setIsDefault(false);
    setNameError("");
    setPhoneError("");
    setAddressError("");
  };

  const handleSearchAddress = () => {
    if (window.daum && window.daum.Postcode) {
      new window.daum.Postcode({
        oncomplete: function (data: any) {
          setZipCode(data.zonecode);
          setAddress(data.roadAddress);
        },
      }).open();
    } else {
      alert("주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
    }
  };

  const validateForm = () => {
    let isValid = true;

    if (!recipientName || recipientName.length < 2) {
      setNameError("이름은 2자 이상 입력해주세요.");
      isValid = false;
    } else {
      setNameError("");
    }

    const phoneRegex = /^01([0|1|6|7|8|9])([0-9]{3,4})([0-9]{4})$/;
    if (!phoneNumber || !phoneRegex.test(phoneNumber)) {
      setPhoneError("올바른 휴대폰 번호를 입력해주세요.");
      isValid = false;
    } else {
      setPhoneError("");
    }

    if (!zipCode || !address) {
      setAddressError("주소를 검색해주세요.");
      isValid = false;
    } else {
      setAddressError("");
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // 주소 생성 또는 수정
      const addressData: AddressCreateDto = {
        recipientName,
        phoneNumber,
        zipCode,
        address,
        detailedAddress,
        isDefault,
      };

      if (selectedAddress) {
        // 수정
        await addressService.updateAddress({
          addressId: selectedAddress.id,
          ...addressData,
        });
        onSave({
          id: selectedAddress.id,
          ...addressData,
          isDefault: isDefault || false,
        });
      } else {
        // 생성
        const response = await addressService.createAddress(addressData);
        // 주소 목록을 다시 불러와서 방금 생성한 주소 찾기
        const addresses = await addressService.getAddresses();
        const newAddress = addresses[addresses.length - 1]; // 가장 최근에 생성된 주소
        onSave(newAddress);
      }

      onClose();
    } catch (error) {
      console.error("주소 저장 실패:", error);
      alert("주소 저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>{selectedAddress ? "주소 수정" : "새 주소 추가"}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.formGroup}>
            <label>받는 사람</label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="수령인의 이름"
              className={nameError ? styles.inputError : ""}
            />
            {nameError && <p className={styles.errorText}>{nameError}</p>}
          </div>

          <div className={styles.formGroup}>
            <label>연락처</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) =>
                setPhoneNumber(e.target.value.replace(/[^0-9]/g, ""))
              }
              placeholder="- 없이 입력"
              className={phoneError ? styles.inputError : ""}
              maxLength={11}
            />
            {phoneError && <p className={styles.errorText}>{phoneError}</p>}
          </div>

          <div className={styles.formGroup}>
            <label>우편번호</label>
            <div className={styles.addressSearch}>
              <input
                type="text"
                value={zipCode}
                readOnly
                placeholder="우편번호 검색"
                className={addressError ? styles.inputError : ""}
              />
              <button type="button" onClick={handleSearchAddress}>
                우편번호 검색
              </button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>주소</label>
            <input
              type="text"
              value={address}
              readOnly
              placeholder="우편번호 검색 후 자동 입력됩니다"
              className={addressError ? styles.inputError : ""}
            />
            {addressError && <p className={styles.errorText}>{addressError}</p>}
          </div>

          <div className={styles.formGroup}>
            <label>상세 주소</label>
            <input
              type="text"
              value={detailedAddress}
              onChange={(e) => setDetailedAddress(e.target.value)}
              placeholder="건물, 아파트, 동/호수 입력"
            />
          </div>

          <div className={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="isDefault"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
            />
            <label htmlFor="isDefault">기본 배송지로 설정</label>
          </div>

          <div className={styles.buttonContainer}>
            <button className={styles.cancelButton} onClick={onClose}>
              취소
            </button>
            <button
              className={styles.saveButton}
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {selectedAddress ? "수정하기" : "저장하기"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryAddressModal;
