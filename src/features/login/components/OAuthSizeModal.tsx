import styles from "./OAuthSizeModal.module.css";
import React from "react";

interface OAuthSizeModalProps {
  setSizeModal: (value: boolean) => void;
  setSize: (value: string) => void;
  size: string;
}

const OAuthSizeModal: React.FC<OAuthSizeModalProps> = ({
  setSizeModal,
  setSize,
  size,
}) => {
  const sizes: string[] = [
    "220",
    "225",
    "230",
    "235",
    "240",
    "245",
    "250",
    "255",
    "260",
    "265",
    "270",
    "275",
    "280",
    "285",
    "290",
    "295",
    "300",
  ];

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.titleContent}>사이즈 선택</div>
        <div className={styles.listContainer}>
          {sizes.map((sizeOption, index) => (
            <div
              key={index}
              className={`${styles.listContent} ${
                size === sizeOption ? styles.selected : styles.unselected
              }`}
              onClick={() => setSize(sizeOption)}
            >
              {sizeOption}
            </div>
          ))}
        </div>
        <div className={styles.btnContent}>
          <div
            className={`${styles.btn} ${
              size === "선택하세요" ? styles.btnUnselected : styles.btnSelected
            }`}
            onClick={() => setSizeModal(false)}
          >
            확인
          </div>
        </div>
      </div>
    </div>
  );
};

export default OAuthSizeModal;
