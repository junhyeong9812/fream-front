import styles from "../OAuthCompleteSignupPage.module.css";
import React, { useContext, useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import OAuthSizeModal from "../components/OAuthSizeModal";
import { useNavigate } from "react-router-dom";
import { useHeader } from "src/global/context/HeaderContext";
import { AuthContext } from "src/global/context/AuthContext";
import { Gender, OAuthCompleteSignupData } from "../types/OAuthSignupTypes";
import {
  completeOAuthSignup,
  extractTokenFromUrl,
} from "../services/OAuthSignupService";

const OAuthCompleteSignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { headerHeight } = useHeader();
  const { setIsLoggedIn } = useContext(AuthContext);

  // 토큰 검증 및 추출
  const [token, setToken] = useState<string | null>(null);
  const [tokenValid, setTokenValid] = useState<boolean>(false);

  // 회원가입 데이터
  const [signupData, setSignupData] = useState<OAuthCompleteSignupData>({
    token: "",
    phoneNumber: "",
    age: 0,
    gender: Gender.MALE,
    shoeSize: "",
    termsAgreement: false,
    privacyAgreement: false,
    optionalPrivacyAgreement: false,
    adConsent: false,
    referralCode: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // URL에서 토큰 추출
  useEffect(() => {
    const extractedToken = extractTokenFromUrl();
    if (extractedToken) {
      setToken(extractedToken);
      setTokenValid(true);
      // 토큰 설정
      setSignupData((prev) => ({
        ...prev,
        token: extractedToken,
      }));
    } else {
      setTokenValid(false);
      setErrorMessage("유효하지 않은 접근입니다.");
    }
  }, []);

  // 입력 필드 핸들러
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phoneNumber = e.target.value.replace(/[^0-9]/g, "");
    setSignupData((prev) => ({
      ...prev,
      phoneNumber,
    }));
  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const age = parseInt(e.target.value) || 0;
    setSignupData((prev) => ({
      ...prev,
      age,
    }));
  };

  const handleGenderChange = (gender: Gender) => {
    setSignupData((prev) => ({
      ...prev,
      gender,
    }));
  };

  const handleReferralCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupData((prev) => ({
      ...prev,
      referralCode: e.target.value,
    }));
  };

  // 신발 사이즈 모달
  const [sizeModal, setSizeModal] = useState<boolean>(false);
  const [selectedSize, setSelectedSize] = useState<string>("선택하세요");

  useEffect(() => {
    setSignupData((prev) => ({
      ...prev,
      shoeSize: selectedSize === "선택하세요" ? "" : selectedSize,
    }));
  }, [selectedSize]);

  // 동의사항 관련
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

  // 전체 동의
  const agreementAllCheck = () => {
    setAgreementBtn((prevState) => !prevState);
  };

  // 개별 동의
  const agreementAgeCheck = () => setAgreementAge((prev) => !prev);
  const agreementTermsCheck = () => setAgreementTerms((prev) => !prev);
  const agreementPrivacyRequiredCheck = () =>
    setAgreementPrivacyRequired((prev) => !prev);
  const agreementPrivacyOptionalCheck = () =>
    setAgreementPrivacyOptional((prev) => !prev);
  const agreementAdvertisementCheck = () =>
    setAgreementAdvertisement((prev) => !prev);

  // 전체 동의 처리
  useEffect(() => {
    if (agreementBtn) {
      setAgreementAge(true);
      setAgreementTerms(true);
      setAgreementPrivacyRequired(true);
      setAgreementPrivacyOptional(true);
      setAgreementAdvertisement(true);
    } else {
      setAgreementAge(false);
      setAgreementTerms(false);
      setAgreementPrivacyRequired(false);
      setAgreementPrivacyOptional(false);
      setAgreementAdvertisement(false);
    }
  }, [agreementBtn]);

  // 동의 상태가 변경될 때마다 signupData 업데이트
  useEffect(() => {
    setSignupData((prev) => ({
      ...prev,
      termsAgreement: agreementTerms,
      privacyAgreement: agreementPrivacyRequired,
      optionalPrivacyAgreement: agreementPrivacyOptional,
      adConsent: agreementAdvertisement,
    }));
  }, [
    agreementTerms,
    agreementPrivacyRequired,
    agreementPrivacyOptional,
    agreementAdvertisement,
  ]);

  // 유효성 검사
  const [phoneWarn, setPhoneWarn] = useState<boolean>(false);
  const [phoneSuccess, setPhoneSuccess] = useState<boolean>(false);
  const [ageWarn, setAgeWarn] = useState<boolean>(false);
  const [ageSuccess, setAgeSuccess] = useState<boolean>(false);

  const [signupBtn, setSignupBtn] = useState<boolean>(false);

  useEffect(() => {
    // 전화번호 유효성 검사
    if (signupData.phoneNumber) {
      const phoneRegex = /^01[016789]\d{7,8}$/;
      if (phoneRegex.test(signupData.phoneNumber)) {
        setPhoneWarn(false);
        setPhoneSuccess(true);
      } else {
        setPhoneWarn(true);
        setPhoneSuccess(false);
      }
    } else {
      setPhoneWarn(false);
      setPhoneSuccess(false);
    }

    // 나이 유효성 검사
    if (signupData.age) {
      if (signupData.age >= 14 && signupData.age <= 120) {
        setAgeWarn(false);
        setAgeSuccess(true);
      } else {
        setAgeWarn(true);
        setAgeSuccess(false);
      }
    } else {
      setAgeWarn(false);
      setAgeSuccess(false);
    }

    // 회원가입 버튼 활성화 여부
    if (
      phoneSuccess &&
      ageSuccess &&
      agreementAge &&
      agreementTerms &&
      agreementPrivacyRequired &&
      signupData.shoeSize !== ""
    ) {
      setSignupBtn(true);
    } else {
      setSignupBtn(false);
    }
  }, [
    signupData.phoneNumber,
    signupData.age,
    signupData.shoeSize,
    phoneSuccess,
    ageSuccess,
    agreementAge,
    agreementTerms,
    agreementPrivacyRequired,
  ]);

  // 회원가입 완료 요청
  const handleSignupSubmit = async () => {
    if (!signupBtn || isLoading) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      const result = await completeOAuthSignup(signupData);

      if (result.success) {
        setIsLoggedIn(true);
        navigate("/");
        alert("회원가입이 완료되었습니다.");
      } else {
        setErrorMessage(result.message || "회원가입에 실패하였습니다.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("회원가입 처리 중 오류 발생:", error);
      setErrorMessage("회원가입 처리 중 오류가 발생했습니다.");
      setIsLoading(false);
    }
  };

  return (
    <div
      className={styles.oauth_signup_form_container}
      style={{
        paddingTop: `${headerHeight + 60}px`,
        minHeight: `calc(100vh - ${headerHeight}px)`,
      }}
    >
      <div className={styles.oauth_signup_form_margin_content}>
        <div className={styles.oauth_signup_form_content}>
          <div className={styles.oauth_signup_form_title_content}>
            소셜 회원가입 완료
          </div>
          <div className={styles.oauth_signup_form_subtitle}>
            추가 정보를 입력하여 회원가입을 완료해주세요.
          </div>

          {/* 에러 메시지 */}
          {errorMessage && (
            <div className={styles.oauth_signup_form_error_message}>
              {errorMessage}
            </div>
          )}

          {/* 전화번호 입력 */}
          <div className={styles.oauth_signup_form_phone_input_content}>
            <div
              className={`${styles.oauth_signup_form_phone_input_title} ${
                phoneWarn ? styles.oauth_signup_form_phone_input_title_warn : ""
              }`}
            >
              전화번호
            </div>
            <input
              className={`${styles.oauth_signup_form_phone_input} ${
                phoneWarn
                  ? styles.oauth_signup_form_phone_input_warn
                  : styles.oauth_signup_form_phone_input_none_warn
              }`}
              onChange={handlePhoneNumberChange}
              placeholder="'-' 없이 입력해주세요"
              type="text"
              maxLength={11}
              value={signupData.phoneNumber}
            ></input>
            <div
              className={`${styles.oauth_signup_form_phone_input_bottom} ${
                phoneWarn
                  ? styles.oauth_signup_form_phone_input_bottom_warn
                  : ""
              }`}
            >
              {phoneWarn ? "올바른 전화번호를 입력해주세요." : ""}
            </div>
          </div>

          {/* 나이 입력 */}
          <div className={styles.oauth_signup_form_age_input_content}>
            <div
              className={`${styles.oauth_signup_form_age_input_title} ${
                ageWarn ? styles.oauth_signup_form_age_input_title_warn : ""
              }`}
            >
              나이
            </div>
            <input
              className={`${styles.oauth_signup_form_age_input} ${
                ageWarn
                  ? styles.oauth_signup_form_age_input_warn
                  : styles.oauth_signup_form_age_input_none_warn
              }`}
              onChange={handleAgeChange}
              placeholder="만 나이를 입력해주세요"
              type="number"
              min="14"
              max="120"
              value={signupData.age || ""}
            ></input>
            <div
              className={`${styles.oauth_signup_form_age_input_bottom} ${
                ageWarn ? styles.oauth_signup_form_age_input_bottom_warn : ""
              }`}
            >
              {ageWarn ? "만 14세 이상만 가입 가능합니다." : ""}
            </div>
          </div>

          {/* 성별 선택 */}
          <div className={styles.oauth_signup_form_gender_container}>
            <div className={styles.oauth_signup_form_gender_title}>성별</div>
            <div className={styles.oauth_signup_form_gender_options}>
              <div
                className={styles.oauth_signup_form_gender_option}
                onClick={() => handleGenderChange(Gender.MALE)}
              >
                <div
                  className={`${styles.oauth_signup_form_gender_radio} ${
                    signupData.gender === Gender.MALE ? styles.selected : ""
                  }`}
                ></div>
                <div className={styles.oauth_signup_form_gender_label}>
                  남성
                </div>
              </div>
              <div
                className={styles.oauth_signup_form_gender_option}
                onClick={() => handleGenderChange(Gender.FEMALE)}
              >
                <div
                  className={`${styles.oauth_signup_form_gender_radio} ${
                    signupData.gender === Gender.FEMALE ? styles.selected : ""
                  }`}
                ></div>
                <div className={styles.oauth_signup_form_gender_label}>
                  여성
                </div>
              </div>
            </div>
          </div>

          {/* 신발 사이즈 선택 */}
          <div className={styles.oauth_signup_form_shoes_input_content}>
            <div className={styles.oauth_signup_form_shoes_input_title}>
              신발 사이즈
            </div>
            <div
              onClick={() => setSizeModal(true)}
              className={styles.oauth_signup_form_shoes_input}
            >
              <div
                className={`${styles.oauth_signup_form_shoes_input_text} ${
                  selectedSize === "선택하세요"
                    ? styles.unselected
                    : styles.selected
                }`}
              >
                {selectedSize}
              </div>
              <div
                className={styles.oauth_signup_form_shoes_input_arrow_content}
              >
                <IoIosArrowForward
                  className={styles.oauth_signup_form_shoes_input_arrow}
                />
              </div>
            </div>
            {sizeModal ? (
              <OAuthSizeModal
                setSizeModal={setSizeModal}
                setSize={setSelectedSize}
                size={selectedSize}
              />
            ) : null}
          </div>

          {/* 추천인 코드 */}
          <div className={styles.oauth_signup_form_referrer_input_content}>
            <div className={styles.oauth_signup_form_referrer_input_title}>
              추천인코드
            </div>
            <input
              className={styles.oauth_signup_form_referrer_input}
              onChange={handleReferralCodeChange}
              placeholder="추천인 코드를 입력하세요"
              type="text"
              value={signupData.referralCode}
            ></input>
          </div>

          {/* 동의 사항 */}
          <div className={styles.oauth_signup_form_agreement_input_container}>
            <div
              className={
                styles.oauth_signup_form_agreement_input_title_container
              }
            >
              <div
                className={
                  styles.oauth_signup_form_agreement_input_title_checkbox_content
                }
              >
                <input
                  checked={agreementBtn}
                  onChange={agreementAllCheck}
                  id="check1"
                  className={
                    styles.oauth_signup_form_agreement_input_title_checkbox
                  }
                  type="checkbox"
                />
                <label
                  htmlFor="check1"
                  className={
                    styles.oauth_signup_form_agreement_input_title_checkbox_label
                  }
                ></label>
              </div>
              <div
                className={
                  styles.oauth_signup_form_agreement_input_title_content
                }
              >
                <p className={styles.oauth_signup_form_agreement_input_title1}>
                  모두 동의합니다
                  <p
                    className={styles.oauth_signup_form_agreement_input_title2}
                  >
                    선택 동의 항목 포함
                  </p>
                </p>
              </div>
            </div>
            {agreementTexts.map((item, index) => (
              <div
                className={styles.oauth_signup_form_agreement_input_content}
                key={index}
              >
                {index === 0 &&
                  (agreementAge ? (
                    <div
                      onClick={agreementAgeCheck}
                      className={`${styles.oauth_signup_form_agreement_input_content_check} ${styles.active}`}
                    >
                      ✔
                    </div>
                  ) : (
                    <div
                      onClick={agreementAgeCheck}
                      className={`${styles.oauth_signup_form_agreement_input_content_check} ${styles.inactive}`}
                    >
                      ✔
                    </div>
                  ))}
                {index === 1 &&
                  (agreementTerms ? (
                    <div
                      onClick={agreementTermsCheck}
                      className={`${styles.oauth_signup_form_agreement_input_content_check} ${styles.active}`}
                    >
                      ✔
                    </div>
                  ) : (
                    <div
                      onClick={agreementTermsCheck}
                      className={`${styles.oauth_signup_form_agreement_input_content_check} ${styles.inactive}`}
                    >
                      ✔
                    </div>
                  ))}
                {index === 2 &&
                  (agreementPrivacyRequired ? (
                    <div
                      onClick={agreementPrivacyRequiredCheck}
                      className={`${styles.oauth_signup_form_agreement_input_content_check} ${styles.active}`}
                    >
                      ✔
                    </div>
                  ) : (
                    <div
                      onClick={agreementPrivacyRequiredCheck}
                      className={`${styles.oauth_signup_form_agreement_input_content_check} ${styles.inactive}`}
                    >
                      ✔
                    </div>
                  ))}
                {index === 3 &&
                  (agreementPrivacyOptional ? (
                    <div
                      onClick={agreementPrivacyOptionalCheck}
                      className={`${styles.oauth_signup_form_agreement_input_content_check} ${styles.active}`}
                    >
                      ✔
                    </div>
                  ) : (
                    <div
                      onClick={agreementPrivacyOptionalCheck}
                      className={`${styles.oauth_signup_form_agreement_input_content_check} ${styles.inactive}`}
                    >
                      ✔
                    </div>
                  ))}
                {index === 4 &&
                  (agreementAdvertisement ? (
                    <div
                      onClick={agreementAdvertisementCheck}
                      className={`${styles.oauth_signup_form_agreement_input_content_check} ${styles.active}`}
                    >
                      ✔
                    </div>
                  ) : (
                    <div
                      onClick={agreementAdvertisementCheck}
                      className={`${styles.oauth_signup_form_agreement_input_content_check} ${styles.inactive}`}
                    >
                      ✔
                    </div>
                  ))}
                <div
                  className={
                    styles.oauth_signup_form_agreement_input_content_text
                  }
                >
                  {item}
                </div>
              </div>
            ))}
          </div>

          {/* 회원가입 버튼 */}
          {isLoading ? (
            <div
              className={styles.oauth_signup_form_signup_btn_loading_content}
            >
              회원가입 처리 중...
            </div>
          ) : signupBtn ? (
            <div
              onClick={handleSignupSubmit}
              className={styles.oauth_signup_form_signup_btn_content}
            >
              회원가입 완료하기
            </div>
          ) : (
            <div className={styles.oauth_signup_form_signup_btn_none_content}>
              회원가입 완료하기
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OAuthCompleteSignupPage;
