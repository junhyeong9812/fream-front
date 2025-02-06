import React, { useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

interface FilterModalProps {
  open: boolean; // 모달 오픈 여부
  onClose: () => void; // 닫기 함수
}

const FilterModal: React.FC<FilterModalProps> = ({ open, onClose }) => {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [genderOpen, setGenderOpen] = useState(false);
  const [colorOpen, setColorOpen] = useState(false);
  const [discountOpen, setDiscountOpen] = useState(false);
  const [brandOpen, setBrandOpen] = useState(false);
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [sizeOpen, setSizeOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);
  if (!open) return null; // open이 false면 null 리턴

  //브랜드 목록 테스트용
  const items = [
    "& Other Stories",
    "0104",
    "032c",
    "&",
    "Apple",
    "Banana",
    "123",
    "Zebra",
    "!start",
    "2001",
    "coca cola",
    "coca cola",
    "coca cola",
    "coca cola",
    "coca cola",
    "coca cola",
  ];
  // 항목들을 그룹화하는 함수 (각 첫 글자별로 묶기)
  const groupItems = (items: string[]) => {
    const sortedItems = [...items].sort(); // 전체 정렬

    const grouped: { [key: string]: string[] } = {};

    sortedItems.forEach((item) => {
      const firstChar = item[0].toUpperCase(); // 첫 글자 추출
      if (!grouped[firstChar]) {
        grouped[firstChar] = [];
      }
      grouped[firstChar].push(item);
    });

    return grouped;
  };

  // 그룹화된 항목 가져오기
  const groupedItems = groupItems(items);
  const groupKeys = Object.keys(groupedItems); // 그룹 키 목록

  return (
    <ModalOverlay onClick={onClose}>
      <ModalWrapper onClick={(e) => e.stopPropagation()}>
        <ModalContainer>
          <ModalBackground onClick={onClose} />
          {/* 배경 클릭으로 닫기 */}
          {/* 실제 컨텐츠 */}
          <ModalInner>
            {/* 닫기 버튼 */}
            <CloseButton onClick={onClose}>x</CloseButton>
            <ModalHeader>
              <h2 className="title">필터</h2>
            </ModalHeader>

            <ModalContent>
              {/* 카테고리 필터 */}
              <div className="filter-section">
                <div className="section-header">
                  <div>
                    <h3>카테고리</h3>
                    {!categoryOpen ? (
                      <p className="title">모든 카테고리</p>
                    ) : null}
                  </div>
                  <FontAwesomeIcon
                    icon={categoryOpen ? faMinus : faPlus}
                    onClick={() => setCategoryOpen(!categoryOpen)}
                    style={{ cursor: "pointer" }}
                  />
                </div>

                {categoryOpen && (
                  <div className="filter-options">
                    <div className="subhead">
                      <p className="subheading">신발</p>
                      <button className="btn_multiple">모두 선택</button>
                    </div>
                    <div className="section-content">
                      <label className="bubble">
                        <input type="checkbox" />
                        <div>
                          <button className="filter_button">스니커즈</button>
                        </div>
                      </label>
                      <label className="bubble">
                        <input type="checkbox" />
                        <div>
                          <button className="filter_button">샌들/슬리퍼</button>
                        </div>
                      </label>
                    </div>
                    <div className="subhead">
                      <p className="subheading">아우터</p>
                      <button className="btn_multiple">모두 선택</button>
                    </div>
                    <div className="section-content">
                      <label className="bubble">
                        <input type="checkbox" />
                        <div>
                          <button className="filter_button">블루종</button>
                        </div>
                      </label>
                      <label className="bubble">
                        <input type="checkbox" />
                        <div>
                          <button className="filter_button">후드 자켓</button>
                        </div>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* 성별 필터 */}
              <div className="filter-section">
                <div className="section-header">
                  <div>
                    <h3>성별</h3>
                    {!genderOpen ? <p className="title">모든 성별</p> : null}
                  </div>
                  <FontAwesomeIcon
                    icon={genderOpen ? faMinus : faPlus}
                    onClick={() => setGenderOpen(!genderOpen)}
                    style={{ cursor: "pointer" }}
                  />
                </div>

                {genderOpen && (
                  <div className="filter-options">
                    <p className="subheading">성별</p>
                    <div className="section-content">
                      <label className="bubble">
                        <input type="radio" name="gender" />
                        <div>
                          <button className="filter_button">남성</button>
                        </div>
                      </label>
                      <label className="bubble">
                        <input type="radio" name="gender" />
                        <div>
                          <button className="filter_button">여성</button>
                        </div>
                      </label>
                      <label className="bubble">
                        <input type="radio" name="gender" />
                        <div>
                          <button className="filter_button">키즈</button>
                        </div>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* 색상 필터 */}
              <div className="filter-section">
                <div className="section-header">
                  <div>
                    <h3>색상</h3>
                    {!colorOpen ? <p className="title">모든 색상</p> : null}
                  </div>
                  <FontAwesomeIcon
                    icon={colorOpen ? faMinus : faPlus}
                    onClick={() => setColorOpen(!colorOpen)}
                    style={{ cursor: "pointer" }}
                  />
                </div>
                {/* 색 다시 넣고, 50% 적용해야 함 */}
                {colorOpen && (
                  <div className="filter-options">
                    <div className="section-content color">
                      <div className="filter-shortcut">
                        <div
                          className="contents"
                          style={{ backgroundColor: "rgb(0, 0, 0)" }}
                        ></div>
                        <div className="title-color">
                          <p>블랙</p>
                        </div>
                      </div>
                      <div className="filter-shortcut">
                        <div
                          className="contents"
                          style={{ backgroundColor: "rgb(204, 204, 204)" }}
                        ></div>
                        <div className="title-color">
                          <p>그레이</p>
                        </div>
                      </div>
                      <div className="filter-shortcut">
                        <div
                          className="contents"
                          style={{ backgroundColor: "rgb(255, 255, 255)" }}
                        ></div>
                        <div className="title-color">
                          <p>화이트</p>
                        </div>
                      </div>
                      <div className="filter-shortcut">
                        <div
                          className="contents"
                          style={{ backgroundColor: "rgb(244, 238, 221)" }}
                        ></div>
                        <div className="title-color">
                          <p>아이보리</p>
                        </div>
                      </div>
                      <div className="filter-shortcut">
                        <div
                          className="contents"
                          style={{ backgroundColor: "rgb(230, 194, 129)" }}
                        ></div>
                        <div className="title-color">
                          <p>베이지</p>
                        </div>
                      </div>
                      <div className="filter-shortcut">
                        <div
                          className="contents"
                          style={{ backgroundColor: "rgb(102, 50, 3)" }}
                        ></div>
                        <div className="title-color">
                          <p>브라운</p>
                        </div>
                      </div>
                      <div className="filter-shortcut">
                        <div
                          className="contents"
                          style={{ backgroundColor: "rgb(143, 120, 75)" }}
                        ></div>
                        <div className="title-color">
                          <p>카키</p>
                        </div>
                      </div>
                      <div className="filter-shortcut">
                        <div
                          className="contents"
                          style={{ backgroundColor: "rgb(0, 128, 0)" }}
                        ></div>
                        <div className="title-color">
                          <p>그린</p>
                        </div>
                      </div>
                      <div className="filter-shortcut">
                        <div
                          className="contents"
                          style={{ backgroundColor: "rgb(144, 238, 144)" }}
                        ></div>
                        <div className="title-color">
                          <p>라이트그린</p>
                        </div>
                      </div>
                      <div className="filter-shortcut">
                        <div
                          className="contents"
                          style={{ backgroundColor: "rgb(114, 213, 192)" }}
                        ></div>
                        <div className="title-color">
                          <p>민트</p>
                        </div>
                      </div>
                      <div className="filter-shortcut">
                        <div
                          className="contents"
                          style={{ backgroundColor: "rgb(0, 0, 128)" }}
                        ></div>
                        <div className="title-color">
                          <p>네이비</p>
                        </div>
                      </div>
                      <div className="filter-shortcut">
                        <div
                          className="contents"
                          style={{ backgroundColor: "rgb(43, 50, 243)" }}
                        ></div>
                        <div className="title-color">
                          <p>블루</p>
                        </div>
                      </div>
                      <div className="filter-shortcut">
                        <div
                          className="contents"
                          style={{ backgroundColor: "rgb(135, 206, 235)" }}
                        ></div>
                        <div className="title-color">
                          <p>스카이블루</p>
                        </div>
                      </div>
                      <div className="filter-shortcut">
                        <div
                          className="contents"
                          style={{ backgroundColor: "rgb(128, 0, 128)" }}
                        ></div>
                        <div className="title-color">
                          <p>퍼플</p>
                        </div>
                      </div>
                      <div className="filter-shortcut">
                        <div
                          className="contents"
                          style={{ backgroundColor: "rgb(255, 192, 203)" }}
                        ></div>
                        <div className="title-color">
                          <p>핑크</p>
                        </div>
                      </div>
                      <div className="filter-shortcut">
                        <div
                          className="contents"
                          style={{ backgroundColor: "rgb(255, 0, 0)" }}
                        ></div>
                        <div className="title-color">
                          <p>레드</p>
                        </div>
                      </div>
                      <div className="filter-shortcut">
                        <div
                          className="contents"
                          style={{ backgroundColor: "rgb(255, 165, 0)" }}
                        ></div>
                        <div className="title-color">
                          <p>오렌지</p>
                        </div>
                      </div>
                      <div className="filter-shortcut">
                        <div
                          className="contents"
                          style={{ backgroundColor: "rgb(255, 255, 0)" }}
                        ></div>
                        <div className="title-color">
                          <p>옐로우</p>
                        </div>
                      </div>
                      <div className="filter-shortcut">
                        <img
                          src="/shopcolorimg/silver.png"
                          alt="믹스"
                          className="image-style"
                        />{" "}
                        <div className="title-color">
                          <p>실버</p>
                        </div>
                      </div>
                      <div className="filter-shortcut">
                        <img
                          src="/shopcolorimg/gold.png"
                          alt="믹스"
                          className="image-style"
                        />{" "}
                        <div className="title-color">
                          <p>골드</p>
                        </div>
                      </div>
                      <div className="filter-shortcut">
                        <img
                          src="/shopcolorimg/mixColor.png"
                          alt="믹스"
                          className="image-style"
                        />
                        <div className="title-color">
                          <p>믹스</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 혜택/할인 필터 */}
              <div className="filter-section">
                <div className="section-header">
                  <div>
                    <h3>혜택/할인</h3>
                    {!discountOpen ? (
                      <p className="title">모든 혜택/할인</p>
                    ) : null}
                  </div>
                  <FontAwesomeIcon
                    icon={discountOpen ? faMinus : faPlus}
                    onClick={() => setDiscountOpen(!discountOpen)}
                    style={{ cursor: "pointer" }}
                  />
                </div>

                {discountOpen && (
                  <div className="filter-options">
                    <div className="subhead">
                      <p className="subheading">혜택</p>
                      <button className="btn_multiple">모두 선택</button>
                    </div>
                    <div className="section-content">
                      <label className="bubble">
                        <input type="checkbox" />
                        <div>
                          <button className="filter_button">무료배송</button>
                        </div>
                      </label>
                      <label className="bubble">
                        <input type="checkbox" />
                        <div>
                          <button className="filter_button">할인</button>
                        </div>
                      </label>
                      <label className="bubble">
                        <input type="checkbox" />
                        <div>
                          <button className="filter_button">정가이하</button>
                        </div>
                      </label>
                    </div>
                    <div className="subhead">
                      <p className="subheading">할인율</p>
                      <button className="btn_multiple">모두 선택</button>
                    </div>
                    <div className="section-content">
                      <label className="bubble">
                        <input type="checkbox" />
                        <div>
                          <button className="filter_button">30% 이하</button>
                        </div>
                      </label>
                      <label className="bubble">
                        <input type="checkbox" />
                        <div>
                          <button className="filter_button">30%~50%</button>
                        </div>
                      </label>
                      <label className="bubble">
                        <input type="checkbox" />
                        <div>
                          <button className="filter_button">50% 이상</button>
                        </div>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* 브랜드 */}
              <div className="filter-section">
                <div className="section-header">
                  <div>
                    <h3>브랜드</h3>
                    {!brandOpen ? <p className="title">모든 브랜드</p> : null}
                  </div>
                  <FontAwesomeIcon
                    icon={brandOpen ? faMinus : faPlus}
                    onClick={() => setBrandOpen(!brandOpen)}
                    style={{ cursor: "pointer" }}
                  />
                </div>

                {brandOpen && (
                  <div
                    className="filter-options"
                    style={{ overflowY: "auto", maxHeight: "400px" }}
                  >
                    {groupKeys.map((key, index) => (
                      <div key={index}>
                        {/* 그룹 제목 */}
                        <div
                          className="group-title"
                          style={{
                            marginBottom: "9px",
                            fontSize: "16px",
                            fontWeight: "bold",
                          }}
                        >
                          {key}
                        </div>

                        {/* 그룹 항목 출력 */}
                        {groupedItems[key].map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className="item"
                            style={{ marginBottom: "9px", fontSize: "14px" }}
                          >
                            {item}
                          </div>
                        ))}

                        {/* 그룹이 변경될 때마다 구분선 추가 */}
                        <hr
                          style={{
                            margin: "9px 0",
                            border: "none",
                            borderTop: "1px solid rgba(0, 0, 0, .06)",
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 컬렉션 */}
              <div className="filter-section">
                <div className="section-header">
                  <div>
                    <h3>컬렉션</h3>
                    {!collectionOpen ? (
                      <p className="title">모든 컬렉션</p>
                    ) : null}
                  </div>
                  <FontAwesomeIcon
                    icon={collectionOpen ? faMinus : faPlus}
                    onClick={() => setCollectionOpen(!collectionOpen)}
                    style={{ cursor: "pointer" }}
                  />
                </div>

                {collectionOpen && <div className="filter-options"></div>}
              </div>

              {/* 사이즈 */}
              <div className="filter-section">
                <div className="section-header">
                  <div>
                    <h3>사이즈</h3>
                    {!sizeOpen ? <p className="title">모든 사이즈</p> : null}
                  </div>
                  <FontAwesomeIcon
                    icon={sizeOpen ? faMinus : faPlus}
                    onClick={() => setSizeOpen(!sizeOpen)}
                    style={{ cursor: "pointer" }}
                  />
                </div>

                {sizeOpen && (
                  <div className="filter-options">
                    <p>신발</p>
                    <div className="section-content">
                      <label className="bubble">
                        <input type="checkbox" />
                        <div>
                          <button className="filter_button">70</button>
                        </div>
                      </label>
                      <label className="bubble">
                        <input type="checkbox" />
                        <div>
                          <button className="filter_button">80</button>
                        </div>
                      </label>
                      <label className="bubble">
                        <input type="checkbox" />
                        <div>
                          <button className="filter_button">90</button>
                        </div>
                      </label>
                      <label className="bubble">
                        <input type="checkbox" />
                        <div>
                          <button className="filter_button">110</button>
                        </div>
                      </label>
                    </div>
                    <p>의류</p>
                    <div className="section-content">
                      <label className="bubble">
                        <input type="checkbox" />
                        <div>
                          <button className="filter_button">XXS</button>
                        </div>
                      </label>
                      <label className="bubble">
                        <input type="checkbox" />
                        <div>
                          <button className="filter_button">XS</button>
                        </div>
                      </label>
                      <label className="bubble">
                        <input type="checkbox" />
                        <div>
                          <button className="filter_button">S</button>
                        </div>
                      </label>
                      <label className="bubble">
                        <input type="checkbox" />
                        <div>
                          <button className="filter_button">M</button>
                        </div>
                      </label>
                      <label className="bubble">
                        <input type="checkbox" />
                        <div>
                          <button className="filter_button">L</button>
                        </div>
                      </label>
                      <label className="bubble">
                        <input type="checkbox" />
                        <div>
                          <button className="filter_button">XL</button>
                        </div>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* 가격대 */}
              <div className="filter-section">
                <div className="section-header">
                  <div>
                    <h3>가격대</h3>
                    {!priceOpen ? <p className="title">모든 가격대</p> : null}
                  </div>
                  <FontAwesomeIcon
                    icon={priceOpen ? faMinus : faPlus}
                    onClick={() => setPriceOpen(!priceOpen)}
                    style={{ cursor: "pointer" }}
                  />
                </div>

                {priceOpen && (
                  <div className="filter-options">
                    <p>가격대</p>
                    <div className="section-content">
                      <label className="bubble">
                        <input type="checkbox" />
                        <div>
                          <button className="filter_button">10만원 이하</button>
                        </div>
                      </label>
                      <label className="bubble">
                        <input type="checkbox" />
                        <div>
                          <button className="filter_button">10만원대</button>
                        </div>
                      </label>
                      <label className="bubble">
                        <input type="checkbox" />
                        <div>
                          <button className="filter_button">20만원대</button>
                        </div>
                      </label>
                      <label className="bubble">
                        <input type="checkbox" />
                        <div>
                          <button className="filter_button">30만원대</button>
                        </div>
                      </label>
                      <label className="bubble">
                        <input type="checkbox" />
                        <div>
                          <button className="filter_button">30~50만원</button>
                        </div>
                      </label>
                      <label className="bubble">
                        <input type="checkbox" />
                        <div>
                          <button className="filter_button">50~100만원</button>
                        </div>
                      </label>
                      <label className="bubble">
                        <input type="checkbox" />
                        <div>
                          <button className="filter_button">100~500만원</button>
                        </div>
                      </label>
                      <label className="bubble">
                        <input type="checkbox" />
                        <div>
                          <button className="filter_button">
                            500만원 이상
                          </button>
                        </div>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </ModalContent>

            <ModalFooter>
              <button className="btn_reset">초기화</button>
              <button className="btn_submit">369,088개 상품보기</button>
            </ModalFooter>
          </ModalInner>
        </ModalContainer>
      </ModalWrapper>
    </ModalOverlay>
  );
};

export default FilterModal;

/* ===========================
     styled-components
   =========================== */
const ModalOverlay = styled.div`
  /* 전체 화면 덮는 오버레이 */
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000; /* 페이지 위를 덮는 가장 큰 z-index */
`;

const ModalWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const ModalContainer = styled.div`
  /* 레이어 자체 위치 */
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;

  width: 420px; /* PC 기준 예시 */
  background: transparent;
  display: flex;
  flex-direction: column;
  z-index: 2010; /* 배경(2000)보다 위 */
`;

const ModalBackground = styled.div`
  /* 회색 반투명 배경 */
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2000;
`;

const ModalInner = styled.div`
  /* 실제 컨텐츠 부분 */
  position: relative;
  background: #fff;
  width: 100%;
  height: 100%;
  z-index: 2010;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 14px;
  right: 20px;
  cursor: pointer;
  background: none;
  border: none;
  font-size: 20px;
`;

const ModalHeader = styled.div`
  text-align: center;
  padding: 18px 50px;
  border-bottom: 1px solid #eee;

  h2.title {
    font-size: 18px;
    font-weight: 700;
    color: #000;
    line-height: 22px;
  }
`;

const ModalContent = styled.div`
  flex: 1;
  overflow-y: auto;

  .filter-section {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 24px 16px;
    position: relative;
    justify-content: space-between;
    border-bottom: 1px solid #f0f0f0;

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;

      .filter-options {
        display: flex;
        flex-direction: row; /* 가로로 배치 */
        justify-content: space-between; /* 두 요소 간의 공간을 균등 배분 */
        align-items: center; /* 세로 중앙 정렬 */
        margin-top: 10px;
        padding-left: 10px;
      }

      h3 {
        font-size: 17px;
        font-weight: 600;
      }
      .title {
        color: #909090;
        display: inline-block;
        font-size: 14px;
        margint-top: 4px;
        text-overfiw: elliosis;
      }
    }
    .scrollable-list {
      max-height: 200px; /* 목록의 최대 높이 */
      overflow-y: auto; /* 스크롤이 가능하도록 설정 */
      margin-top: 10px;
    }
    input[type="checkbox"] {
      display: none; /* 체크박스 숨기기 */
    }
    .item {
      margin-bottom: 9px;
      font-size: 14px;
    }

    .btn_multiple {
      border: none;
      background: none;
      cursor: pointer;
      font-size: 14px;
      color: #888;
    }

    .subhead {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .subheading {
      font-size: 14px;
      font-weight: 600;
      padding-top: 8px;
      padding-bottom: 10px;
    }

    .color {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
    }

    .contents {
      padding: 16px;
      border-radius: 50%;
      border: 1px solid rgba(0, 0, 0, 0.04);
      width: 40px;
      height: 40px;
    }

    .filter-shortcut {
      align-items: center;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      gap: 5px;
      white-space: nowrap;
    }

    .title-color {
      display: flex;
      justify-content: center;
    }
    .title-color p {
      color: rgb(34, 34, 34, 0.8);
      font-size: 12px;
    }
    .image-style {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 1px solid rgba(0, 0, 0, 0.04);
    }

    .section-content {
      flex-wrap: wrap;
      gap: 6px;

      label.bubble {
        display: inline-flex;
        align-items: center;

        input {
          display: none;
        }
        div {
          button.filter_button {
            background-color: #f4f4f4;
            border-radius: 30px;
            color: #4e4e4e;
            cursor: pointer;
            font-size: 13px;
            border: 1px solid #f0f0f0;
            padding: 0 8px;
            height: 30px;
            margin-left: 5px;
          }
        }
      }
    }
  }
`;

const ModalFooter = styled.div`
  border-top: 1px solid #eee;
  padding: 16px;
  display: flex;
  gap: 8px;

  .btn_reset {
    flex: 0 0 auto;
    background-color: #f4f4f4;
    color: #222;
    border: none;
    border-radius: 18px;
    width: 80px;
    height: 40px;
    cursor: pointer;
  }
  .btn_submit {
    flex: 1;
    border-radius: 18px;
    background-color: #000;
    color: #fff;
    border: none;
    height: 40px;
    cursor: pointer;
  }
`;
