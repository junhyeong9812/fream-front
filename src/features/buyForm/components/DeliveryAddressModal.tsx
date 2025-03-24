import React, { useState, useEffect } from "react";
import styles from "./DeliveryAddressModal.module.css";
import { AddressResponseDto, AddressCreateDto } from "../types/address";
import { addressService } from "../services/addressService";

interface DeliveryAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    name: string,
    phoneNumber: string,
    zonecode: string,
    roadAddress: string,
    bname: string,
    buildingName: string,
    detailAddress: string
  ) => void;
  selectedAddress?: AddressResponseDto;
}

declare global {
  interface Window {
    daum: any;
  }
}

const DeliveryAddressModal: React.FC<DeliveryAddressModalProps> = ({
  isOpen,
  onClose,
  onSave,
  selectedAddress,
}) => {
  const [inputNameValue, setInputNameValue] = useState<string>("");
  const [showNameWarning, setShowNameWarning] = useState<boolean>(false);

  const [inputNumberValue, setInputNumberValue] = useState<string>("");
  const [showNumberWarning, setShowNumberWarning] = useState<boolean>(false);

  const [zonecode, setZonecode] = useState<string>("");
  const [roadaddress, setRoadaddress] = useState<string>("");
  const [bname, setBname] = useState<string>("");
  const [buildingname, setBuildingname] = useState<string>("");

  const [inputAddressValue, setInputAddressValue] = useState<string>("");
  const [hasAddressInput, setHasAddressInput] = useState<boolean>(false);
  const [isDefault, setIsDefault] = useState<boolean>(false);

  const [finalBtn, setFinalBtn] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // 선택된 주소가 있는 경우 폼 초기화
  useEffect(() => {
    if (selectedAddress) {
      setInputNameValue(selectedAddress.recipientName);
      setInputNumberValue(selectedAddress.phoneNumber);
      setZonecode(selectedAddress.zipCode);
      setRoadaddress(selectedAddress.address);
      setBname(""); // 주소 정보에서 제공하지 않는 경우
      setBuildingname(""); // 주소 정보에서 제공하지 않는 경우
      setInputAddressValue(selectedAddress.detailedAddress);
      setIsDefault(selectedAddress.isDefault);
      setHasAddressInput(selectedAddress.detailedAddress.length > 0);
    } else {
      // 새 주소 추가시 초기화
      setInputNameValue("");
      setInputNumberValue("");
      setZonecode("");
      setRoadaddress("");
      setBname("");
      setBuildingname("");
      setInputAddressValue("");
      setIsDefault(false);
      setHasAddressInput(false);
    }

    // 경고 메시지 초기화
    setShowNameWarning(false);
    setShowNumberWarning(false);
  }, [selectedAddress, isOpen]);

  // 주소 표시 값 계산
  const inputValue = zonecode ? zonecode : "우편 번호를 검색하세요";
  const inputValue2 = zonecode
    ? bname || buildingname
      ? `${roadaddress} (${bname || ""}, ${buildingname || ""})`
      : roadaddress
    : "우편 번호 검색 후, 자동입력 됩니다";
  const inputClassName = zonecode
    ? styles.nameInputTxt
    : styles.nameInputNullTxt;

  // Daum 우편번호 API 스크립트 로드
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

  // 주소 검색 팝업 열기
  const handleAddressSearch = () => {
    if (window.daum && window.daum.Postcode) {
      new window.daum.Postcode({
        oncomplete: function (data: any) {
          setZonecode(data.zonecode);
          setRoadaddress(data.roadAddress);
          setBname(data.bname || "");
          setBuildingname(data.buildingName || "");
        },
      }).open();
    } else {
      alert("주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
    }
  };

  // 이름 입력 처리
  const handleInputNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputNameValue(value);
    if (value.length < 2 || value.length > 50) {
      setShowNameWarning(true);
    } else {
      setShowNameWarning(false);
    }
  };

  // 전화번호 입력 처리
  const handleInputNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // 숫자만 입력 가능
    setInputNumberValue(value);
    if (value.length < 10 || value.length > 11) {
      setShowNumberWarning(true);
    } else {
      setShowNumberWarning(false);
    }
  };

  // 상세 주소 입력 처리
  const handleInputAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputAddressValue(value);
    setHasAddressInput(value.length > 0);
  };

  // 기본 배송지 체크박스 처리
  const handleDefaultAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsDefault(e.target.checked);
  };

  // 저장 버튼 활성화 여부 체크
  useEffect(() => {
    if (
      zonecode &&
      !showNameWarning &&
      !showNumberWarning &&
      hasAddressInput &&
      inputNameValue.length >= 2
    ) {
      setFinalBtn(true);
    } else {
      setFinalBtn(false);
    }
  }, [
    zonecode,
    showNameWarning,
    showNumberWarning,
    hasAddressInput,
    inputNameValue,
  ]);

  // 폼 유효성 검사
  const validateForm = (): boolean => {
    let isValid = true;

    if (!inputNameValue || inputNameValue.length < 2) {
      setShowNameWarning(true);
      isValid = false;
    }

    if (
      !inputNumberValue ||
      inputNumberValue.length < 10 ||
      inputNumberValue.length > 11
    ) {
      setShowNumberWarning(true);
      isValid = false;
    }

    if (!zonecode || !roadaddress) {
      alert("주소를 검색해주세요.");
      isValid = false;
    }

    if (!inputAddressValue || inputAddressValue.trim() === "") {
      setHasAddressInput(false);
      isValid = false;
    }

    return isValid;
  };

  // 저장 처리
  const handleSave = async () => {
    if (!finalBtn || isSubmitting) return;

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      if (selectedAddress) {
        // 주소 업데이트
        const updateData = {
          addressId: selectedAddress.id,
          recipientName: inputNameValue,
          phoneNumber: inputNumberValue,
          zipCode: zonecode,
          address: roadaddress,
          detailedAddress: inputAddressValue,
          isDefault: isDefault,
        };

        await addressService.updateAddress(updateData);
      } else {
        // 새 주소 생성
        const createData: AddressCreateDto = {
          recipientName: inputNameValue,
          phoneNumber: inputNumberValue,
          zipCode: zonecode,
          address: roadaddress,
          detailedAddress: inputAddressValue,
          isDefault: isDefault,
        };

        await addressService.createAddress(createData);
      }

      // 기존 onSave 호출
      onSave(
        inputNameValue,
        inputNumberValue,
        zonecode,
        roadaddress,
        bname,
        buildingname,
        inputAddressValue
      );
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
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>
            {selectedAddress ? "주소 수정" : "새 주소 추가"}
          </h3>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.modalBody}>
          {/* 이름 입력 필드 */}
          <div className={styles.formGroup}>
            <label
              className={`${styles.label} ${
                showNameWarning ? styles.errorLabel : ""
              }`}
            >
              이름
            </label>
            <input
              type="text"
              value={inputNameValue}
              onChange={handleInputNameChange}
              placeholder="수령인의 이름"
              className={`${styles.input} ${
                showNameWarning ? styles.errorInput : ""
              }`}
              maxLength={50}
            />
            {showNameWarning && (
              <p className={styles.errorText}>
                올바른 이름을 입력해주세요. (2 - 50자)
              </p>
            )}
          </div>

          {/* 휴대폰 번호 입력 필드 */}
          <div className={styles.formGroup}>
            <label
              className={`${styles.label} ${
                showNumberWarning ? styles.errorLabel : ""
              }`}
            >
              휴대폰 번호
            </label>
            <input
              type="text"
              value={inputNumberValue}
              onChange={handleInputNumberChange}
              placeholder="- 없이 입력"
              className={`${styles.input} ${
                showNumberWarning ? styles.errorInput : ""
              }`}
              maxLength={11}
            />
            {showNumberWarning && (
              <p className={styles.errorText}>
                정확한 휴대폰 번호를 입력해주세요.
              </p>
            )}
          </div>

          {/* 우편번호 필드 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>우편번호</label>
            <div className={styles.postCodeContainer}>
              <input
                type="text"
                readOnly
                value={inputValue}
                className={inputClassName}
              />
              <button
                onClick={handleAddressSearch}
                className={styles.searchButton}
              >
                우편번호
              </button>
            </div>
          </div>

          {/* 주소 필드 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>주소</label>
            <input
              type="text"
              readOnly
              value={inputValue2}
              className={inputClassName}
            />
          </div>

          {/* 상세 주소 필드 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>상세 주소</label>
            <input
              type="text"
              value={inputAddressValue}
              onChange={handleInputAddressChange}
              placeholder="건물, 아파트, 동/호수 입력"
              className={styles.input}
            />
          </div>

          {/* 기본 배송지 체크박스 */}
          <div className={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="isDefault"
              checked={isDefault}
              onChange={handleDefaultAddressChange}
              className={styles.checkbox}
            />
            <label htmlFor="isDefault" className={styles.checkboxLabel}>
              기본 배송지로 설정
            </label>
          </div>

          {/* 버튼 그룹 */}
          <div className={styles.buttonGroup}>
            <button onClick={onClose} className={styles.cancelButton}>
              취소
            </button>
            <button
              onClick={handleSave}
              className={`${styles.saveButton} ${
                !finalBtn || isSubmitting ? styles.disabledButton : ""
              }`}
              disabled={!finalBtn || isSubmitting}
            >
              {isSubmitting ? "저장 중..." : "저장하기"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryAddressModal;
