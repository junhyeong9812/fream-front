import React, { forwardRef } from "react";
import styled from "styled-components";
import { SORT_OPTION_LIST, SortOptionKey } from "../types/sortOptions";

interface PopularityModalProps {
  open: boolean;
  onClose: () => void;
  onSelectItem?: (item: string) => void; // 선택된 값을 부모에 전달할 콜백
}

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

    // 아이템을 클릭했을 때 부모에게 선택값 전달
    const handleItemClick = (item: string) => {
      onSelectItem?.(item);
      onClose();
    };

    return (
      <ModalOverlay onClick={handleOverlayClick}>
        <ModalContainer ref={ref} onClick={handleModalClick}>
          <div className="popularity">
            {SORT_OPTION_LIST.map((item, index) => (
              <div
                key={index}
                className="popularity-item"
                onClick={() => handleItemClick(item)}
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
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0); /* 투명 배경 */
  z-index: 999;
`;

const ModalContainer = styled.div`
  position: absolute;
  top: 100%; /* 버튼 바로 아래 */
  right: 0; /* 버튼 오른쪽 정렬 */
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
    padding: 12px 16px;
    cursor: pointer;
    margin: 0;
  }

  .popularity-item:hover {
    background-color: #f0f0f0;
  }
`;

export default PopularityModal;
