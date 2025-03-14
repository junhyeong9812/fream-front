import "../css/joinPage.css";
import React, { useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import JoinModal from "../components/joinModal";
import { JoinData } from "../types/joinTypes";
import { fetchJoinData } from "../services/joinService";
import { useNavigate } from "react-router-dom";
import { useHeader } from "src/global/context/HeaderContext";

const JoinPage: React.FC = () => {
  const navigate = useNavigate();
  const { headerHeight } = useHeader();

  const [joinData, setJoinData] = useState<JoinData>({
    email: "",
    password: "",
    size: "",
    code: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    console.log("이메일 : ", joinData.email);
    console.log("비밀번호 : ", joinData.password);
    console.log("사이즈 : ", joinData.size);
    console.log("코드 : ", joinData.code);
  }, [joinData]);

  // 이메일 변경 함수
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJoinData((prevData) => ({
      ...prevData, // 기존 값 복사
      email: e.target.value, // email만 업데이트
    }));
  };

  // 비밀번호 변경 함수
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJoinData((prevData) => ({
      ...prevData, // 기존 값 복사
      password: e.target.value, // password만 업데이트
    }));
  };

  // 코드 변경 함수
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJoinData((prevData) => ({
      ...prevData, // 기존 값 복사
      code: e.target.value, // code만 업데이트
    }));
  };

  // 사이즈 변경 함수
  const [sizeModal, setSizeModal] = useState<boolean>(false);
  const [selectedSize, setSelectedSize] = useState<string>("선택하세요");

  useEffect(() => {
    setJoinData((prevData) => ({
      ...prevData,
      size: selectedSize, // size 값을 동기화
    }));
  }, [selectedSize]); // size가 변경될 때마다 실행

  // 동의사항 변경 함수
  const agreementTexts: string[] = [
    "[필수] 만 14세 이상입니다",
    "[필수] 이용약관 동의",
    "[필수] 개인 정보 수집 및 이용 동의",
    "[선택] 개인 정보 수집 및 이용 동의",
    "[선택] 광고성 정보 수신 모두 동의",
  ];

  const [agreementBtn, setAgreementBtn] = useState<boolean>(false);

  const [agreementAge, setAgreementAge] = useState<boolean>(false);
  const [agreementTerms, setAgreementTerms] = useState<boolean>(false);
  const [agreementPrivacyRequired, setAgreementPrivacyRequired] =
    useState<boolean>(false);
  const [agreementPrivacyOptional, setAgreementPrivacyOptional] =
    useState<boolean>(false);
  const [agreementAdvertisement, setAgreementAdvertisement] =
    useState<boolean>(false);

  const agreementAllCheck = () => {
    setAgreementBtn((prevState) => !prevState);
  };

  const agreementAgeCheck = () => {
    setAgreementAge((prevState) => !prevState);
  };
  const agreementTermsCheck = () => {
    setAgreementTerms((prevState) => !prevState);
  };
  const agreementPrivacyRequiredCheck = () => {
    setAgreementPrivacyRequired((prevState) => !prevState);
  };
  const agreementPrivacyOptionalCheck = () => {
    setAgreementPrivacyOptional((prevState) => !prevState);
  };
  const agreementAdvertisementCheck = () => {
    setAgreementAdvertisement((prevState) => !prevState);
  };

  useEffect(() => {
    if (agreementBtn) {
      setAgreementAge(true);
      setAgreementTerms(true);
      setAgreementPrivacyRequired(true);
      setAgreementPrivacyOptional(true);
      setAgreementAdvertisement(true);
    }
    if (!agreementBtn) {
      setAgreementAge(false);
      setAgreementTerms(false);
      setAgreementPrivacyRequired(false);
      setAgreementPrivacyOptional(false);
      setAgreementAdvertisement(false);
    }
  }, [agreementBtn]);

  let [emailWarn, setEmailWarn] = useState<boolean>(true);
  let [emailSuccess, setEmailSuccess] = useState<boolean>(false);

  let [passwordWarn, setPasswordWarn] = useState<boolean>(true);
  let [passwordSuccess, setPasswordSuccess] = useState<boolean>(false);

  let [signupBtn, setSignupBtn] = useState<boolean>(false);

  useEffect(() => {
    // 이메일 정규식
    const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
    if (joinData.email.length > 0) {
      if (emailRegex.test(joinData.email)) {
        setEmailWarn(false);
        setEmailSuccess(true);
        console.log("이메일 완성");
      } else {
        setEmailWarn(true);
        setEmailSuccess(false);
        console.log("이메일 미완성");
      }
    } else {
      setEmailWarn(false);
    }

    // 비밀번호 정규식
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>~\-=_+\[\]/])[A-Za-z\d!@#$%^&*(),.?":{}|<>~\-=_+\[\]/]{8,16}$/;
    if (joinData.password.length > 0) {
      if (passwordRegex.test(joinData.password)) {
        setPasswordWarn(false);
        setPasswordSuccess(true);
        console.log("비밀번호 완성");
      } else {
        setPasswordWarn(true);
        setPasswordSuccess(false);
        console.log("비밀번호 미완성");
      }
    } else {
      setPasswordWarn(false);
    }

    // 최종 가입 버튼 활성화 여부
    if (
      emailSuccess &&
      passwordSuccess &&
      agreementAge &&
      agreementTerms &&
      agreementPrivacyRequired &&
      selectedSize !== "선택하세요"
    ) {
      setSignupBtn(true);
    } else {
      setSignupBtn(false);
    }
  }, [
    joinData.email,
    joinData.password,
    emailWarn,
    passwordWarn,
    emailSuccess,
    passwordSuccess,
    agreementAge,
    agreementTerms,
    agreementPrivacyRequired,
    selectedSize,
  ]);

  const handleSignupFetch = async () => {
    if (!signupBtn) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      const result = await fetchJoinData(
        joinData.email,
        joinData.password,
        joinData.size,
        joinData.code,
        agreementAge,
        agreementTerms,
        agreementPrivacyRequired,
        agreementPrivacyOptional,
        agreementAdvertisement
      );

      if (result.success) {
        navigate("/login");
        alert("회원가입이 완료되었습니다.");
      } else {
        setErrorMessage(result.message || "회원가입에 실패하였습니다.");
      }
    } catch (error) {
      console.error("회원가입 처리 중 오류 발생:", error);
      setErrorMessage("회원가입 처리 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="signup_form_container"
      style={{
        paddingTop: `${headerHeight + 60}px`,
        minHeight: `calc(100vh - ${headerHeight}px)`,
      }}
    >
      <div className="signup_form_margin_content">
        <div className="signup_form_content">
          <div className="signup_form_title_content">회원가입</div>

          <div className="signup_form_email_input_content">
            <div
              className={`signup_form_email_input_title ${
                emailWarn ? "signup_form_email_input_title_warn" : ""
              }`}
            >
              이메일 주소
            </div>
            <input
              className={`signup_form_email_input ${
                emailWarn
                  ? "signup_form_email_input_warn"
                  : "signup_form_email_input_none_warn"
              }`}
              onChange={handleEmailChange}
              placeholder="예) kream@kream.co.kr"
              type="text"
            ></input>
            <div
              className={`signup_form_email_input_bottom ${
                emailWarn ? "signup_form_email_input_bottom_warn" : ""
              }`}
            >
              {emailWarn ? "이메일 주소를 정확히 입력해주세요." : ""}
            </div>
          </div>

          <div className="signup_form_password_input_content">
            <div
              className={`signup_form_password_input_title ${
                passwordWarn ? "signup_form_password_input_title_warn" : ""
              }`}
            >
              비밀번호
            </div>
            <input
              className={`signup_form_password_input ${
                passwordWarn
                  ? "signup_form_password_input_warn"
                  : "signup_form_password_input_none_warn"
              }`}
              onChange={handlePasswordChange}
              placeholder="영문, 숫자, 특수문자 조합 8-16자"
              type="password"
            ></input>
            <div
              className={`signup_form_password_input_bottom ${
                passwordWarn ? "signup_form_password_input_bottom_warn" : ""
              }`}
            >
              {passwordWarn
                ? "영문, 숫자, 특수문자를 조합해서 입력해주세요. (8-16자)"
                : ""}
            </div>
          </div>

          <div className="signup_form_referrer_input_content">
            <div className="signup_form_referrer_input_title">추천인코드</div>
            <input
              className="signup_form_referrer_input"
              onChange={handleCodeChange}
              placeholder="추천인 코드를 입력하세요"
              type="text"
            ></input>
          </div>

          <div className="signup_form_shoes_input_content">
            <div className="signup_form_shoes_input_title">신발 사이즈</div>
            <div
              onClick={() => setSizeModal(true)}
              className="signup_form_shoes_input"
            >
              <div
                className={`signup_form_shoes_input_text ${
                  selectedSize === "선택하세요" ? "unselected" : "selected"
                }`}
              >
                {selectedSize}
              </div>
              <div className="signup_form_shoes_input_arrow_content">
                <IoIosArrowForward className="signup_form_shoes_input_arrow" />
              </div>
            </div>
            {sizeModal ? (
              <JoinModal
                setSizeModal={setSizeModal}
                setSize={setSelectedSize}
                size={selectedSize}
              />
            ) : null}
          </div>

          <div className="signup_form_agreement_input_container">
            <div className="signup_form_agreement_input_title_container">
              <div className="signup_form_agreement_input_title_checkbox_content">
                <input
                  checked={agreementBtn}
                  onChange={agreementAllCheck}
                  id="check1"
                  className="signup_form_agreement_input_title_checkbox"
                  type="checkbox"
                />
                <label
                  htmlFor="check1"
                  className="signup_form_agreement_input_title_checkbox_label"
                ></label>
              </div>
              <div className="signup_form_agreement_input_title_content">
                <p className="signup_form_agreement_input_title1">
                  모두 동의합니다
                  <p className="signup_form_agreement_input_title2">
                    선택 동의 항목 포함
                  </p>
                </p>
              </div>
            </div>
            {agreementTexts.map((item, index) => (
              <div className="signup_form_agreement_input_content" key={index}>
                {index === 0 &&
                  (agreementAge ? (
                    <div
                      onClick={() => agreementAgeCheck()}
                      className="signup_form_agreement_input_content_check active"
                    >
                      ✔
                    </div>
                  ) : (
                    <div
                      onClick={() => agreementAgeCheck()}
                      className="signup_form_agreement_input_content_check inactive"
                    >
                      ✔
                    </div>
                  ))}
                {index === 1 &&
                  (agreementTerms ? (
                    <div
                      onClick={() => agreementTermsCheck()}
                      className="signup_form_agreement_input_content_check active"
                    >
                      ✔
                    </div>
                  ) : (
                    <div
                      onClick={() => agreementTermsCheck()}
                      className="signup_form_agreement_input_content_check inactive"
                    >
                      ✔
                    </div>
                  ))}
                {index === 2 &&
                  (agreementPrivacyRequired ? (
                    <div
                      onClick={() => agreementPrivacyRequiredCheck()}
                      className="signup_form_agreement_input_content_check active"
                    >
                      ✔
                    </div>
                  ) : (
                    <div
                      onClick={() => agreementPrivacyRequiredCheck()}
                      className="signup_form_agreement_input_content_check inactive"
                    >
                      ✔
                    </div>
                  ))}
                {index === 3 &&
                  (agreementPrivacyOptional ? (
                    <div
                      onClick={() => agreementPrivacyOptionalCheck()}
                      className="signup_form_agreement_input_content_check active"
                    >
                      ✔
                    </div>
                  ) : (
                    <div
                      onClick={() => agreementPrivacyOptionalCheck()}
                      className="signup_form_agreement_input_content_check inactive"
                    >
                      ✔
                    </div>
                  ))}
                {index === 4 &&
                  (agreementAdvertisement ? (
                    <div
                      onClick={() => agreementAdvertisementCheck()}
                      className="signup_form_agreement_input_content_check active"
                    >
                      ✔
                    </div>
                  ) : (
                    <div
                      onClick={() => agreementAdvertisementCheck()}
                      className="signup_form_agreement_input_content_check inactive"
                    >
                      ✔
                    </div>
                  ))}
                <div className="signup_form_agreement_input_content_text">
                  {item}
                </div>
              </div>
            ))}
          </div>

          {errorMessage && (
            <div className="signup_form_error_message">{errorMessage}</div>
          )}

          {isLoading ? (
            <div className="signup_form_signup_btn_loading_content">
              본인인증 및 가입 처리 중...
            </div>
          ) : signupBtn ? (
            <div
              onClick={handleSignupFetch}
              className="signup_form_signup_btn_content"
            >
              본인 인증하고 가입하기
            </div>
          ) : (
            <div className="signup_form_signup_btn_none_content">
              본인 인증하고 가입하기
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JoinPage;
