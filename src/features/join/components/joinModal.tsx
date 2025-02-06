import "../css/joinModal.css";
import React from "react";
import { JoinComponentsProps } from "../types/joinTypes";

const JoinModal: React.FC<JoinComponentsProps> = ({
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
    <div className="signup_size_form_container">
      <div className="signup_size_form_content">
        <div className="signup_size_form_title_content">사이즈 선택</div>
        <div className="signup_size_form_list_container">
          {sizes.map((sizeOption, index) => (
            <div
              className={`signup_size_form_list_content ${
                size === sizeOption ? "selected" : "unselected"
              }`}
              onClick={() => setSize(sizeOption)}
            >
              {sizeOption}
            </div>
          ))}
        </div>
        <div className="signup_size_form_btn_content">
          <div
            className={`signup_size_form_btn ${
              size === "선택하세요" ? "unselected" : "selected"
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

export default JoinModal;
