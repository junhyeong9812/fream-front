import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { AiOutlineClose } from "react-icons/ai";

interface AddCardModalProps {
  isOpened: boolean;
  onClose: (data?: {
    cardNumber: string;
    password: string;
    expiryDate: string;
    birthDate: string;
  }) => void; // 매개변수 타입 추가
}

const Layer = styled.div`
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 1010;
`;

const LayerBackground = styled.div`
  background-color: rgba(34, 34, 34, 0.5);
  bottom: 0;
  height: 100%;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
`;

const LayerContainer = styled.div`
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.1);
  left: 50%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 448px;
  height: 560px;
`;

const AddCardHeader = styled.div`
  align-items: center;
  display: flex;
  height: 44px;
  justify-content: center;
  padding: 0 14px;
  position: relative;
`;

const TitleText = styled.div`
  color: rgba(34, 34, 34, 0.8);
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.27px;
`;

const CloseIcon = styled(AiOutlineClose)`
  cursor: pointer;
  position: absolute;
  right: 14px;
  height: 24px;
  width: 24px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 16px;
  height: 412px;
  overflow-y: scroll;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari */
  }
`;

const ContainerHeader = styled.div`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  margin: 0;
`;

const FormLabel = styled.p`
  font-size: 14px;
  letter-spacing: -0.21px;
  padding-bottom: 10px;
  padding-top: 20px;
`;

const LabelContainer = styled.div<{ hasError: boolean }>`
  display: flex;
  position: relative;
  border: 1px solid ${({ hasError }) => (hasError ? "#ef6253" : "#ebebeb")};
  border-radius: 10px;
  height: 48px;
  padding: 15px 12px;
  align-items: center;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: space-between;
  max-width: 250px;
  min-width: 180px;
`;

const InputNumber = styled.input<{ isHidden?: boolean }>`
  font-feature-settings: "tnum";
  caret-color: #222;
  display: flex;
  font-size: 14px;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.21px;
  width: 34px;
  text-align: left; /* 입력 텍스트를 왼쪽 정렬 */
  border: 0;
  outline: none;
  padding-left: 4px; /* 좌측 여백 추가 */
  color: rgba(34, 34, 34, 0.5); /* 숫자색 연하게 */
  ${({ isHidden }) =>
    isHidden &&
    "color: transparent;  text-shadow: 0 0 0 rgba(34, 34, 34, 0.5); /* 연한 숫자 효과 */"}
  ::placeholder {
    color: #bbb;
  }
`;

const Dash = styled.span`
  color: #909090;
  font-size: 14px;
  letter-spacing: -0.21px;
`;

const ClearIcon = styled(AiOutlineClose)`
  height: 20px;
  width: 20px;
  position: absolute;
  right: 12px;
  cursor: pointer;
`;

const FormFeedback = styled.p<{ isError: boolean }>`
  color: ${({ isError }) => (isError ? "#ef6253" : "rgba(34, 34, 34, 0.5)")};
  font-size: 13px;
  letter-spacing: -0.07px;
  padding-bottom: 16px;
  padding-top: 8px;
`;

const KeypadContainer = styled.div`
  position: fixed; /* 화면 고정 */
  bottom: 0; /* 화면 하단에 위치 */
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  background-color: #000;
  border-radius: 8px;

  z-index: 1020;
`;

const KeyRow = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 10px;
`;

const KeyButton = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 60px;

  color: #fff;
  font-size: 24px;
  text-decoration: none;
  cursor: pointer;
`;

const PasswordContainer = styled.div`
  position: relative;
  overflow: visible; /* 자식 요소를 잘리지 않게 설정 */
`;

const PasswordInput = styled.input<{ hasError: boolean }>`
  font-feature-settings: "tnum";
  font-size: 14px;
  font-variant-numeric: tabular-nums;
  height: 48px;
  letter-spacing: -0.21px;
  padding: 15px 12px;
  width: 100%;
  border: 1px solid ${({ hasError }) => (hasError ? "#ef6253" : "#ebebeb")};
  border-radius: 10px;
  caret-color: #222;
  
  
  ::placeholder {
    color: rgba(34, 34, 34, 0.5);
  }
  position: relative;

  &::after {
    content: "••";
  position: absolute;
  top: 50%; /* 부모 요소의 세로 중앙 */
  right: 12px; /* 오른쪽으로 여유 공간 */
  transform: translateY(-50%); /* 세로 축 중앙으로 이동 */
  font-size: 14px;
  color: rgba(34, 34, 34, 0.5);
  pointer-events: none; /* 클릭 불가 */
  box-sizing: border-box;
  z-index: 1030; /* 다른 요소 위에 렌더링 
  
  }
`;
// 버튼 컨테이너 스타일
const NextButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 20px 20px;
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: #fff;
  z-index: 1050; /* LayerContainer 위로 렌더링 */
  border-radius: 16px;
`;

// 버튼 스타일
const NextButton = styled.button<{ disabled?: boolean }>`
  background-color: ${({ disabled }) =>
    disabled ? "rgba(34, 34, 34, 0.2)" : "#222"};
  color: ${({ disabled }) => (disabled ? "rgba(255, 255, 255, 0.5)" : "#fff")};
  font-size: 16px;
  font-weight: 700;
  height: 52px;
  letter-spacing: -0.16px;
  width: 90%;
  border-radius: 10px;
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
  text-align: center;
  border: none;
  outline: none;

  &:hover {
    background-color: ${({ disabled }) =>
      disabled ? "rgba(34, 34, 34, 0.2)" : "#444"};
  }
`;

const AddCardModal: React.FC<AddCardModalProps> = ({ isOpened, onClose }) => {
  const [inputs, setInputs] = useState(["", "", "0000", "0000"]);
  const [passwordInput, setPasswordInput] = useState(""); // 비밀번호 입력 상태 추가
  const [expiryDate, setExpiryDate] = useState("MM/YY");
  const [birthDate, setBirthDate] = useState("YYYY/MM/DD");
  const [expiryDateError, setExpiryDateError] = useState(false);
  const [birthDateError, setBirthDateError] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [showExpiryDateField, setShowExpiryDateField] = useState(false);
  const [showBirthDateField, setShowBirthDateField] = useState(false);
  const [passwordError, setPasswordError] = useState(false); // 비밀번호 에러 상태
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [keypadNumbers, setKeypadNumbers] = useState<number[]>([]);
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [keypadVisible, setKeypadVisible] = useState(false); // 키패드 표시 여부

  const validateCardNumber = () => {
    const isValid = inputs.every((input) => /^\d{4}$/.test(input)); // 각 필드가 4자리 숫자인지 확인
    setHasError(!isValid);
  };
  const handleExpiryDateChange = (value: string) => {
    const sanitizedValue = value.replace(/\D/g, "").slice(0, 4); // 숫자만 허용
    let formattedValue = sanitizedValue;

    if (sanitizedValue.length >= 2) {
      formattedValue = `${sanitizedValue.slice(0, 2)}/${sanitizedValue.slice(
        2
      )}`;
    }

    setExpiryDate(formattedValue || "MM/YY");
    setExpiryDateError(false);

    if (sanitizedValue.length === 4) {
      setShowBirthDateField(true); // 생년월일 필드 표시
      inputRefs.current[6]?.focus();
    }
  };

  const validateExpiryDate = () => {
    const isValid = /^\d{2}\/\d{2}$/.test(expiryDate);
    setExpiryDateError(!isValid);
  };

  const handleBirthDateChange = (value: string) => {
    const sanitizedValue = value.replace(/\D/g, "").slice(0, 8); // 숫자만 허용
    let formattedValue = sanitizedValue;

    if (sanitizedValue.length >= 6) {
      formattedValue = `${sanitizedValue.slice(0, 4)}/${sanitizedValue.slice(
        4,
        6
      )}/${sanitizedValue.slice(6)}`;
    } else if (sanitizedValue.length >= 4) {
      formattedValue = `${sanitizedValue.slice(0, 4)}/${sanitizedValue.slice(
        4
      )}`;
    }

    setBirthDate(formattedValue || "YYYY/MM/DD");
    setBirthDateError(false);
  };

  const validateBirthDate = () => {
    const isValid = /^\d{4}\/\d{2}\/\d{2}$/.test(birthDate);
    setBirthDateError(!isValid);
  };

  const generateRandomNumbers = () => {
    const numbers = Array.from({ length: 10 }, (_, i) => i).sort(
      () => Math.random() - 0.5
    );
    setKeypadNumbers(numbers);
  };

  const validatePassword = () => {
    setPasswordError(passwordInput.length !== 2); // 포커스 해제 시 검증
  };

  const handleInputFocus = (index: number) => {
    setFocusedIndex(index);

    if (index === 2 || index === 3) {
      setKeypadVisible(true);
      generateRandomNumbers();
    } else {
      setKeypadVisible(false);
    }
  };

  const handleKeypadClick = (number: number) => {
    if (focusedIndex === null || focusedIndex < 2) return;

    const updatedInputs = [...inputs];
    if (
      updatedInputs[focusedIndex] === "0000" ||
      updatedInputs[focusedIndex] === ""
    ) {
      updatedInputs[focusedIndex] = ""; // 초기화
    }
    updatedInputs[focusedIndex] += number; // 숫자 추가
    updatedInputs[focusedIndex] = updatedInputs[focusedIndex].slice(0, 4); // 최대 길이 제한
    setInputs(updatedInputs);

    if (updatedInputs[focusedIndex].length === 4) {
      if (focusedIndex < inputs.length - 1) {
        const nextIndex = focusedIndex + 1;
        setFocusedIndex(nextIndex);
        inputRefs.current[nextIndex]?.focus();
      } else {
        setFocusedIndex(null);
        // 카드 번호 입력 완료 시 비밀번호 필드 표시
        if (updatedInputs.join("").length === 16) {
          setShowPasswordField(true);
          setKeypadVisible(false);
          inputRefs.current[4]?.focus();
        }
      }
    }
  };
  useEffect(() => {
    if (keypadVisible) {
      generateRandomNumbers(); // 키패드 표시 시 무작위 숫자 생성
    }
  }, [keypadVisible]);

  const handleClearClick = () => {
    if (focusedIndex === null) return;
    const updatedInputs = [...inputs];
    updatedInputs[focusedIndex] = updatedInputs[focusedIndex].slice(0, -1);
    setInputs(updatedInputs);
  };

  const handleShuffleClick = () => {
    generateRandomNumbers();
  };

  const handleInputChange = (index: number, value: string) => {
    const updatedInputs = [...inputs];
    updatedInputs[index] = value.slice(0, 4);
    setInputs(updatedInputs);

    if (value.length === 4) {
      if (index < inputs.length - 1) {
        inputRefs.current[index + 1]?.focus(); // 다음 필드로 이동
      } else {
        setFocusedIndex(null); // 마지막 필드면 포커스 해제
        setShowPasswordField(true);
      }
    }
  };
  useEffect(() => {
    const handleGlobalFocus = (event: FocusEvent) => {
      const activeElement = document.activeElement as HTMLElement;

      // 키패드 버튼이나 컨테이너 클릭인지 확인
      const isKeypadClick =
        activeElement &&
        (activeElement.classList.contains("keypad-button") ||
          activeElement.closest(".keypad-container"));

      // 현재 포커스된 인풋 필드의 인덱스를 확인
      const focusedInputIndex = inputRefs.current.findIndex(
        (ref) => ref === activeElement
      );

      if (focusedInputIndex === 2 || focusedInputIndex === 3 || isKeypadClick) {
        setFocusedIndex(focusedInputIndex >= 2 ? focusedInputIndex : null);
        setKeypadVisible(true);
      } else {
        setFocusedIndex(null);
        setKeypadVisible(false);
      }
    };

    window.addEventListener("focusin", handleGlobalFocus);
    window.addEventListener("focusout", handleGlobalFocus);

    return () => {
      window.removeEventListener("focusin", handleGlobalFocus);
      window.removeEventListener("focusout", handleGlobalFocus);
    };
  }, []);

  const handlePasswordChange = (value: string) => {
    const sanitizedValue = value.slice(0, 2);
    setPasswordInput(sanitizedValue);
    setPasswordError(false);

    if (sanitizedValue.length === 2) {
      setShowExpiryDateField(true); // 유효기간 필드 표시
      setPasswordError(false);
      inputRefs.current[5]?.focus();
    }
  };

  const clearInputs = () => {
    setInputs(["", "", "0000", "0000"]); // 초기값으로 되돌림
    setPasswordInput("");
    setHasError(false);
    setPasswordError(false);
  };
  const isFormValid =
    inputs.every((input) => /^\d{4}$/.test(input)) &&
    passwordInput.length === 2 &&
    /^\d{2}\/\d{2}$/.test(expiryDate) &&
    /^\d{4}\/\d{2}\/\d{2}$/.test(birthDate);

  const handleNextButtonClick = () => {
    const isFormValid =
      inputs.every((input) => /^\d{4}$/.test(input)) &&
      passwordInput.length === 2 &&
      /^\d{2}\/\d{2}$/.test(expiryDate) &&
      /^\d{4}\/\d{2}\/\d{2}$/.test(birthDate);

    if (isFormValid) {
      onClose({
        cardNumber: inputs.join("-"),
        password: passwordInput,
        expiryDate,
        birthDate,
      });
    } else {
      alert("입력값을 확인해주세요.");
    }
  };

  const handleCloseModal = () => {
    onClose(); // 아무 데이터 없이 호출
  };

  if (!isOpened) return null;

  return (
    <Layer>
      <LayerBackground onClick={handleCloseModal} />
      <LayerContainer>
        <AddCardHeader>
          <TitleText>카드 등록</TitleText>
          <CloseIcon onClick={handleCloseModal} />
        </AddCardHeader>
        <Container>
          <ContainerHeader>
            카드 정보를 입력하고 <br /> 간편하게 결제하세요.
          </ContainerHeader>

          {/* 생년월일 */}
          {showBirthDateField && (
            <FormGroup>
              <FormLabel>생년월일</FormLabel>
              <LabelContainer hasError={birthDateError}>
                <input
                  type="text"
                  value={birthDate}
                  onBlur={validateBirthDate} // 입력 후 포커스가 빠질 때 검증
                  onChange={(e) => handleBirthDateChange(e.target.value)}
                  placeholder="YYYY/MM/DD"
                  style={{ border: "none", outline: "none" }} // 기본 테두리 제거
                  ref={(el) => (inputRefs.current[6] = el!)}
                />
              </LabelContainer>
              <FormFeedback isError={birthDateError}>
                {birthDateError
                  ? "올바른 생년월일을 입력해주세요."
                  : "카드소유자 생년월일 8자리 (예: 2000/12/01)"}
              </FormFeedback>
            </FormGroup>
          )}

          {/* 유효기간 */}
          {showExpiryDateField && (
            <FormGroup>
              <FormLabel>유효기간</FormLabel>
              <LabelContainer hasError={expiryDateError}>
                <input
                  type="text"
                  value={expiryDate}
                  onBlur={validateExpiryDate} // 입력 후 포커스가 빠질 때 검증
                  onChange={(e) => handleExpiryDateChange(e.target.value)}
                  placeholder="MM/YY"
                  style={{ border: "none", outline: "none" }} // 기본 테두리 제거
                  ref={(el) => (inputRefs.current[5] = el!)}
                />
              </LabelContainer>
              <FormFeedback isError={expiryDateError}>
                {expiryDateError
                  ? "올바른 유효기간을 입력해주세요."
                  : "월/년도 순서로 4자리 숫자 (MM/YY)"}
              </FormFeedback>
            </FormGroup>
          )}

          {showPasswordField && (
            <FormGroup>
              <FormLabel>비밀번호</FormLabel>
              <PasswordContainer>
                <PasswordInput
                  hasError={passwordError}
                  placeholder="••"
                  value={"•".repeat(passwordInput.length)}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  onBlur={validatePassword} // 포커스 해제 시 검증
                  ref={(el) => (inputRefs.current[4] = el!)}
                />
                <span
                  style={{
                    position: "absolute",
                    top: "46%",
                    right: "380px",
                    transform: "translateY(-50%)",
                    fontSize: "14px",
                    color: "rgba(34, 34, 34, 0.5)",
                  }}
                >
                  ••
                </span>
              </PasswordContainer>
              <FormFeedback isError={passwordError}>
                {passwordError
                  ? "올바른 비밀번호를 입력해주세요."
                  : "비밀번호 앞 2자리"}
              </FormFeedback>
            </FormGroup>
          )}

          {/* 카드 번호 입력 필드 */}
          <FormGroup>
            <FormLabel>카드 번호</FormLabel>
            <LabelContainer hasError={hasError}>
              <InputWrapper>
                {inputs.map((input, index) => (
                  <React.Fragment key={index}>
                    <InputNumber
                      placeholder="0000"
                      maxLength={4}
                      value={
                        index >= 2 && input === "0000" // 초기값은 그대로 표시
                          ? "0000"
                          : index >= 2 // 입력값이 있으면 ••••
                          ? "•".repeat(input.length)
                          : input // 1, 2번째는 실제 값 표시
                      }
                      onFocus={() => handleInputFocus(index)}
                      onChange={(e) => {
                        if (index < 2) {
                          handleInputChange(index, e.target.value); // 1, 2번째 인덱스만 키보드 입력 허용
                        }
                      }}
                      onKeyDown={(e) => {
                        if (index >= 2) {
                          e.preventDefault(); // 키보드 입력 차단
                          alert("이 필드는 키패드로만 입력 가능합니다.");
                        }
                      }}
                      isHidden={index >= 2}
                      onBlur={validateCardNumber} // 포커스 해제 시 검증
                      ref={(el) => (inputRefs.current[index] = el!)}
                    />
                    {index < inputs.length - 1 && <Dash>-</Dash>}
                  </React.Fragment>
                ))}
              </InputWrapper>
              {inputs.some((input) => input !== "") && (
                <ClearIcon onClick={clearInputs} />
              )}
            </LabelContainer>
            <FormFeedback isError={hasError}>
              {hasError
                ? "올바른 카드번호를 입력해주세요."
                : "본인 명의의 카드만 등록 가능합니다"}
            </FormFeedback>
          </FormGroup>
        </Container>
        {keypadVisible && (
          <KeypadContainer className="keypad-container">
            {Array.from({ length: 3 }).map((_, rowIndex) => (
              <KeyRow key={rowIndex}>
                {keypadNumbers
                  .slice(rowIndex * 3, rowIndex * 3 + 3)
                  .map((num) => (
                    <KeyButton
                      key={num}
                      className="keypad-button" // 버튼 클래스 추가
                      onMouseDown={(e) => e.preventDefault()} // 기본 동작 차단
                      onClick={() => handleKeypadClick(num)}
                    >
                      {num}
                    </KeyButton>
                  ))}
              </KeyRow>
            ))}
            <KeyRow>
              <KeyButton
                className="keypad-button"
                onMouseDown={(e) => e.preventDefault()} // 기본 동작 차단
                onClick={handleShuffleClick}
              >
                재배열
              </KeyButton>
              {keypadNumbers
                .slice(9) // 남은 1개의 숫자
                .map((num) => (
                  <KeyButton
                    key={num}
                    className="keypad-button" // 버튼 클래스 추가
                    onMouseDown={(e) => e.preventDefault()} // 기본 동작 차단
                    onClick={() => handleKeypadClick(num)}
                  >
                    {num}
                  </KeyButton>
                ))}{" "}
              <KeyButton
                className="keypad-button"
                onMouseDown={(e) => e.preventDefault()} // 기본 동작 차단
                onClick={handleClearClick}
              >
                지우기
              </KeyButton>
            </KeyRow>
          </KeypadContainer>
        )}
        <NextButtonContainer>
          <NextButton
            disabled={!isFormValid} // 버튼 활성화 조건
            onClick={handleNextButtonClick} // 버튼 클릭 핸들러
          >
            다음
          </NextButton>
        </NextButtonContainer>
      </LayerContainer>
    </Layer>
  );
};

export default AddCardModal;
