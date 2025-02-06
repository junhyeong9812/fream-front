import "../css/findPasswordPage.css";
import React, { useEffect, useState } from "react";
import { FindPasswordData } from "../types/findPasswordType";
import { fetchFindPasswordData } from "../services/findPasswordService";
import { useNavigate } from "react-router-dom";

const FindPassword: React.FC = () => {
  const navigate = useNavigate();

  const [findPasswordBtn, setFindPasswordBtn] = useState<boolean>(false);

  const [findPasswordData, setFindPasswordData] = useState<FindPasswordData>({
    phone: "",
    email: "",
  });

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

    // 입력된 이메일을 상태에 저장
    setFindPasswordData((prevData) => ({
      ...prevData,
      email: value,
    }));
  };

  // 최종 로그인
  useEffect(() => {
    if (phoneIsValid && emailIsValid) {
      setFindPasswordBtn(true);
    } else {
      setFindPasswordBtn(false);
    }
  }, [phoneIsValid, emailIsValid, findPasswordBtn]);

  const [findPasswordCheck, setFindPasswordCheck] = useState<boolean>(false);

  const handleFindPasswordFetch = async () => {
    const result = await fetchFindPasswordData(
      findPasswordData.phone,
      findPasswordData.email
    );
    console.log(result);
    if (result !== "no") {
      setFindPasswordCheck(true);
    }
    if (result === "no") {
      navigate("/login/find_password");
      alert("일치하는 사용자 정보를 찾을 수 없습니다.");
    }
  };

  return (
    <div className="find_password_form_container">
      {findPasswordCheck ? (
        <div>
          <p className="find_password_form_success_notice_content">
            임시 비밀번호를 전송하였습니다.
            <br />
            전송 받은 임시 비밀번호로 로그인해주세요.
          </p>
          <div
            onClick={() => {
              navigate("/login");
            }}
            className="find_password_form_success_btn_content"
          >
            로그인
          </div>
        </div>
      ) : (
        <div>
          <h2 className="find_password_form_title_content">비밀번호 찾기</h2>
          <p className="find_password_form_notice_content">
            가입 시 등록하신 휴대폰 번호와 이메일을 입력하시면,
            <br />
            휴대폰으로 임시 비밀번호를 전송해 드립니다.
          </p>
          <div className="find_password_form_phone_input_content">
            <h3 className="find_password_form_phone_input_title_content">
              휴대폰 번호
            </h3>
            <input
              className="find_email_form_phone_input"
              placeholder="가입하신 휴대폰 번호"
              type="text"
              value={findPasswordData.phone}
              onChange={handleInputPhoneChange}
            ></input>
          </div>

          <div className="find_password_form_email_input_content">
            <h3 className="find_password_form_email_input_title_content">
              이메일 주소
            </h3>
            <input
              className="find_password_form_email_input"
              placeholder="예) kream@kream.co.kr"
              type="text"
              onChange={handleInputEmailChange}
            ></input>
          </div>

          {findPasswordBtn ? (
            <div
              onClick={handleFindPasswordFetch}
              className="find_password_form_btn_content"
            >
              문자 발송하기
            </div>
          ) : (
            <div className="find_password_form_btn_none_content">
              문자 발송하기기
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FindPassword;
