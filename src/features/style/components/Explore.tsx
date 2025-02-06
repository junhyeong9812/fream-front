import React, { useState } from "react";
import styled from "styled-components";
import SortButton from "./SortButton";

const Container = styled.div`
  padding-left: 40px;
  padding-right: 40px;
  margin-left: auto;
  margin-right: auto;
  max-width: 1280px;
`;

const TagShortcuts = styled.div`
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  padding: 16px 0;
`;

const SocialTagShortcuts = styled.div`
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  scrollbar-width: none;
  gap: 24px;
  justify-content: space-between;
  width: 100%;

  /* 스크롤바 숨김 */
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Shortcut = styled.div`
  display: inline-flex;
  flex-direction: column;
  gap: 4px;
  width: 66px;

  & .shortcut_image {
    border-radius: 50%;
    overflow: hidden;
    height: 80px;
    width: 80px;
    margin: 5px;
  }

  & .shortcut_title {
    color: #333;
    font-size: 13px;
    letter-spacing: -0.07px;
    line-height: 16px;
    text-align: center;
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-word;
  }
`;

const ShortcutLink = styled.a`
  text-decoration: none;
  color: inherit;

  &:hover {
    text-decoration: none;
  }
`;

const ContentContainer = styled.div`
  padding: 16px 40px; /* 콘텐츠 컨테이너 스타일 */
`;

const SortingContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const Explore: React.FC = () => {
  const shortcuts = [
    {
      title: "스캇&닌텐도 받기",
      imageSrc: "https://example.com/image1.webp",
    },
    {
      title: "패딩스타일",
      imageSrc: "https://example.com/image2.webp",
    },
    {
      title: "급상승 스타일",
      imageSrc: "https://example.com/image3.webp",
    },
    {
      title: "겨울코디",
      imageSrc: "https://example.com/image4.webp",
    },
    {
      title: "12월 트렌드",
      imageSrc: "https://example.com/image5.webp",
    },
    {
      title: "크리스마스룩",
      imageSrc: "https://example.com/image6.webp",
    },
    {
      title: "패딩추천",
      imageSrc: "https://example.com/image7.webp",
    },
    {
      title: "코트코디",
      imageSrc: "https://example.com/image8.webp",
    },
  ];
  const sortOptions = ["추천순", "인기순", "최신순"];
  const [activeSort, setActiveSort] = useState<string>("추천순");

  const handleSortChange = (option: string) => {
    setActiveSort(option);
    console.log(`정렬 기준이 "${option}"으로 변경되었습니다.`);
    // 추가 로직: 정렬 기준에 따라 데이터 재정렬
  };

  return (
    <Container>
      <TagShortcuts>
        <SocialTagShortcuts>
          {shortcuts.map((shortcut, index) => (
            <ShortcutLink key={index} href="#">
              <Shortcut>
                <picture className="shortcut_image">
                  <source srcSet={shortcut.imageSrc} type="image/webp" />
                  <img
                    src={shortcut.imageSrc}
                    alt={shortcut.title}
                    loading="lazy"
                  />
                </picture>
                <div className="shortcut_title">{shortcut.title}</div>
              </Shortcut>
            </ShortcutLink>
          ))}
        </SocialTagShortcuts>
      </TagShortcuts>
      <SortingContainer>
        <SortButton
          options={sortOptions}
          activeOption={activeSort}
          onSelect={handleSortChange}
        />
      </SortingContainer>

      <ContentContainer>
        <p>여기에 트렌드 탭의 콘텐츠를 추가하세요.</p>
      </ContentContainer>
    </Container>
  );
};

export default Explore;
