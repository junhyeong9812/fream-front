import "../css/loginPage.css";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SiNaver } from "react-icons/si";
import { FaApple } from "react-icons/fa";
import { LoginData } from "../types/loginTypes";
import { fetchLoginData } from "../services/loginService";
import { AuthContext } from "src/global/context/AuthContext";
import { useHeader } from "src/global/context/HeaderContext";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { headerHeight } = useHeader();
  const { setIsLoggedIn } = useContext(AuthContext); // ← 로그인 성공 시 Context 갱신

  const [loginData, setLoginData] = useState<LoginData>({
    email: "user1@example.com",
    password: "password123!",
  });

  useEffect(() => {
    // console.log("이메일 : ", loginData.email);
    // console.log("비밀번호 : ", loginData.password);
  }, [loginData]);

  // 이메일 변경 함수
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData((prevData) => ({
      ...prevData, // 기존 값 복사
      email: e.target.value, // email만 업데이트
    }));
  };

  // 비밀번호 변경 함수
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData((prevData) => ({
      ...prevData, // 기존 값 복사
      password: e.target.value, // password만 업데이트
    }));
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
        // console.log("이메일 완성");
      } else {
        setEmailWarn(true);
        setEmailSuccess(false);
        // console.log("이메일 미완성");
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
        // console.log("비밀번호 완성");
      } else {
        setPasswordWarn(true);
        setPasswordSuccess(false);
        // console.log("비밀번호 미완성")
      }
    } else {
      setPasswordWarn(false);
    }

    // 최종 로그인
    if (emailSuccess && passwordSuccess) {
      setLoginBtn(true);
    } else {
      setLoginBtn(false);
    }
  }, [
    loginData.email,
    loginData.password,
    emailWarn,
    passwordWarn,
    emailSuccess,
    passwordSuccess,
    loginBtn,
  ]);

  const handleLoginFetch = async () => {
    const result = await fetchLoginData(loginData.email, loginData.password);
    if (result !== "no") {
      // 로그인 성공 시
      const now = Date.now();
      const expire = now + 30 * 60 * 1000; // 30분 후 (ms)

      const loginData = {
        value: "true",
        expire,
      };
      localStorage.setItem("IsLoggedIn", JSON.stringify(loginData));

      setIsLoggedIn(true);
      alert("로그인 성공");
      navigate("/");
    } else {
      alert("로그인 실패");
      navigate("/login");
    }
  };

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
              navigate("/");
            }}
            className="login_form_logo"
            src={`/Fream.png`}
            alt=""
          ></img>
        </div>
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
          ></input>
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
          ></input>
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

        {loginBtn ? (
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
              navigate("/join");
            }}
            className="login_form_category1"
          >
            이메일 가입
          </div>
          <div
            onClick={() => {
              navigate("/login/find_email");
            }}
            className="login_form_category2"
          >
            이메일 찾기
          </div>
          <div
            onClick={() => {
              navigate("/login/find_password");
            }}
            className="login_form_category3"
          >
            비밀번호 찾기
          </div>
        </div>
        <div className="login_form_sns_conatiner">
          <div className="login_form_sns_content">
            <div className="login_form_sns_icon_content">
              <SiNaver className="login_form_sns_naver" />
            </div>
            <div className="login_form_sns_text">네이버로 로그인</div>
          </div>
          <div className="login_form_sns_content">
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
