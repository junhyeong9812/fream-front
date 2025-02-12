// import { useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { BookmarkFill } from "lucide-react";
// import styles from "./ProductDetailInfo.module.css";
// import { UserAuthContext } from "../contexts/UserAuthContext";
// import SizeModal from "./modals/SizeModal";
// import BuyModal from "./modals/BuyModal";
// import SellModal from "./modals/SellModal";
// import ShopModal from "./modals/ShopModal";
// import LineChart from "./LineChart";

// interface ProductDetailInfoProps {
//   productDetail: {
//     price: number; // 상품 가격
//     gender: string; // 성별 (MAN/WOMAN)
//     nameEng: string; // 영문 상품명
//     nameKor: string; // 한글 상품명
//     prid: string; // 상품 ID
//     color: string; // 상품 색상
//   };
//   selectedSize: string; // 선택된 사이즈
//   setSelectedSize: (size: string) => void; // 사이즈 선택 함수
//   detailMainImage: string[]; // 메인 이미지 URL
// }

// const formatPrice = (price: number): string => {
//   return new Intl.NumberFormat("en-US").format(price);
// };

// const formatGender = (gender: string): string => {
//   if (gender === "MAN") return "";
//   if (gender === "WOMAN") return "(W)";
//   return "";
// };

// const ProductDetailInfo: React.FC<ProductDetailInfoProps> = ({
//   productDetail,
//   selectedSize,
//   setSelectedSize,
//   detailMainImage,
// }) => {
//   const [interestModal, setInterestModal] = useState(false);
//   const [isChecked, setIsChecked] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const { isLoggedIn } = useContext(UserAuthContext);
//   const navigate = useNavigate();

//   const handleInterestClick = () => {
//     if (!isLoggedIn) {
//       navigate("/login");
//       return;
//     }
//     setInterestModal(true);
//     setShowModal(true);
//   };

//   const closeModal = () => setShowModal(false);

//   return (
//     <div className={styles.detailInfoForm}>
//       <div className={styles.detailInfo}>
//         <div className={styles.priceContainer}>
//           <p className={styles.priceLabel}>즉시 구매가</p>
//           <p className={styles.priceValue}>
//             {formatPrice(productDetail.price)}원
//           </p>
//         </div>

//         <div className={styles.titleContainer}>
//           <p className={styles.titleEng}>
//             {formatGender(productDetail.gender)}
//             {productDetail.nameEng}
//           </p>
//           <p className={styles.titleKor}>
//             {formatGender(productDetail.gender)}
//             {productDetail.nameKor}
//           </p>
//         </div>

//         <SizeModal
//           selectedSize={selectedSize}
//           setSelectedSize={setSelectedSize}
//         />

//         <div className={styles.productInfo}>
//           <InfoItem
//             label="최근 거래가"
//             value={`${formatPrice(productDetail.price)}원`}
//           />
//           <Divider />
//           <InfoItem
//             label="발매가"
//             value={`${formatPrice(productDetail.price)}원`}
//           />
//           <Divider />
//           <InfoItem label="모델번호" value={productDetail.prid} />
//           <Divider />
//           <InfoItem label="출시일" value="24/06/11" />
//           <Divider />
//           <InfoItem label="대표 색상" value={productDetail.color} />
//         </div>

//         <div className={styles.actionButtons}>
//           <BuyModal
//             detailMainImage={detailMainImage}
//             productDetail={productDetail}
//             selectedSize={selectedSize}
//             setSelectedSize={setSelectedSize}
//           />
//           <SellModal
//             detailMainImage={detailMainImage}
//             productDetail={productDetail}
//             selectedSize={selectedSize}
//             setSelectedSize={setSelectedSize}
//           />
//         </div>

//         <button onClick={handleInterestClick} className={styles.interestButton}>
//           <BookmarkFill size={22} />
//           <span>관심상품</span>
//         </button>

//         {interestModal && isLoggedIn && (
//           <ShopModal
//             isChecked={isChecked}
//             setIsChecked={setIsChecked}
//             closeModal={closeModal}
//             showModal={showModal}
//             prId={productDetail.prid}
//           />
//         )}

//         {/* Price chart section */}
//         <div className={styles.chartContainer}>
//           {isLoggedIn ? (
//             <LineChart productId={productDetail.prid} />
//           ) : (
//             <div className={styles.chartLoginPrompt}>
//               <div className={styles.chartOverlay}>
//                 <p>모든 체결 거래는</p>
//                 <p>로그인 후 확인 가능합니다.</p>
//                 <button onClick={() => navigate("/login")}>로그인</button>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Additional sections like benefits, shipping info, etc. can be
//             added here following the same pattern */}
//       </div>
//     </div>
//   );
// };

// const InfoItem: React.FC<{ label: string; value: string }> = ({
//   label,
//   value,
// }) => (
//   <div className={styles.infoItem}>
//     <div className={styles.infoLabel}>{label}</div>
//     <div className={styles.infoValue}>{value}</div>
//   </div>
// );

// const Divider: React.FC = () => <div className={styles.divider} />;

// export default ProductDetailInfo;
