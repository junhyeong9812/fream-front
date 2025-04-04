import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark } from "lucide-react";
import styles from "./ProductDetailInfo.module.css";
import LineChart from "./LineChart";
import { SizeModal } from "./modals/SizeModal";
import { BuyModal } from "./modals/BuyModal";
import { SellModal } from "./modals/SellModal";
import { WishModal } from "./modals/WishModal";
import { LoginPromptModal } from "./modals/LoginPromptModal"; // 로그인 확인 모달 추가
import {
  ColorDetailDto,
  SizeDetailDto,
} from "../services/productDetailServices";
import { AuthContext } from "src/global/context/AuthContext";
import PriceChart from "./PriceChart";

interface ProductDetailInfoProps {
  productDetail: {
    id: number;
    name: string;
    englishName: string;
    releasePrice: number;
    thumbnailImageUrl: string;
    brandName: string;
    colorId: number;
    colorName: string;
    content: string;
    interestCount: number;
    sizes: SizeDetailDto[];
    otherColors: ColorDetailDto[];
  };
  selectedSize: string;
  setSelectedSize: (size: string) => void;
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("ko-KR").format(price);
};

const formatGender = (gender: string): string => {
  if (gender === "MAN") return "";
  if (gender === "WOMAN") return "(W)";
  return "";
};

const ProductDetailInfo: React.FC<ProductDetailInfoProps> = ({
  productDetail,
  selectedSize,
  setSelectedSize,
}) => {
  // 모달 상태 관리
  const [isSizeModalOpen, setSizeModalOpen] = useState(false);
  const [isBuyModalOpen, setBuyModalOpen] = useState(false);
  const [isSellModalOpen, setSellModalOpen] = useState(false);
  const [isWishModalOpen, setWishModalOpen] = useState(false);
  const [isLoginPromptOpen, setLoginPromptOpen] = useState(false); // 로그인 확인 모달
  const [actionType, setActionType] = useState<"buy" | "sell" | "wish">("buy"); // 로그인 후 액션 타입

  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  // 로그인 상태 확인 및 처리
  const handleAuthAction = (action: "buy" | "sell" | "wish") => {
    if (!isLoggedIn) {
      setActionType(action);
      setLoginPromptOpen(true);
      return;
    }

    // 로그인 상태라면 해당 모달 열기
    switch (action) {
      case "buy":
        setBuyModalOpen(true);
        break;
      case "sell":
        setSellModalOpen(true);
        break;
      case "wish":
        setWishModalOpen(true);
        break;
    }
  };

  // 로그인 모달에서 로그인하기 버튼 클릭
  const handleLoginRedirect = () => {
    navigate("/login", { 
      state: { 
        from: `/products/${productDetail.id}`,
        action: actionType
      } 
    });
  };

  const handleWishSubmit = async (selectedSizes: string[]) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    // TODO: API 호출 로직 구현
    setWishModalOpen(false);
  };

  // 현재 선택된 사이즈의 가격 정보 찾기
  const getCurrentSizePrice = () => {
    if (selectedSize === "모든 사이즈") {
      return productDetail.releasePrice;
    }
    const sizeInfo = productDetail.sizes.find(
      (size) => size.size === selectedSize
    );
    return sizeInfo?.purchasePrice ?? productDetail.releasePrice;
  };

  return (
    <div className={styles.detailInfoForm}>
      <div className={styles.detailInfo}>
        <div className={styles.priceContainer}>
          <p className={styles.priceLabel}>즉시 구매가</p>
          <p className={styles.priceValue}>
            {formatPrice(getCurrentSizePrice())}원
          </p>
        </div>

        <div className={styles.titleContainer}>
          <p className={styles.titleEng}>{productDetail.englishName}</p>
          <p className={styles.titleKor}>{productDetail.name}</p>
        </div>

        {/* 사이즈 선택 버튼 */}
        <button
          onClick={() => setSizeModalOpen(true)}
          className={styles.sizeSelectButton}
        >
          <span>{selectedSize}</span>
        </button>

        <div className={styles.productInfo}>
          <InfoItem
            label="최근 거래가"
            value={`${formatPrice(getCurrentSizePrice())}원`}
          />
          <Divider />
          <InfoItem
            label="발매가"
            value={`${formatPrice(productDetail.releasePrice)}원`}
          />
          <Divider />
          <InfoItem label="모델번호" value={productDetail.id.toString()} />
          <Divider />
          <InfoItem label="브랜드" value={productDetail.brandName} />
          <Divider />
          <InfoItem label="대표 색상" value={productDetail.colorName} />
        </div>

        <div className={styles.actionButtons}>
          <button
            onClick={() => handleAuthAction("buy")}
            className={styles.buyButton}
          >
            <div className={styles.buttonLabel}>구매</div>
            <Divider />
            <div className={styles.priceInfo}>
              <div className={styles.immediatePriceValue}>
                {formatPrice(getCurrentSizePrice())}원
              </div>
              <div className={styles.immediatePriceLabel}>즉시 구매가</div>
            </div>
          </button>

          <button
            onClick={() => handleAuthAction("sell")}
            className={styles.sellButton}
          >
            <div className={styles.buttonLabel}>판매</div>
            <Divider />
            <div className={styles.priceInfo}>
              <div className={styles.immediatePriceValue}>
                {formatPrice(getCurrentSizePrice())}원
              </div>
              <div className={styles.immediatePriceLabel}>즉시 판매가</div>
            </div>
          </button>
        </div>

        <button
          onClick={() => handleAuthAction("wish")}
          className={styles.interestButton}
        >
          <Bookmark size={22} fill="currentColor" />
          <span>관심상품 ({productDetail.interestCount})</span>
        </button>

        <div className={styles.chartContainer}>
          <PriceChart
            productId={productDetail.id.toString()}
            colorName={productDetail.colorName}
          />
          {!isLoggedIn && (
            <div className={styles.chartLoginPrompt}>
              <div className={styles.chartOverlay}>
                <p>모든 체결 거래는</p>
                <p>로그인 후 확인 가능합니다.</p>
                <button onClick={() => navigate("/login")}>로그인</button>
              </div>
            </div>
          )}
        </div>

        {/* 모달 컴포넌트들 */}
        <SizeModal
          isOpen={isSizeModalOpen}
          onClose={() => setSizeModalOpen(false)}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
          sizes={productDetail.sizes}
        />

        <BuyModal
          isOpen={isBuyModalOpen}
          onClose={() => setBuyModalOpen(false)}
          product={productDetail}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
        />

        <SellModal
          isOpen={isSellModalOpen}
          onClose={() => setSellModalOpen(false)}
          product={productDetail}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
        />

        <WishModal
          isOpen={isWishModalOpen}
          onClose={() => setWishModalOpen(false)}
          productId={productDetail.id}
          sizes={productDetail.sizes}
          onWishSubmit={handleWishSubmit}
        />

        {/* 로그인 확인 모달 */}
        <LoginPromptModal
          isOpen={isLoginPromptOpen}
          onClose={() => setLoginPromptOpen(false)}
          onLogin={handleLoginRedirect}
          actionType={actionType}
        />
      </div>
    </div>
  );
};

const InfoItem: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div className={styles.infoItem}>
    <div className={styles.infoLabel}>{label}</div>
    <div className={styles.infoValue}>{value}</div>
  </div>
);

const Divider: React.FC = () => <div className={styles.divider} />;

export default ProductDetailInfo;