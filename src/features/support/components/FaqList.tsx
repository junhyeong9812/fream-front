import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FAQResponseDto } from "../types/supportTypes";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai"; // 화살표 아이콘 가져오기

// 스타일 정의
const ListContainer = styled.ul`
  list-style: none;
  padding: 0;

  li {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 10px 0;
    border-bottom: 1px solid #ddd;

    &:last-child {
      border-bottom: none;
    }
    cursor: pointer;

    &:hover {
      background-color: #f9f9f9;
    }
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const Category = styled.strong`
  font-size: 14px;
  letter-spacing: -0.21px;
  min-width: 80px;
  width: 80px;
`;

const TitleBox = styled.div`
  flex: 1;
  margin-left: 10px;
`;

const Question = styled.p`
  font-size: 14px;
  letter-spacing: -0.15px;
  margin: 0;
  font-family: "D2Coding", monospace;
`;

const Arrow = styled.div`
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const DropdownContent = styled.div`
  background-color: #fafafa;
  border-bottom: 1px solid #ebebeb;
  display: none;
  font-size: 14px;
  padding: 30px 30px 28px;
  max-width: 640px;
  word-break: break-word;

  &.open {
    display: block;
  }
`;

interface FAQListProps {
  faqs: FAQResponseDto[]; // FAQ 데이터 배열
}

const FAQList: React.FC<FAQListProps> = ({ faqs }) => {
  const navigate = useNavigate();
  const [openId, setOpenId] = useState<number | null>(null);

  const handleToggle = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <ListContainer>
      {faqs.map((faq) => (
        <li key={faq.id}>
          <Header onClick={() => handleToggle(faq.id)}>
            <Category>{faq.category}</Category>
            <TitleBox>
              <Question>{faq.question}</Question>
            </TitleBox>
            <Arrow>
              {openId === faq.id ? <AiOutlineUp /> : <AiOutlineDown />}
            </Arrow>
          </Header>
          <DropdownContent
            className={openId === faq.id ? "open" : ""}
            onClick={(e) => e.stopPropagation()} // 클릭 시 토글 방지
          >
            <div className="content">
              {faq.answer.split("\n").map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </DropdownContent>
        </li>
      ))}
    </ListContainer>
  );
};

export default FAQList;
