import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ProfileGroup from "../components/ProfileGroup";
import AdConsentSection from "../components/AdConsentSection";
import {
  getLoginInfo,
  LoginInfoResponse,
  LoginInfoUpdateDto,
  updateLoginInfo,
} from "../services/loginInfoService";

const PageContainer = styled.div`
  padding: 0 20px;
`;

const PageHeader = styled.div`
  display: flex;
  border-bottom: 3px solid #222;
  padding-bottom: 16px;
  margin-bottom: 40px;
`;

const Title = styled.h3`
  font-size: 24px;
  line-height: 29px;
  letter-spacing: -0.36px;
  margin: 0;
`;

const WithdrawalLink = styled.a`
  color: rgba(34, 34, 34, 0.5);
  display: inline-block;
  font-size: 13px;
  letter-spacing: -0.07px;
  margin-top: 55px;
  padding: 5px 0;
  text-decoration: underline;

  &:hover {
    text-decoration: underline;
  }
`;

const LoginInfo: React.FC = () => {
  const [loginInfo, setLoginInfo] = useState<LoginInfoResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // 컴포넌트 마운트시 로그인 정보 조회
  useEffect(() => {
    fetchLoginInfo();
  }, []);
  useEffect(() => {
    const fetchLoginInfo = async () => {
      try {
        const data = await getLoginInfo();
        setLoginInfo(data);
      } catch (error) {
        console.error("로그인 정보 조회 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoginInfo();
  }, []);

  const fetchLoginInfo = async () => {
    try {
      const data = await getLoginInfo();
      setLoginInfo(data);
    } catch (error) {
      console.error("로그인 정보 조회 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 정보 수정 핸들러
  const handleModify = async (index: number, type: "account" | "personal") => {
    if (!loginInfo) return;

    try {
      let updateData: LoginInfoUpdateDto = {};

      if (type === "account") {
        if (index === 0) {
          // 이메일 변경
          const newEmail = prompt("새로운 이메일을 입력하세요:");
          if (!newEmail) return;
          const password = prompt("현재 비밀번호를 입력하세요:");
          if (!password) return;

          updateData = { newEmail, password };
        } else if (index === 1) {
          // 비밀번호 변경
          const currentPassword = prompt("현재 비밀번호를 입력하세요:");
          if (!currentPassword) return;
          const newPassword = prompt("새로운 비밀번호를 입력하세요:");
          if (!newPassword) return;

          updateData = { password: currentPassword, newPassword };
        }
      } else if (type === "personal") {
        if (index === 0) {
          // 전화번호 변경
          const newPhoneNumber = prompt("새로운 전화번호를 입력하세요:");
          if (!newPhoneNumber) return;

          updateData = { newPhoneNumber };
        } else if (index === 1) {
          // 신발 사이즈 변경
          const newShoeSize = prompt("새로운 신발 사이즈를 입력하세요:");
          if (!newShoeSize) return;

          updateData = { newShoeSize };
        }
      }

      const updatedInfo = await updateLoginInfo(updateData);
      setLoginInfo(updatedInfo); // 이미 매핑된 LoginInfoResponse 타입
    } catch (error) {
      console.error("정보 수정 실패:", error);
      alert("정보 수정에 실패했습니다.");
    }
  };

  // 광고 동의 상태 변경 핸들러
  const handleConsentChange = async (type: "privacy" | "sms" | "email") => {
    if (!loginInfo) return;

    try {
      const updateData: LoginInfoUpdateDto = {
        privacyConsent:
          type === "privacy" ? !loginInfo.optionalPrivacyAgreement : undefined,
        smsConsent: type === "sms" ? !loginInfo.smsConsent : undefined,
        emailConsent: type === "email" ? !loginInfo.emailConsent : undefined,
      };

      const updatedInfo = await updateLoginInfo(updateData);
      setLoginInfo(updatedInfo); // 이미 매핑된 LoginInfoResponse 타입
    } catch (error) {
      console.error("동의 상태 변경 실패:", error);
      alert("동의 상태 변경에 실패했습니다.");
    }
  };

  if (isLoading) {
    return <div>로딩중...</div>;
  }

  const accountUnits = [
    {
      title: "이메일 주소",
      content: loginInfo?.email || "",
      onModify: () => handleModify(0, "account"),
    },
    {
      title: "비밀번호",
      content: "●●●●●●●●●",
      onModify: () => handleModify(1, "account"),
    },
  ];

  const personalUnits = [
    {
      title: "휴대폰 번호",
      content: loginInfo?.phoneNumber || "",
      onModify: () => handleModify(0, "personal"),
    },
    {
      title: "신발 사이즈",
      content: loginInfo?.shoeSize || "",
      onModify: () => handleModify(1, "personal"),
    },
  ];

  return (
    <PageContainer>
      {/* 로그인 정보 헤더 */}
      <PageHeader>
        <Title>로그인 정보</Title>
      </PageHeader>

      {/* 내 계정 섹션 */}
      {/* <ProfileGroup title="내 계정" units={accountUnits} /> */}
      <ProfileGroup title="내 계정" units={accountUnits} />

      {/* 개인 정보 섹션 */}
      {/* <ProfileGroup title="개인 정보" units={personalUnits} paddingTop /> */}
      <ProfileGroup title="개인 정보" units={personalUnits} paddingTop />

      {/* 광고성 정보 수신 섹션 */}
      <AdConsentSection
        optionalPrivacyAgreement={loginInfo?.optionalPrivacyAgreement || false}
        smsConsent={loginInfo?.smsConsent || false}
        emailConsent={loginInfo?.emailConsent || false}
        onConsentChange={handleConsentChange}
      />
      {/* 회원탈퇴 링크 */}
      <WithdrawalLink
        href="/withdrawal"
        onClick={() => alert("회원탈퇴 페이지로 이동")}
      >
        회원탈퇴
      </WithdrawalLink>
    </PageContainer>
  );
};

export default LoginInfo;
