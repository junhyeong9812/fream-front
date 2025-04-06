import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminFindPasswordPage.module.css";
import { fetchAdminFindPasswordData } from "../services/adminAuthService";
import { AdminFindPasswordRequest } from "../types/AdminLoginTypes";

const AdminFindPassword: React.FC = () => {
  const navigate = useNavigate();

  const [findPasswordBtn, setFindPasswordBtn] = useState<boolean>(false);
  const [findPasswordData, setFindPasswordData] =
    useState<AdminFindPasswordRequest>({
      phoneNumber: "",
      email: "",
    });

  // 로딩 상태 추가
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // 에러 메시지 상태 추가
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 번호
  const [phoneIsValid, setPhoneIsValid] = useState<boolean>(false);

  // 숫자만 입력하도록 처리하는 함수
  const handleInputPhoneChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = event.target.value.replace(/[^0-9]/g, "");

    const validStartNumbers = ["010", "011", "016", "017", "018", "019"];
    const isLengthValid = value.length === 10 || value.length === 11;
    const startsWithValidPrefix = validStartNumbers.some((prefix) =>
      value.startsWith(prefix)
    );

    // 유효성 검사
    setPhoneIsValid(isLengthValid && startsWithValidPrefix);
    setErrorMessage(null);

    setFindPasswordData((prevData) => ({
      ...prevData,
      phone: value,
    }));
  };

  // 이메일
  const [emailIsValid, setEmailIsValid] = useState<boolean>(false);

  // 올바른 이메일 입력하도록 처리하는 함수
  const handleInputEmailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;

    // 이메일 정규식 검사
    const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
    const isValid = emailRegex.test(value);

    setEmailIsValid(isValid); // 유효성 상태 업데이트
    setErrorMessage(null);

    // 입력된 이메일을 상태에 저장
    setFindPasswordData((prevData) => ({
      ...prevData,
      email: value,
    }));
  };

  // 최종 버튼 활성화
  useEffect(() => {
    if (phoneIsValid && emailIsValid) {
      setFindPasswordBtn(true);
    } else {
      setFindPasswordBtn(false);
    }
  }, [phoneIsValid, emailIsValid]);

  const [findPasswordCheck, setFindPasswordCheck] = useState<boolean>(false);

  const handleFindPasswordFetch = async () => {
    if (isLoading || !findPasswordBtn) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await fetchAdminFindPasswordData(
        findPasswordData.phoneNumber,
        findPasswordData.email
      );

      if (result === "yes") {
        setFindPasswordCheck(true);
        setIsLoading(false);
      } else if (result === "not_admin") {
        setErrorMessage("관리자 계정이 아닙니다.");
        setIsLoading(false);
      } else if (result === "invalid_phone") {
        setErrorMessage("입력하신 전화번호가 계정 정보와 일치하지 않습니다.");
        setIsLoading(false);
      } else {
        setErrorMessage("일치하는 관리자 정보를 찾을 수 없습니다.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("비밀번호 찾기 처리 중 오류:", error);
      setErrorMessage(
        "비밀번호 찾기 처리 중 오류가 발생했습니다. 다시 시도해주세요."
      );
      setIsLoading(false);
    }
  };

  // 로딩 버튼 컴포넌트
  const LoadingButton = () => (
    <div className={styles.btnInactive}>
      <div className={styles.loadingContainer}>
        <span className={styles.loadingText}>처리 중</span>
        <span className={styles.loadingDot}></span>
        <span className={styles.loadingDot}></span>
        <span className={styles.loadingDot}></span>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      {findPasswordCheck ? (
        <div>
          <p className={styles.successNoticeContent}>
            임시 비밀번호를 전송하였습니다.
            <br />
            전송 받은 임시 비밀번호로 로그인해주세요.
          </p>
          <div
            onClick={() => navigate("/admin/login")}
            className={styles.successBtnContent}
          >
            로그인
          </div>
        </div>
      ) : (
        <div>
          <h2 className={styles.titleContent}>관리자 비밀번호 찾기</h2>
          <p className={styles.noticeContent}>
            가입 시 등록하신 휴대폰 번호와 이메일을 입력하시면,
            <br />
            이메일로 임시 비밀번호를 전송해 드립니다.
          </p>

          {errorMessage && (
            <div className={styles.errorMessage}>{errorMessage}</div>
          )}

          <div className={styles.phoneInputContent}>
            <h3 className={styles.inputTitleContent}>휴대폰 번호</h3>
            <input
              className={styles.inputField}
              placeholder="가입하신 휴대폰 번호"
              type="text"
              value={findPasswordData.phoneNumber}
              onChange={handleInputPhoneChange}
              disabled={isLoading}
            />
          </div>

          <div className={styles.emailInputContent}>
            <h3 className={styles.inputTitleContent}>이메일 주소</h3>
            <input
              className={styles.inputField}
              placeholder="예) admin@fream.co.kr"
              type="text"
              value={findPasswordData.email}
              onChange={handleInputEmailChange}
              disabled={isLoading}
            />
          </div>

          {isLoading ? (
            <LoadingButton />
          ) : findPasswordBtn ? (
            <div onClick={handleFindPasswordFetch} className={styles.btnActive}>
              이메일 발송하기
            </div>
          ) : (
            <div className={styles.btnInactive}>이메일 발송하기</div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminFindPassword;
