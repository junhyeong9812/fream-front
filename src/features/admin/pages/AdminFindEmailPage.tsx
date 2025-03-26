import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminFindEmailPage.module.css";
import { fetchAdminFindEmailData } from "../services/adminAuthService";
import { AdminFindEmailData } from "../types/AdminloginTypes";

const AdminFindEmail: React.FC = () => {
  const navigate = useNavigate();

  const [findEmailBtn, setFindEmailBtn] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<AdminFindEmailData>({
    phone: "",
  });
  const [isValid, setIsValid] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [findEmailCheck, setFindEmailCheck] = useState<boolean>(false);
  const [findEmail, setFindEmail] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 숫자만 입력하도록 처리하는 함수
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value.replace(/[^0-9]/g, "");

    const validStartNumbers = ["010", "011", "016", "017", "018", "019"];
    const isLengthValid = value.length === 10 || value.length === 11;
    const startsWithValidPrefix = validStartNumbers.some((prefix) =>
      value.startsWith(prefix)
    );

    // 유효성 검사
    const validPhone = isLengthValid && startsWithValidPrefix;
    setIsValid(validPhone);
    setFindEmailBtn(validPhone);
    setErrorMessage(null);

    setPhoneNumber({ phone: value }); // 상태에 입력된 전화번호 업데이트
  };

  const maskEmail = (email: string): string => {
    // 이메일이 빈 값이거나 형식에 맞지 않으면 그대로 반환
    if (typeof email !== "string" || !email.includes("@")) return email;

    const [localPart, domainPart] = email.split("@"); // 이메일을 '@' 기준으로 분리
    if (localPart.length < 3) return email; // 로컬 부분이 너무 짧으면 마스킹하지 않음

    // 첫 번째 글자와 마지막 글자는 유지하고, 중간 글자는 *로 변환
    const maskedLocalPart =
      localPart[0] +
      "*".repeat(localPart.length - 2) +
      localPart[localPart.length - 1];

    return `${maskedLocalPart}@${domainPart}`;
  };

  const handleFindEmailFetch = async () => {
    if (isLoading || !findEmailBtn) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await fetchAdminFindEmailData(phoneNumber.phone);

      if (result === "no") {
        setErrorMessage("일치하는 관리자 정보를 찾을 수 없습니다.");
        setIsLoading(false);
      } else if (result === "not_admin") {
        setErrorMessage("관리자 계정이 아닙니다.");
        setIsLoading(false);
      } else {
        // 이메일을 받아온 경우
        setFindEmailCheck(true);
        setFindEmail(result);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("이메일 찾기 처리 중 오류:", error);
      setErrorMessage(
        "이메일 찾기 처리 중 오류가 발생했습니다. 다시 시도해주세요."
      );
      setIsLoading(false);
    }
  };

  // 로딩 버튼 컴포넌트
  const LoadingButton = () => (
    <div className={styles.btnInactive}>
      <div className={styles.loadingContainer}>
        <span className={styles.loadingText}>검색 중</span>
        <span className={styles.loadingDot}></span>
        <span className={styles.loadingDot}></span>
        <span className={styles.loadingDot}></span>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      {findEmailCheck ? (
        <div>
          <h2 className={styles.successTitle}>
            이메일 주소 찾기에 성공하였습니다.
          </h2>
          <div className={styles.successInfoContent}>
            <p className={styles.successInfoText}>이메일 주소</p>
            <p className={styles.successInfoEmail}>{maskEmail(findEmail)}</p>
          </div>
          <div className={styles.successBtnContent}>
            <div
              onClick={() => navigate("/admin/login/find_password")}
              className={styles.successPasswordBtn}
            >
              비밀번호 찾기
            </div>
            <div
              onClick={() => navigate("/admin/login")}
              className={styles.successLoginBtn}
            >
              로그인
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h2 className={styles.titleContent}>관리자 이메일 아이디 찾기</h2>
          <p className={styles.noticeContent}>
            가입 시 등록한 휴대폰 번호를 입력하면
            <br />
            이메일 주소의 일부를 알려드립니다.
          </p>

          {errorMessage && (
            <div className={styles.errorMessage}>{errorMessage}</div>
          )}

          <div className={styles.inputContent}>
            <h3 className={styles.inputTitleContent}>휴대폰 번호</h3>
            <input
              className={styles.inputField}
              placeholder="가입하신 휴대폰 번호"
              type="text"
              value={phoneNumber.phone}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>

          {isLoading ? (
            <LoadingButton />
          ) : findEmailBtn ? (
            <div onClick={handleFindEmailFetch} className={styles.btnActive}>
              이메일 아이디 찾기
            </div>
          ) : (
            <div className={styles.btnInactive}>이메일 아이디 찾기</div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminFindEmail;
