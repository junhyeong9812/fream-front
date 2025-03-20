import "../css/loginPage.css";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SiNaver } from "react-icons/si";
import { FaApple } from "react-icons/fa";
import { LoginData } from "../types/loginTypes";
import { fetchLoginData, checkLoginStatus } from "../services/loginService";
import { AuthContext } from "src/global/context/AuthContext";
import { useHeader } from "src/global/context/HeaderContext";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { headerHeight } = useHeader();
  const { setIsLoggedIn } = useContext(AuthContext);

  const [loginData, setLoginData] = useState<LoginData>({
    email: "user1@example.com",
    password: "password123!",
  });

  // 로딩 상태 추가
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // 에러 메시지 상태 추가
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 이미 로그인 상태라면 홈으로 리다이렉트
  useEffect(() => {
    if (checkLoginStatus()) {
      setIsLoggedIn(true);
      navigate("/");
    }
  }, [navigate, setIsLoggedIn]);

  // 이메일 변경 함수
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData((prevData) => ({
      ...prevData,
      email: e.target.value,
    }));
    setErrorMessage(null); // 입력 변경 시 에러 메시지 초기화
  };

  // 비밀번호 변경 함수
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData((prevData) => ({
      ...prevData,
      password: e.target.value,
    }));
    setErrorMessage(null); // 입력 변경 시 에러 메시지 초기화
  };

  let [emailWarn, setEmailWarn] = useState<boolean>(true);
  let [emailSuccess, setEmailSuccess] = useState<boolean>(false);

  let [passwordWarn, setPasswordWarn] = useState<boolean>(true);
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

  const handleLoginFetch = async () => {
    // 로딩 중이거나 버튼이 비활성화된 경우 요청 방지
    if (isLoading || !loginBtn) return;

    // 로딩 상태 시작
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await fetchLoginData(loginData.email, loginData.password);

      if (result !== "no") {
        // 로그인 성공 시 (이제 토큰과 로컬 스토리지는 서비스에서 처리됨)
        setIsLoggedIn(true);
        navigate("/");
      } else {
        setErrorMessage("이메일 또는 비밀번호가 올바르지 않습니다.");
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
    <div className="login_form_loading_container">
      <span className="login_form_loading_text">로그인 중</span>
      <span className="login_form_loading_dot"></span>
      <span className="login_form_loading_dot"></span>
      <span className="login_form_loading_dot"></span>
    </div>
  );

  return (
    <div
      className="login_form_container"
      style={{
        paddingTop: `${headerHeight + 60}px`,
        minHeight: `calc(100vh - ${headerHeight}px)`,
      }}
    >
      <div className="login_form_content">
        <div className="login_form_logo_content">
          <img
            onClick={() => {
              if (!isLoading) navigate("/");
            }}
            className={`login_form_logo ${
              isLoading ? "login_form_disabled" : ""
            }`}
            src={`/Fream.png`}
            alt="로고"
          />
        </div>

        {/* 에러 메시지 표시 */}
        {errorMessage && (
          <div className="login_form_error_message">{errorMessage}</div>
        )}

        <div className="login_form_email_input_container">
          <div
            className={`login_form_email_input_title ${
              emailWarn ? "login_form_email_input_title_warn" : ""
            }`}
          >
            이메일 주소
          </div>
          <input
            className={`login_form_email_input ${
              emailWarn
                ? "login_form_email_input_warn"
                : "login_form_email_input_none_warn"
            }`}
            value={loginData.email}
            onChange={handleEmailChange}
            type="text"
            placeholder="예) kream@kream.co.kr"
            disabled={isLoading}
          />
          <div
            className={`login_form_email_input_bottom ${
              emailWarn ? "login_form_email_input_bottom_warn" : ""
            }`}
          >
            {emailWarn ? "이메일 주소를 정확히 입력해주세요." : ""}
          </div>
        </div>

        <div className="login_form_password_input_container">
          <div
            className={`login_form_password_input_title ${
              passwordWarn ? "login_form_password_input_title_warn" : ""
            }`}
          >
            비밀번호
          </div>
          <input
            className={`login_form_password_input ${
              passwordWarn
                ? "login_form_password_input_warn"
                : "login_form_password_input_none_warn"
            }`}
            value={loginData.password}
            onChange={handlePasswordChange}
            type="password"
            maxLength={16}
            disabled={isLoading}
          />
          <div
            className={`login_form_password_input_bottom ${
              passwordWarn ? "login_form_password_input_bottom_warn" : ""
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
          <div
            onClick={handleLoginFetch}
            className="login_form_login_btn_container"
          >
            로그인
          </div>
        ) : (
          <div className="login_form_login_none_btn_container">로그인</div>
        )}

        <div className="login_form_category_container">
          <div
            onClick={() => {
              if (!isLoading) navigate("/join");
            }}
            className={`login_form_category1 ${
              isLoading ? "login_form_disabled" : ""
            }`}
          >
            이메일 가입
          </div>
          <div
            onClick={() => {
              if (!isLoading) navigate("/login/find_email");
            }}
            className={`login_form_category2 ${
              isLoading ? "login_form_disabled" : ""
            }`}
          >
            이메일 찾기
          </div>
          <div
            onClick={() => {
              if (!isLoading) navigate("/login/find_password");
            }}
            className={`login_form_category3 ${
              isLoading ? "login_form_disabled" : ""
            }`}
          >
            비밀번호 찾기
          </div>
        </div>

        <div className="login_form_sns_conatiner">
          <div
            className={`login_form_sns_content ${
              isLoading ? "login_form_disabled" : ""
            }`}
          >
            <div className="login_form_sns_icon_content">
              <SiNaver className="login_form_sns_naver" />
            </div>
            <div className="login_form_sns_text">네이버로 로그인</div>
          </div>
          <div
            className={`login_form_sns_content ${
              isLoading ? "login_form_disabled" : ""
            }`}
          >
            <div className="login_form_sns_icon_content">
              <FaApple className="login_form_sns_apple" />
            </div>
            <div className="login_form_sns_text">Apple로 로그인</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
