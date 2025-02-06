import React, { forwardRef } from "react";
import styled from "styled-components";

interface PopularityModalProps {
  open: boolean;
  onClose: () => void;
  onSelectItem?: (item: string) => void; // ★ 선택된 값을 부모에 전달할 콜백
}

const popularityList = [
  "인기순",
  "남성 인기순",
  "여성 인기순",
  "할인물순",
  "프리미엄 높은순",
  "프리미엄 낮은순",
  "낮은 구매가순",
  "높은 구매가순",
  "높은 판매가순",
  "관심 많은순",
  "스타일 많은순",
  "발매일순",
];

// 1) forwardRef 사용: 부모에서 내려주는 ref를 모달 최상위 DOM에 연결하기 위함
const PopularityModal = forwardRef<HTMLDivElement, PopularityModalProps>(
  ({ open, onClose, onSelectItem }, ref) => {
    if (!open) return null;

    // 모달 바깥(오버레이) 클릭 시 닫기
    const handleOverlayClick = () => {
      onClose();
    };

    // 모달 내부 클릭 이벤트 버블링 방지
    const handleModalClick = (e: React.MouseEvent) => {
      e.stopPropagation();
    };

    // 아이템을 클릭했을 때 부모에게 선택값 전달 (onSelectItem) + 모달 닫기
    const handleItemClick = (item: string) => {
      // 필요한 경우 onSelectItem이 있으면 호출
      onSelectItem?.(item);
      // 모달 닫기
      onClose();
    };

    return (
      <ModalOverlay onClick={handleOverlayClick}>
        {/* 2) 부모가 전달해 준 ref를 ModalContainer에 연결 */}
        <ModalContainer ref={ref} onClick={handleModalClick}>
          <div className="popularity">
            {popularityList.map((item, index) => (
              <div
                key={index}
                className="popularity-item"
                onClick={() => handleItemClick(item)} // ← 클릭 시 아이템 선택
              >
                {item}
              </div>
            ))}
          </div>
        </ModalContainer>
      </ModalOverlay>
    );
  }
);

const ModalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0); /* 투명 배경 */
  z-index: 999; /* 모달 위로 */
`;

const ModalContainer = styled.div`
  position: absolute;
  top: 100%; /* 버튼 바로 아래 */
  left: 0; /* 버튼 왼쪽 맞춤 */
  background-color: #fff;
  border: 1px solid #ebebeb;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 170px;
  z-index: 1000;

  .popularity {
    display: block;
    font-size: 14px;
  }

  .popularity-item {
    padding: 12px 48px 12px 16px;
    cursor: pointer;
    margin: 0;
  }
  .popularity-item:hover {
    background-color: #f0f0f0; /* 커서 올렸을 때 연회색 배경 */
  }
`;

export default PopularityModal;
