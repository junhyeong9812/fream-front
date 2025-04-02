import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "src/global/context/AdminAuthContext";
import styles from "./AdminLoginPage.module.css";
import {
  fetchAdminLoginData,
  checkAdminLoginStatus,
} from "../services/adminAuthService";
import { AdminLoginData } from "../types/AdminLoginTypes";
const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setIsAdminLoggedIn } = useAdminAuth();

  const [loginData, setLoginData] = useState<AdminLoginData>({
    email: "admin@example.com",
    password: "adminpassword123!",
  });

  // 로딩 상태 추가
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // 에러 메시지 상태 추가
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 이미 로그인 상태라면 관리자 대시보드로 리다이렉트
  useEffect(() => {
    if (checkAdminLoginStatus()) {
      setIsAdminLoggedIn(true);
      navigate("/admin");
    }
  }, [navigate, setIsAdminLoggedIn]);

  // 이메일 변경 함수
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData((prevData: AdminLoginData) => ({
      ...prevData,
      email: e.target.value,
    }));
    setErrorMessage(null); // 입력 변경 시 에러 메시지 초기화
  };

  // 비밀번호 변경 함수
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData((prevData: AdminLoginData) => ({
      ...prevData,
      password: e.target.value,
    }));
    setErrorMessage(null); // 입력 변경 시 에러 메시지 초기화
  };

  let [emailWarn, setEmailWarn] = useState<boolean>(false);
  let [emailSuccess, setEmailSuccess] = useState<boolean>(false);

  let [passwordWarn, setPasswordWarn] = useState<boolean>(false);
  let [passwordSuccess, setPasswordSuccess] = useState<boolean>(false);

  let [loginBtn, setLoginBtn] = useState<boolean>(false);

  useEffect(() => {
    // 이메일 정규식
    const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
    if (loginData.email.length > 0) {
      if (emailRegex.test(loginData.email)) {
        setEmailWarn(false);
        setEmailSuccess(true);
      } else {
        setEmailWarn(true);
        setEmailSuccess(false);
      }
    } else {
      setEmailWarn(false);
    }

    // 비밀번호 정규식
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>~\-=_+\[\]/])[A-Za-z\d!@#$%^&*(),.?":{}|<>~\-=_+\[\]/]{8,16}$/;
    if (loginData.password.length > 0) {
      if (passwordRegex.test(loginData.password)) {
        setPasswordWarn(false);
        setPasswordSuccess(true);
      } else {
        setPasswordWarn(true);
        setPasswordSuccess(false);
      }
    } else {
      setPasswordWarn(false);
    }

    // 최종 로그인 버튼 활성화 여부
    if (emailSuccess && passwordSuccess) {
      setLoginBtn(true);
    } else {
      setLoginBtn(false);
    }
  }, [loginData.email, loginData.password, emailSuccess, passwordSuccess]);

  const handleAdminLoginFetch = async () => {
    // 로딩 중이거나 버튼이 비활성화된 경우 요청 방지
    if (isLoading || !loginBtn) return;

    // 로딩 상태 시작
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // 관리자 로그인 API 호출
      const result = await fetchAdminLoginData(
        loginData.email,
        loginData.password
      );

      if (result === "yes") {
        // 로그인 성공
        setIsAdminLoggedIn(true);
        navigate("/admin");
      } else if (result === "not_admin") {
        // 관리자 권한 없음
        setErrorMessage("관리자 권한이 없는 계정입니다.");
        setIsLoading(false);
      } else if (result === "invalid_credentials") {
        // 로그인 정보 불일치
        setErrorMessage("이메일 또는 비밀번호가 올바르지 않습니다.");
        setIsLoading(false);
      } else {
        // 기타 오류
        setErrorMessage(
          "로그인 처리 중 오류가 발생했습니다. 다시 시도해주세요."
        );
        setIsLoading(false);
      }
    } catch (error) {
      console.error("로그인 처리 중 오류:", error);
      setErrorMessage("로그인 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
      setIsLoading(false);
    }
  };

  // 로딩 버튼 컴포넌트
  const LoadingButton = () => (
    <div className={styles.loginButtonInactive}>
      <div className={styles.loadingContainer}>
        <span className={styles.loadingText}>로그인 중</span>
        <span className={styles.loadingDot}></span>
        <span className={styles.loadingDot}></span>
        <span className={styles.loadingDot}></span>
      </div>
    </div>
  );

  return (
    <div className={styles.adminLoginContainer}>
      <div className={styles.adminLoginContent}>
        <div className={styles.adminLogoContent}>
          <span className={styles.adminLogoText}>Fream</span>
        </div>

        {/* 에러 메시지 표시 */}
        {errorMessage && (
          <div className={styles.errorMessage}>{errorMessage}</div>
        )}

        <div className={styles.inputContainer}>
          <div
            className={`${styles.inputTitle} ${
              emailWarn ? styles.inputTitleWarn : ""
            }`}
          >
            이메일 주소
          </div>
          <input
            className={`${styles.input} ${emailWarn ? styles.inputWarn : ""}`}
            value={loginData.email}
            onChange={handleEmailChange}
            type="text"
            placeholder="예) admin@fream.co.kr"
            disabled={isLoading}
          />
          <div
            className={`${styles.inputBottom} ${
              emailWarn ? styles.inputBottomWarn : ""
            }`}
          >
            {emailWarn ? "이메일 주소를 정확히 입력해주세요." : ""}
          </div>
        </div>

        <div className={styles.inputContainer}>
          <div
            className={`${styles.inputTitle} ${
              passwordWarn ? styles.inputTitleWarn : ""
            }`}
          >
            비밀번호
          </div>
          <input
            className={`${styles.input} ${styles.passwordInput} ${
              passwordWarn ? styles.inputWarn : ""
            }`}
            value={loginData.password}
            onChange={handlePasswordChange}
            type="password"
            maxLength={16}
            disabled={isLoading}
          />
          <div
            className={`${styles.inputBottom} ${
              passwordWarn ? styles.inputBottomWarn : ""
            }`}
          >
            {passwordWarn
              ? "영문, 숫자, 특수문자를 조합해서 입력해주세요. (8-16자)"
              : ""}
          </div>
        </div>

        {/* 로딩 상태에 따른 버튼 렌더링 */}
        {isLoading ? (
          <LoadingButton />
        ) : loginBtn ? (
          <div onClick={handleAdminLoginFetch} className={styles.loginButton}>
            관리자 로그인
          </div>
        ) : (
          <div className={styles.loginButtonInactive}>관리자 로그인</div>
        )}

        <div className={styles.categoryContainer}>
          <div
            onClick={() => {
              if (!isLoading) navigate("/admin/login/find_email");
            }}
            className={`${styles.categoryItem} ${
              isLoading ? styles.disabled : ""
            }`}
          >
            이메일 찾기
          </div>
          <div
            onClick={() => {
              if (!isLoading) navigate("/admin/login/find_password");
            }}
            className={`${styles.categoryItem} ${
              isLoading ? styles.disabled : ""
            }`}
          >
            비밀번호 찾기
          </div>
          <div
            onClick={() => {
              if (!isLoading) navigate("/");
            }}
            className={`${styles.categoryItem} ${
              isLoading ? styles.disabled : ""
            }`}
          >
            일반 페이지
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
