import React, { useState } from "react";
import styles from "./BankAccountModal.module.css";
import {
  BankAccountResponseDto,
  BankAccountCreateDto,
} from "../types/bankAccount";
import { bankAccountService } from "../services/bankAccountService";

interface BankAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (account: BankAccountResponseDto) => void;
}

const BANKS = [
  "국민은행",
  "신한은행",
  "우리은행",
  "하나은행",
  "농협은행",
  "IBK기업은행",
  "SC제일은행",
  "씨티은행",
  "케이뱅크",
  "카카오뱅크",
  "토스뱅크",
];

const BankAccountModal: React.FC<BankAccountModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [accountHolder, setAccountHolder] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  const [holderError, setHolderError] = useState("");
  const [bankError, setBankError] = useState("");
  const [accountError, setAccountError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setAccountHolder("");
    setBankName("");
    setAccountNumber("");
    setHolderError("");
    setBankError("");
    setAccountError("");
  };

  const validateForm = () => {
    let isValid = true;

    if (!accountHolder || accountHolder.length < 2) {
      setHolderError("예금주명은 2자 이상 입력해주세요.");
      isValid = false;
    } else {
      setHolderError("");
    }

    if (!bankName) {
      setBankError("은행을 선택해주세요.");
      isValid = false;
    } else {
      setBankError("");
    }

    if (!accountNumber || !/^\d+$/.test(accountNumber)) {
      setAccountError("올바른 계좌번호를 입력해주세요.");
      isValid = false;
    } else {
      setAccountError("");
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const accountData: BankAccountCreateDto = {
        accountHolder,
        bankName,
        accountNumber,
      };

      await bankAccountService.createBankAccount(accountData);

      // 새로 생성된 계좌 정보로 콜백 호출
      // 실제로는 API에서 생성된 ID를 반환받아야 함
      onSave({
        id: Date.now(), // 임시 ID 생성
        ...accountData,
      });

      resetForm();
      onClose();
    } catch (error) {
      console.error("계좌 정보 저장 실패:", error);
      alert("계좌 정보 저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>판매 정산 계좌 등록</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.formGroup}>
            <label>은행명</label>
            <select
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className={bankError ? styles.inputError : ""}
            >
              <option value="">선택해주세요</option>
              {BANKS.map((bank) => (
                <option key={bank} value={bank}>
                  {bank}
                </option>
              ))}
            </select>
            {bankError && <p className={styles.errorText}>{bankError}</p>}
          </div>

          <div className={styles.formGroup}>
            <label>계좌번호</label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) =>
                setAccountNumber(e.target.value.replace(/[^0-9]/g, ""))
              }
              placeholder="- 없이 숫자만 입력하세요"
              className={accountError ? styles.inputError : ""}
            />
            {accountError && <p className={styles.errorText}>{accountError}</p>}
          </div>

          <div className={styles.formGroup}>
            <label>예금주</label>
            <input
              type="text"
              value={accountHolder}
              onChange={(e) => setAccountHolder(e.target.value)}
              placeholder="예금주명을 정확히 입력하세요"
              className={holderError ? styles.inputError : ""}
            />
            {holderError && <p className={styles.errorText}>{holderError}</p>}
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
              등록하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankAccountModal;
