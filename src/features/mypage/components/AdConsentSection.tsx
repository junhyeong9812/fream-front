import React, { useState } from "react";
import styled from "styled-components";

const SectionContainer = styled.div`
  margin-top: 58px;
`;

const SectionTitle = styled.h4`
  font-size: 18px;
  letter-spacing: -0.27px;
  margin: 0;
`;

const Unit = styled.div`
  border-bottom: 1px solid #ebebeb;
  display: flex;
  flex-direction: column;
  padding: 25px 0 12px;
  position: relative;
  max-width: 480px;
`;

const UnitContent = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const ContentDescription = styled.p`
  flex: 1;
  font-size: 16px;
  letter-spacing: -0.16px;
  overflow: hidden;
  padding: 8px 0;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-direction: column; /* 세로 방향 정렬 */
`;

const ViewButton = styled.button`
  color: #909090;
  font-size: 12px;
  font-weight: 400;
  text-decoration: underline;
  background: none;
  border: none;
  cursor: pointer;
`;

const SwitchContainer = styled.div`
  position: relative;
  width: 51px;
  height: 31px;
  background-color: #e4e4e4;
  border-radius: 15.5px;
  cursor: pointer;
  transition: background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &.is-active {
    background-color: #222222;
  }
`;

const SwitchCircle = styled.div`
  position: absolute;
  top: 50%;
  left: 2px;
  width: 27px;
  height: 27px;
  background-color: #fff;
  border-radius: 50%;
  transform: translateY(-50%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  ${SwitchContainer}.is-active & {
    transform: translate(22px, -50%);
  }
`;

const FooterDescription = styled.p`
  color: #909090;
  font-size: 13px;
  margin-top: 16px;
`;

const AdConsentSection: React.FC = () => {
  const [collectionConsent, setCollectionConsent] = useState(false);
  const [smsConsent, setSmsConsent] = useState(false);
  const [emailConsent, setEmailConsent] = useState(false);

  const toggleCollectionConsent = () =>
    setCollectionConsent(!collectionConsent);
  const toggleSmsConsent = () => setSmsConsent(!smsConsent);
  const toggleEmailConsent = () => setEmailConsent(!emailConsent);

  return (
    <SectionContainer>
      {/* 섹션 제목 */}
      <SectionTitle>광고성 정보 수신</SectionTitle>

      {/* 개인정보 수집 및 이용 동의 */}
      <Unit>
        <UnitContent>
          <ContentDescription>
            <div>개인정보 수집 및 이용 동의</div>
            <ViewButton
              onClick={() => alert("개인정보 수집 및 이용 동의 내용 보기")}
            >
              내용보기
            </ViewButton>
          </ContentDescription>

          <SwitchContainer
            className={collectionConsent ? "is-active" : ""}
            onClick={toggleCollectionConsent}
          >
            <SwitchCircle />
          </SwitchContainer>
        </UnitContent>
      </Unit>

      {/* 문자메세지 수신 동의 */}
      <Unit>
        <UnitContent>
          <ContentDescription>문자메세지</ContentDescription>
          <SwitchContainer
            className={smsConsent ? "is-active" : ""}
            onClick={toggleSmsConsent}
          >
            <SwitchCircle />
          </SwitchContainer>
        </UnitContent>
      </Unit>

      {/* 이메일 수신 동의 */}
      <Unit>
        <UnitContent>
          <ContentDescription>이메일</ContentDescription>
          <SwitchContainer
            className={emailConsent ? "is-active" : ""}
            onClick={toggleEmailConsent}
          >
            <SwitchCircle />
          </SwitchContainer>
        </UnitContent>
      </Unit>

      {/* 푸시 알림 설명 */}
      <FooterDescription>
        앱 푸시 알림은 KREAM 앱 로그인 &gt; MY &gt; 설정 &gt; 알림에서 설정
        가능합니다.
      </FooterDescription>
    </SectionContainer>
  );
};

export default AdConsentSection;
