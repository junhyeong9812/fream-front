import React, { useState, useEffect } from "react";
import styles from "./RequestModal.module.css";

interface RequestModalProps {
  setBuy_request?: React.Dispatch<React.SetStateAction<string>>;
}

const RequestModal: React.FC<RequestModalProps> = (props) => {
  const [buyModal, setBuyModal] = useState<boolean>(false);
  const [pre_request, setPre_reqeust] = useState<string>("요청사항 없음");
  const [request, setRequest] = useState<string>("요청사항 없음");
  const [requestBtn, setRequestBtn] = useState<number>(1);

  const arrowImg = "/img/detail-page/arrow.png";

  useEffect(() => {
    if (props.setBuy_request) {
      props.setBuy_request(request);
    }
  }, [request, props.setBuy_request]);

  return (
    <>
      <button
        onClick={() => setBuyModal(true)}
        className={styles.requestButton}
      >
        <div className={styles.requestButtonText}>{request}</div>
        <div className={styles.arrowContainer}>
          <img className={styles.arrowIcon} src={arrowImg} alt="Arrow" />
        </div>
      </button>

      {buyModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <p className={styles.modalTitle}>배송 요청사항</p>
              <button
                className={styles.closeButton}
                onClick={() => setBuyModal(false)}
              >
                <p className={styles.closeButtonText}>x</p>
              </button>
            </div>

            <div className={styles.optionsContainer}>
              <button
                onClick={() => {
                  setRequestBtn(1);
                  setPre_reqeust("요청사항 없음");
                }}
                className={styles.optionButton}
              >
                <div className={styles.optionContent}>
                  {requestBtn === 1 ? (
                    <>
                      <div className={styles.optionTextSelected}>
                        요청사항 없음
                      </div>
                      <div className={styles.checkIcon}>✔</div>
                    </>
                  ) : (
                    <>
                      <div className={styles.optionText}>요청사항 없음</div>
                      <div className={styles.spacer}></div>
                    </>
                  )}
                </div>
              </button>
              <div className={styles.divider}></div>

              <button
                onClick={() => {
                  setRequestBtn(2);
                  setPre_reqeust("문 앞에 놓아주세요");
                }}
                className={styles.optionButton}
              >
                <div className={styles.optionContent}>
                  {requestBtn === 2 ? (
                    <>
                      <div className={styles.optionTextSelected}>
                        문 앞에 놓아주세요
                      </div>
                      <div className={styles.checkIcon}>✔</div>
                    </>
                  ) : (
                    <>
                      <div className={styles.optionText}>
                        문 앞에 놓아주세요
                      </div>
                      <div className={styles.spacer}></div>
                    </>
                  )}
                </div>
              </button>

              <div className={styles.divider}></div>

              <button
                onClick={() => {
                  setRequestBtn(3);
                  setPre_reqeust("경비실에 맡겨 주세요");
                }}
                className={styles.optionButton}
              >
                <div className={styles.optionContent}>
                  {requestBtn === 3 ? (
                    <>
                      <div className={styles.optionTextSelected}>
                        경비실에 맡겨 주세요
                      </div>
                      <div className={styles.checkIcon}>✔</div>
                    </>
                  ) : (
                    <>
                      <div className={styles.optionText}>
                        경비실에 맡겨 주세요
                      </div>
                      <div className={styles.spacer}></div>
                    </>
                  )}
                </div>
              </button>

              <div className={styles.divider}></div>

              <button
                onClick={() => {
                  setRequestBtn(4);
                  setPre_reqeust("파손 위험 상품입니다. 배송 시 주의해주세요");
                }}
                className={styles.optionButton}
              >
                <div className={styles.optionContent}>
                  {requestBtn === 4 ? (
                    <>
                      <div className={styles.optionTextSelected}>
                        파손 위험 상품입니다. 배송 시 주의해주세요
                      </div>
                      <div className={styles.checkIcon}>✔</div>
                    </>
                  ) : (
                    <>
                      <div className={styles.optionText}>
                        파손 위험 상품입니다. 배송 시 주의해주세요
                      </div>
                      <div className={styles.spacer}></div>
                    </>
                  )}
                </div>
              </button>

              <div className={styles.divider}></div>
            </div>

            <div className={styles.buttonContainer}>
              <button
                onClick={() => {
                  setBuyModal(false);
                }}
                className={styles.cancelButton}
              >
                취소
              </button>
              <button
                onClick={() => {
                  setRequest(pre_request);
                  setBuyModal(false);
                }}
                className={styles.applyButton}
              >
                적용하기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RequestModal;
