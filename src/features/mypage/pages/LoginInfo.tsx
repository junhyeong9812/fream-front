import React, { useState } from "react";
import styled from "styled-components";
import ProfileGroup from "../components/ProfileGroup";
import AdConsentSection from "../components/AdConsentSection";

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
  //   const accountUnits = [
  //     {
  //       title: "이메일 주소",
  //       content: "pi*****@naver.com",
  //       onModify: () => alert("이메일 주소 변경"),
  //     },
  //     {
  //       title: "비밀번호",
  //       content: "●●●●●●●●●",
  //       onModify: () => alert("비밀번호 변경"),
  //     },
  //   ];

  //   const personalUnits = [
  //     {
  //       title: "휴대폰 번호",
  //       content: "010-2***-908",
  //       onModify: () => alert("휴대폰 번호 변경"),
  //     },
  //     {
  //       title: "신발 사이즈",
  //       content: "270",
  //       onModify: () => alert("신발 사이즈 변경"),
  //     },
  //   ];
  const [accountUnits, setAccountUnits] = useState([
    { title: "이메일 주소", content: "pi*****@naver.com" },
    { title: "비밀번호", content: "●●●●●●●●●" },
  ]);

  const [personalUnits, setPersonalUnits] = useState([
    { title: "휴대폰 번호", content: "010-2***-908" },
    { title: "신발 사이즈", content: "270" },
  ]);
  // 변경 핸들러
  const handleModify = (index: number, type: "account" | "personal") => {
    const newValue = prompt("새로운 값을 입력하세요:");
    if (!newValue) return; // 입력값이 없으면 변경하지 않음

    if (type === "account") {
      // 계정 정보 업데이트
      setAccountUnits((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, content: newValue } : item
        )
      );
    } else if (type === "personal") {
      // 개인 정보 업데이트
      setPersonalUnits((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, content: newValue } : item
        )
      );
    }
  };

  return (
    <PageContainer>
      {/* 로그인 정보 헤더 */}
      <PageHeader>
        <Title>로그인 정보</Title>
      </PageHeader>

      {/* 내 계정 섹션 */}
      {/* <ProfileGroup title="내 계정" units={accountUnits} /> */}
      <ProfileGroup
        title="내 계정"
        units={accountUnits.map((unit, index) => ({
          ...unit,
          onModify: () => handleModify(index, "account"),
        }))}
      />

      {/* 개인 정보 섹션 */}
      {/* <ProfileGroup title="개인 정보" units={personalUnits} paddingTop /> */}
      <ProfileGroup
        title="개인 정보"
        units={personalUnits.map((unit, index) => ({
          ...unit,
          onModify: () => handleModify(index, "personal"),
        }))}
      />
      {/* 광고성 정보 수신 섹션 */}
      <AdConsentSection />
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
