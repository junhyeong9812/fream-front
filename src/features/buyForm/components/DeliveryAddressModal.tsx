import React, { useState, useEffect } from "react";
import styles from "./DeliveryAddressModal.module.css";

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

  const [finalBtn, setFinalBtn] = useState<boolean>(false);

  // 주소 표시 값 계산
  const inputValue = zonecode ? zonecode : "우편 번호를 검색하세요";
  const inputValue2 = zonecode
    ? `${roadaddress} (${bname}, ${buildingname})`
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
      document.body.removeChild(script);
    };
  }, []);

  // 주소 검색 팝업 열기
  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function (data: any) {
        setZonecode(data.zonecode);
        setRoadaddress(data.roadAddress);
        setBname(data.bname || "");
        setBuildingname(data.buildingName || "");
      },
    }).open();
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
    const value = e.target.value;
    setInputNumberValue(value);
    if (value.length < 10 || value.length > 11 || isNaN(Number(value))) {
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

  // 저장 버튼 활성화 여부 체크
  useEffect(() => {
    if (zonecode && !showNameWarning && !showNumberWarning && hasAddressInput) {
      setFinalBtn(true);
    } else {
      setFinalBtn(false);
    }
  }, [zonecode, showNameWarning, showNumberWarning, hasAddressInput]);

  // 저장 처리
  const handleSave = () => {
    if (finalBtn) {
      onSave(
        inputNameValue,
        inputNumberValue,
        zonecode,
        roadaddress,
        bname,
        buildingname,
        inputAddressValue
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>새 주소 추가</h3>
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

          {/* 버튼 그룹 */}
          <div className={styles.buttonGroup}>
            <button onClick={onClose} className={styles.cancelButton}>
              취소
            </button>
            <button
              onClick={handleSave}
              className={`${styles.saveButton} ${
                !finalBtn ? styles.disabledButton : ""
              }`}
              disabled={!finalBtn}
            >
              저장하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryAddressModal;
