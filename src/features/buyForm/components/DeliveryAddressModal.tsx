// import React, { useState, useEffect } from "react";
// import styles from "./DeliveryAddressModal.module.css";

// declare global {
//   interface Window {
//     daum: any;
//   }
// }

// interface DeliveryAddressModalProps {
//   setFinalName: React.Dispatch<React.SetStateAction<string>>;
//   setFinalNumber: React.Dispatch<React.SetStateAction<string>>;
//   setFinalZonecode: React.Dispatch<React.SetStateAction<string>>;
//   setFinalRoadaddress: React.Dispatch<React.SetStateAction<string>>;
//   setFinalBname: React.Dispatch<React.SetStateAction<string>>;
//   setFinalBuildingname: React.Dispatch<React.SetStateAction<string>>;
//   setFinalBetterAddress: React.Dispatch<React.SetStateAction<string>>;
//   setFinalSaveBtn: React.Dispatch<React.SetStateAction<boolean>>;
// }

// const DeliveryAddressModal: React.FC<DeliveryAddressModalProps> = (props) => {
//   const [clickBtn, setClickBtn] = useState<boolean>(false);
//   const [finalBtn, setFinalBtn] = useState<boolean>(false);
//   const [zonecode, setZonecode] = useState<string | null>(null);
//   const [roadaddress, setRoadaddress] = useState<string>("");
//   const [bname, setBname] = useState<string>("");
//   const [buildingname, setBuildingname] = useState<string>("");
//   const [deliveryModal, setDeliveryModal] = useState<boolean>(false);

//   const inputValue = zonecode ? zonecode : "우편 번호를 검색하세요";
//   const inputValue2 = zonecode
//     ? `${roadaddress} (${bname}, ${buildingname})`
//     : "우편 번호 검색 후, 자동입력 됩니다";
//   const inputClassName = zonecode
//     ? styles.name_input_txt
//     : styles.name_input_null_txt;

//   useEffect(() => {
//     props.setFinalName(inputNameValue);
//     props.setFinalNumber(inputNumberValue);
//     props.setFinalZonecode(zonecode || "");
//     props.setFinalRoadaddress(roadaddress);
//     props.setFinalBname(bname);
//     props.setFinalBuildingname(buildingname);
//     props.setFinalBetterAddress(inputAddressValue);
//     props.setFinalSaveBtn(clickBtn);
//   }, [
//     clickBtn,
//     inputNameValue,
//     inputNumberValue,
//     zonecode,
//     roadaddress,
//     bname,
//     buildingname,
//     inputAddressValue,
//     props,
//   ]);

//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src =
//       "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
//     script.async = true;

//     document.body.appendChild(script);

//     return () => {
//       if (document.body.contains(script)) {
//         document.body.removeChild(script);
//       }
//     };
//   }, []);

//   const delivery = () => {
//     if (window.daum && window.daum.Postcode) {
//       new window.daum.Postcode({
//         oncomplete: function (data: any) {
//           setZonecode(data.zonecode);
//           setRoadaddress(data.roadAddress);
//           setBname(data.bname);
//           setBuildingname(data.buildingName);
//         },
//       }).open();
//     } else {
//       console.error("Daum postcode script not loaded yet");
//     }
//   };

//   const [inputNameValue, setInputNameValue] = useState<string>("");
//   const [showNameWarning, setShowNameWarning] = useState<boolean>(false);

//   const handleInputNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setInputNameValue(value);
//     if (value.length < 2 || value.length > 50) {
//       setShowNameWarning(true);
//     } else {
//       setShowNameWarning(false);
//     }
//   };

//   const [inputNumberValue, setInputNumberValue] = useState<string>("");
//   const [showNumberWarning, setShowNumberWarning] = useState<boolean>(false);

//   const handleInputNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setInputNumberValue(value);
//     if (value.length < 10 || value.length > 11 || isNaN(Number(value))) {
//       setShowNumberWarning(true);
//     } else {
//       setShowNumberWarning(false);
//     }
//   };

//   const [inputAddressValue, setInputAddressValue] = useState<string>("");
//   const [hasAddressInput, setHasAddressInput] = useState<boolean>(false);

//   const handleInputAddressChange = (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const value = event.target.value;
//     setInputAddressValue(value);
//     setHasAddressInput(value.length > 0);
//   };

//   useEffect(() => {
//     if (zonecode && !showNameWarning && !showNumberWarning && hasAddressInput) {
//       setFinalBtn(true);
//     } else {
//       setFinalBtn(false);
//     }
//   }, [zonecode, showNameWarning, showNumberWarning, hasAddressInput]);

//   const saveBtnClick = () => {
//     setClickBtn(true);
//     setDeliveryModal(false);
//   };

//   return (
//     <>
//       <button
//         onClick={() => setDeliveryModal(true)}
//         className={styles.addressButton}
//       >
//         <div className={styles.addressButtonText}>주소를 추가해주세요.</div>
//       </button>

//       {deliveryModal && (
//         <div className={styles.modalOverlay}>
//           <div className={styles.modalContent}>
//             <div className={styles.modalHeader}>
//               <div className={styles.modalTitle}>새 주소 추가</div>
//               <button
//                 onClick={() => setDeliveryModal(false)}
//                 className={styles.closeButton}
//               >
//                 x
//               </button>
//             </div>

//             <div className={styles.formContainer}>
//               {showNameWarning ? (
//                 <>
//                   <div className={styles.formLabelError}>이름</div>
//                   <div className={styles.inputContainer}>
//                     <input
//                       maxLength={50}
//                       className={styles.inputError}
//                       onChange={handleInputNameChange}
//                       value={inputNameValue}
//                       type="text"
//                       placeholder="수령인의 이름"
//                     />
//                   </div>
//                   <div className={styles.errorMessage}>
//                     올바른 이름을 입력해주세요. (2 - 50자)
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <div className={styles.formLabel}>이름</div>
//                   <div className={styles.inputContainer}>
//                     <input
//                       onChange={handleInputNameChange}
//                       value={inputNameValue}
//                       type="text"
//                       placeholder="수령인의 이름"
//                       className={styles.input}
//                     />
//                   </div>
//                   <div className={styles.spacer}></div>
//                 </>
//               )}

//               <div className={styles.spacer}></div>

//               {showNumberWarning ? (
//                 <>
//                   <div className={styles.formLabelError}>휴대폰 번호</div>
//                   <div className={styles.inputContainer}>
//                     <input
//                       className={styles.inputError}
//                       onChange={handleInputNumberChange}
//                       value={inputNumberValue}
//                       type="text"
//                       placeholder="- 없이 입력"
//                     />
//                   </div>
//                   <div className={styles.errorMessage}>
//                     정확한 휴대폰 번호를 입력해주세요.
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <div className={styles.formLabel}>휴대폰 번호</div>
//                   <div className={styles.inputContainer}>
//                     <input
//                       onChange={handleInputNumberChange}
//                       value={inputNumberValue}
//                       type="text"
//                       placeholder="- 없이 입력"
//                       className={styles.input}
//                     />
//                   </div>
//                   <div className={styles.spacer}></div>
//                 </>
//               )}

//               <div className={styles.spacer}></div>

//               <div className={styles.formLabel}>우편번호</div>
//               <div className={styles.postcodeContainer}>
//                 <input
//                   className={inputClassName}
//                   readOnly
//                   type="text"
//                   value={inputValue}
//                 />
//                 <button onClick={delivery} className={styles.postcodeButton}>
//                   우편번호
//                 </button>
//               </div>

//               <div className={styles.formLabel}>주소</div>
//               <div className={styles.inputContainer}>
//                 <input
//                   value={inputValue2}
//                   readOnly
//                   type="text"
//                   className={inputClassName}
//                 />
//               </div>

//               <div className={styles.formLabel}>상세 주소</div>
//               <div className={styles.inputContainer}>
//                 <input
//                   onChange={handleInputAddressChange}
//                   type="text"
//                   placeholder="건물, 아파트, 동/호수 입력"
//                   className={styles.input}
//                 />
//               </div>

//               <div className={styles.buttonContainer}>
//                 <button
//                   onClick={() => setDeliveryModal(false)}
//                   className={styles.cancelButton}
//                 >
//                   취소
//                 </button>

//                 {finalBtn ? (
//                   <button onClick={saveBtnClick} className={styles.saveButton}>
//                     저장하기
//                   </button>
//                 ) : (
//                   <button disabled className={styles.disabledButton}>
//                     저장하기
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default DeliveryAddressModal;
