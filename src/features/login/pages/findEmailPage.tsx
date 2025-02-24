import "../css/findEmailPage.css";
import React, { useEffect, useState } from "react";
import { FindEmailData } from "../types/findEmailTypes";
import { fetchFindEmailData } from "../services/findEmailService";
import { useNavigate } from "react-router-dom";
import { useHeader } from "src/global/context/HeaderContext";

const FindEmail: React.FC = () => {
  const navigate = useNavigate();
  const { headerHeight } = useHeader();

  const [findEmailBtn, setFindEmailBtn] = useState<boolean>(false);

  const [phoneNumber, setPhoneNumber] = useState<FindEmailData>({ phone: "" });
  const [isValid, setIsValid] = useState<boolean>(false);

  // 숫자만 입력하도록 처리하는 함수
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value.replace(/[^0-9]/g, "");

    const validStartNumbers = ["010", "011", "016", "017", "018", "019"];
    const isLengthValid = value.length === 10 || value.length === 11;
    const startsWithValidPrefix = validStartNumbers.some((prefix) =>
      value.startsWith(prefix)
    );

    // 유효성 검사
    setIsValid(isLengthValid && startsWithValidPrefix);

    setPhoneNumber({ phone: value }); // 상태에 입력된 전화번호 업데이트
  };

  useEffect(() => {
    if (isValid) {
      setFindEmailBtn(true);
    } else {
      setFindEmailBtn(false);
    }
  }, [findEmailBtn, isValid]);

  const [findEmailCheck, setFindEmailCheck] = useState<boolean>(false);
  const [findEmail, setFindEmail] = useState<string>("");

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

  const formatPhoneNumber = (number: string) => {
    if (number.length === 11) {
      // "01011223344" -> "010-1122-3344"
      return number.replace(/^(\d{3})(\d{4})(\d{4})$/, "$1-$2-$3");
    } else if (number.length === 10) {
      // "0101123344" -> "010-112-3344"
      return number.replace(/^(\d{3})(\d{3})(\d{4})$/, "$1-$2-$3");
    }
    return number;
  };

  const handleFindEmailFetch = async () => {
    const result = await fetchFindEmailData(
      formatPhoneNumber(phoneNumber.phone)
    );
    console.log(result);
    if (result === "no") {
      navigate("/login/find_email");
      alert("일치하는 사용자 정보를 찾을 수 없습니다.");
    } else if (typeof result === "string") {
      // 이메일을 반환하는 경우
      setFindEmailCheck(true);
      setFindEmail(result);
    } else if (result && result.email) {
      // result가 객체일 경우, email 속성 추출
      setFindEmailCheck(true);
      setFindEmail(result.email); // 이메일 값만 설정
    }
  };

  // const displayEmail = maskEmail(findEmail);

  return (
    <div
      className="find_email_form_container"
      style={{
        paddingTop: `${headerHeight + 60}px`,
        minHeight: `calc(100vh - ${headerHeight}px)`,
      }}
    >
      {findEmailCheck ? (
        <div>
          <h2 className="find_email_form_success_title_content">
            이메일 주소 찾기에 성공하였습니다.
          </h2>
          <div className="find_email_form_success_info_content">
            <p className="find_email_form_success_info_text">이메일 주소</p>
            <p className="find_email_form_success_info_email">
              {maskEmail(findEmail)}
            </p>
          </div>
          <div className="find_email_form_success_btn_content">
            <div
              onClick={() => {
                navigate("/login/find_password");
              }}
              className="find_email_form_success_password_btn"
            >
              비밀번호 찾기
            </div>
            <div
              onClick={() => {
                navigate("/login");
              }}
              className="find_email_form_success_login_btn"
            >
              로그인
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h2 className="find_email_form_title_content">이메일 아이디 찾기</h2>
          <p className="find_email_form_notice_content">
            가입 시 등록한 휴대폰 번호를 입력하면
            <br />
            이메일 주소의 일부를 알려드립니다.
          </p>

          <div className="find_email_form_input_content">
            <h3 className="find_email_form_input_title_content">휴대폰 번호</h3>
            <input
              className="find_email_form_input"
              placeholder="가입하신 휴대폰 번호"
              type="text"
              value={phoneNumber.phone}
              onChange={handleInputChange}
            ></input>
          </div>

          {findEmailBtn ? (
            <div
              onClick={handleFindEmailFetch}
              className="find_email_form_btn_content"
            >
              이메일 아이디 찾기
            </div>
          ) : (
            <div className="find_email_form_btn_none_content">
              이메일 아이디 찾기
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FindEmail;
