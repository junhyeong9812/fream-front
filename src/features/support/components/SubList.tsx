import React from "react";
import styled from "styled-components";

const TitleContainer = styled.h2`
  color: #000;
  font-size: 32px;
  letter-spacing: -0.48px;
  padding-bottom: 25px;
  text-transform: uppercase;
`;

interface SubTitleProps {
  title: string;
}

const SubTitle: React.FC<SubTitleProps> = ({ title }) => {
  return <TitleContainer>{title}</TitleContainer>;
};

export default SubTitle;
