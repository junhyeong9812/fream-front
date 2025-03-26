import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import styles from "./SellForm.module.css";
import { ProductDetailDto, SizeDetailDto } from "../types/product";
import { AddressResponseDto } from "../types/address";
import { BankAccountResponseDto } from "../types/bankAccount";
import { SaleBidRequestDto, InstantSaleRequestDto } from "../types/sell";
import { addressService } from "../services/addressService";
import { bankAccountService } from "../services/bankAccountService";
import { sellService } from "../services/sellService";
import { productService } from "../services/productService";
import PriceInputModal from "../components/PriceInputModal";
import RequestModal from "../components/RequestModal";
import BankAccountModal from "../components/BankAccountModal";
import DeliveryAddressModal from "../components/DeliveryAddressModal";
import DeliveryAddressList from "../components/DeliveryAddressList";

// 이미지 경로
const deliveryImg = "/img/detail-page/ship_imfo.png";
const naverImg = "/img/detail-page/naver_pay.png";
const kakaoImg = "/img/detail-page/kakao_pay.png";
const tossImg = "/img/detail-page/toss_pay.png";
const paycoImg = "/img/detail-page/payco_pay.png";
const arrowImg = "/img/detail-page/arrow.png";

const SellForm: React.FC = () => {
  const { productId, size } = useParams<{ productId: string; size: string }>();
  const [searchParams] = useSearchParams();
  const colorName = searchParams.get("color") || "";
  const navigate = useNavigate();

  // 상태 관리
  const [product, setProduct] = useState<ProductDetailDto | null>(null);
  const [sizeInfo, setSizeInfo] = useState<SizeDetailDto | null>(null);
  const [isProductLoading, setIsProductLoading] = useState<boolean>(true);
  const [selectedAddress, setSelectedAddress] =
    useState<AddressResponseDto | null>(null);
  const [selectedBankAccount, setSelectedBankAccount] =
    useState<BankAccountResponseDto | null>(null);
  const [shippingOption, setShippingOption] = useState<number>(1);
  const [isWarehouseStorage, setIsWarehouseStorage] = useState<boolean>(false);
  const [paymentOption, setPaymentOption] = useState<number | null>(null);
  const [requestOption, setRequestOption] = useState<string>("요청사항 없음");
  const [customPrice, setCustomPrice] = useState<number | null>(null); // 사용자 지정 가격
  const [isAddressModalOpen, setAddressModalOpen] = useState<boolean>(false);
  const [isAddressListOpen, setAddressListOpen] = useState<boolean>(false);
  const [isBankAccountModalOpen, setBankAccountModalOpen] =
    useState<boolean>(false);
  const [isRequestModalOpen, setRequestModalOpen] = useState<boolean>(false);
  const [isPriceModalOpen, setPriceModalOpen] = useState<boolean>(false); // 가격 모달 상태
  const [canSubmit, setCanSubmit] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 상품 정보 불러오기
  useEffect(() => {
    const fetchProductData = async () => {
      if (!productId) {
        setError("상품 정보를 찾을 수 없습니다.");
        setIsProductLoading(false);
        return;
      }

      try {
        setIsProductLoading(true);

        // 상품 정보 가져오기 (colorName이 필요한 경우 추가)
        const productData = await productService.getProductDetail(
          productId,
          colorName
        );
        setProduct(productData);

        // 사이즈 정보 찾기
        if (productData.sizes && size) {
          const sizeData = productData.sizes.find((s) => s.size === size);
          if (sizeData) {
            setSizeInfo(sizeData);
            setCustomPrice(sizeData.salePrice); // 초기 가격 설정
          } else {
            throw new Error("해당 사이즈를 찾을 수 없습니다.");
          }
        } else {
          throw new Error("사이즈 정보를 찾을 수 없습니다.");
        }
      } catch (error) {
        console.error("상품 정보 로딩 실패:", error);
        setError("상품 정보를 불러오는데 실패했습니다. 다시 시도해주세요.");
      } finally {
        setIsProductLoading(false);
      }
    };

    fetchProductData();
  }, [productId, size, colorName]);

  // 주소 및 계좌 정보 불러오기
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // 주소 정보 가져오기
        const addresses = await addressService.getAddresses();
        if (addresses && addresses.length > 0) {
          // 기본 주소 또는 첫 번째 주소 선택
          const defaultAddress =
            addresses.find((addr) => addr.isDefault) || addresses[0];
          setSelectedAddress(defaultAddress);
        }

        // 계좌 정보 가져오기
        const accounts = await bankAccountService.getBankAccounts();
        if (accounts && accounts.length > 0) {
          setSelectedBankAccount(accounts[0]);
        }
      } catch (error) {
        console.error("사용자 데이터 로딩 실패:", error);
      }
    };

    fetchUserData();
  }, []);

  // 제출 가능 상태 확인
  useEffect(() => {
    if (
      selectedAddress &&
      paymentOption !== null &&
      sizeInfo !== null &&
      customPrice !== null &&
      customPrice > 0
    ) {
      setCanSubmit(true);
    } else {
      setCanSubmit(false);
    }
  }, [selectedAddress, paymentOption, sizeInfo, customPrice]);

  // 휴대폰 번호 마스킹 함수
  const maskPhoneNumber = (phoneNumber: string): string => {
    if (phoneNumber.length === 11) {
      return phoneNumber
        .replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3")
        .replace(/(\d{3})-(\d{1})(\d{3})-(\d{1})(\d{3})/, "$1-$2***-*$5");
    } else if (phoneNumber.length === 10) {
      return phoneNumber
        .replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")
        .replace(/(\d{3})-(\d{1})(\d{2})-(\d{1})(\d{3})/, "$1-$2**-*$5");
    }
    return phoneNumber;
  };

  // 이름 마스킹 함수
  const maskName = (name: string): string => {
    if (!name) return "";
    return name[0] + "*".repeat(name.length - 1);
  };

  // 가격 포맷 함수
  const formatPrice = (price: number | null): string => {
    if (price === null) return "0";
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  // 주소 선택 처리
  const handleAddressSelected = (address: AddressResponseDto) => {
    setSelectedAddress(address);
  };

  // 새 주소 추가 처리
  const handleAddressAdded = (address: AddressResponseDto) => {
    setSelectedAddress(address);
    // 주소 목록 다시 불러오기
    addressService.getAddresses();
  };

  // 판매 제출 처리
  const handleSubmit = async () => {
    if (
      !canSubmit ||
      isLoading ||
      !product ||
      !sizeInfo ||
      !selectedAddress ||
      customPrice === null
    )
      return;

    setIsLoading(true);

    try {
      // 판매 입찰 생성
      const saleData: SaleBidRequestDto = {
        productSizeId: 1, // 실제로는 API에서 제공하는 상품 사이즈 ID 사용
        bidPrice: customPrice, // 사용자가 설정한 가격 사용
        returnAddress: `${selectedAddress.address} ${selectedAddress.detailedAddress}`,
        postalCode: selectedAddress.zipCode,
        receiverPhone: selectedAddress.phoneNumber,
        warehouseStorage: isWarehouseStorage,
      };

      const saleId = await sellService.createSaleBid(saleData);

      alert("판매 등록이 완료되었습니다.");
      navigate("/my/sales", { state: { saleBidId: saleId } });
    } catch (error) {
      console.error("판매 등록 실패:", error);
      alert("판매 등록에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  // 로딩 중일 때 표시
  if (isProductLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>판매 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  // 에러 발생 시 표시
  if (error || !product || !sizeInfo) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>!</div>
        <h2>오류가 발생했습니다</h2>
        <p>{error || "상품 정보를 찾을 수 없습니다."}</p>
        <button className={styles.goBackButton} onClick={() => navigate(-1)}>
          이전 페이지로 돌아가기
        </button>
      </div>
    );
  }

  // 현재 판매가 (사용자 설정 가격 또는 기본 판매가)
  const currentPrice = customPrice !== null ? customPrice : sizeInfo.salePrice;

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        {/* 상품 정보 섹션 */}
        <div className={styles.section}>
          <div className={styles.productInfo}>
            <img
              src={product.thumbnailImageUrl}
              alt={product.name || product.englishName}
              className={styles.productImage}
            />
            <div className={styles.productDetails}>
              <p>{product.id}</p>
              <h4>{product.englishName}</h4>
              <p>{product.name}</p>
              <p className={styles.size}>{size}</p>
            </div>
          </div>
        </div>

        {/* 판매 정산 계좌 섹션 */}
        <div className={styles.section}>
          {selectedBankAccount ? (
            <>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>판매 정산 계좌</h3>
                <button
                  onClick={() => setBankAccountModalOpen(true)}
                  className={styles.changeButton}
                >
                  변경
                </button>
              </div>
              <div className={styles.accountInfo}>
                <div className={styles.accountRow}>
                  <div className={styles.accountLabel}>계좌</div>
                  <div className={styles.accountValue}>
                    {selectedBankAccount.bankName}{" "}
                    {selectedBankAccount.accountNumber}
                  </div>
                </div>
                <div className={styles.accountRow}>
                  <div className={styles.accountLabel}>예금주</div>
                  <div className={styles.accountValue}>
                    {selectedBankAccount.accountHolder}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>판매 정산 계좌</h3>
              </div>
              <div className={styles.noAccountMessage}>
                <p>등록된 판매 정산 계좌가 없습니다.</p>
                <p>새 계좌번호를 추가해주세요!</p>
                <button
                  onClick={() => setBankAccountModalOpen(true)}
                  className={styles.addAccountButton}
                >
                  계좌 추가
                </button>
              </div>
            </>
          )}
        </div>

        {/* 반송 주소 섹션 */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>반송 주소</h3>
            {selectedAddress && (
              <button
                onClick={() => setAddressListOpen(true)}
                className={styles.changeButton}
              >
                변경
              </button>
            )}
          </div>

          {selectedAddress ? (
            <div className={styles.addressInfo}>
              <div className={styles.addressRow}>
                <div className={styles.addressLabel}>받는 분</div>
                <div className={styles.addressValue}>
                  {maskName(selectedAddress.recipientName)}
                </div>
              </div>
              <div className={styles.addressRow}>
                <div className={styles.addressLabel}>연락처</div>
                <div className={styles.addressValue}>
                  {maskPhoneNumber(selectedAddress.phoneNumber)}
                </div>
              </div>
              <div className={styles.addressRow}>
                <div className={styles.addressLabel}>반송 주소</div>
                <div className={styles.addressValue}>
                  ({selectedAddress.zipCode}) {selectedAddress.address}{" "}
                  {selectedAddress.detailedAddress}
                </div>
              </div>
            </div>
          ) : (
            <button
              className={styles.noAddressButton}
              onClick={() => setAddressListOpen(true)}
            >
              주소를 추가해주세요.
            </button>
          )}

          {/* 배송 요청사항 */}
          <button
            className={styles.requestButton}
            onClick={() => setRequestModalOpen(true)}
          >
            <div className={styles.requestText}>{requestOption}</div>
            <img src={arrowImg} alt="More" className={styles.arrowIcon} />
          </button>

          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>발송 방법</h3>
          </div>
          <div className={styles.shippingMethod}>
            <button
              className={`${styles.deliveryButton} ${
                shippingOption === 1 ? styles.deliveryButtonActive : ""
              }`}
              onClick={() => {
                setShippingOption(1);
                setIsWarehouseStorage(false);
              }}
            >
              <img
                src={deliveryImg}
                alt="일반배송"
                className={styles.deliveryIcon}
              />
              <div className={styles.deliveryInfo}>
                <div className={styles.deliveryTitle}>
                  <strong>일반배송</strong>
                  <span>3,000원</span>
                </div>
                <div className={styles.deliveryDescription}>
                  검수 후 배송 ・ 5-7일 내 도착 예정
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* 판매가격 설정 섹션 (추가됨) */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>판매가격</h3>
            <button
              onClick={() => setPriceModalOpen(true)}
              className={styles.changeButton}
            >
              변경
            </button>
          </div>
          <div className={styles.priceInfo}>
            <div className={styles.priceRow}>
              <div className={styles.priceLabel}>판매가</div>
              <div className={styles.priceValue}>
                {formatPrice(currentPrice)}원
              </div>
            </div>
            <div className={styles.priceRow}>
              <div className={styles.priceLabel}>참고가</div>
              <div className={styles.priceSubValue}>
                시세: {formatPrice(sizeInfo.salePrice)}원
              </div>
            </div>
          </div>
        </div>

        {/* 결제 방식 섹션 */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>결제 방식</h3>
          </div>
          <div className={styles.paymentMethod}>
            <div className={styles.paymentTitle}>
              일반 결제
              <span>일시불·할부</span>
            </div>
            <div className={styles.paymentButtonsRow}>
              <button
                className={`${styles.paymentButton} ${
                  paymentOption === 1 ? styles.paymentButtonActive : ""
                }`}
                onClick={() => setPaymentOption(1)}
              >
                <div className={styles.paymentLabel}>신용카드</div>
              </button>
              <button
                className={`${styles.paymentButton} ${
                  paymentOption === 2 ? styles.paymentButtonActive : ""
                }`}
                onClick={() => setPaymentOption(2)}
              >
                <div className={styles.paymentLabel}>네이버페이</div>
                <img
                  src={naverImg}
                  alt="네이버페이"
                  className={styles.paymentIcon}
                />
              </button>
              <button
                className={`${styles.paymentButton} ${
                  paymentOption === 3 ? styles.paymentButtonActive : ""
                }`}
                onClick={() => setPaymentOption(3)}
              >
                <div className={styles.paymentLabel}>카카오페이</div>
                <img
                  src={kakaoImg}
                  alt="카카오페이"
                  className={styles.paymentIcon}
                />
              </button>
            </div>
            <div className={styles.paymentButtonsRow}>
              <button
                className={`${styles.paymentButton} ${
                  paymentOption === 4 ? styles.paymentButtonActive : ""
                }`}
                onClick={() => setPaymentOption(4)}
              >
                <div className={styles.paymentLabel}>토스페이</div>
                <img
                  src={tossImg}
                  alt="토스페이"
                  className={styles.paymentIcon}
                />
              </button>
              <button
                className={`${styles.paymentButton} ${
                  paymentOption === 5 ? styles.paymentButtonActive : ""
                }`}
                onClick={() => setPaymentOption(5)}
              >
                <div className={styles.paymentLabel}>페이코</div>
                <img
                  src={paycoImg}
                  alt="페이코"
                  className={styles.paymentIcon}
                />
              </button>
            </div>
            <div className={styles.paymentDisclaimer}>
              체결 후 결제 정보 변경은 불가하며 분할 납부 변경은 카드사 문의
              바랍니다. 단, 카드사별 정책에 따라 분할 납부 변경 시 수수료가
              발생할 수 있습니다.
            </div>
            <div className={styles.paymentBenefits}>
              <div className={styles.benefitRow}>
                <div className={styles.benefitCard}>우리카드</div>
                <div className={styles.benefitDesc}>
                  KREAM카드 최대 5% 청구할인
                </div>
              </div>
              <div className={styles.benefitRow}>
                <div className={styles.benefitCard}>네이버페이</div>
                <div className={styles.benefitDesc}>
                  최대 2.1% 네이버페이포인트 적립
                </div>
              </div>
              <div className={styles.benefitRow}>
                <div className={styles.benefitCard}>삼성카드</div>
                <div className={styles.benefitDesc}>
                  10만원 이상 LINK 청구할인 3%
                </div>
              </div>
              <div className={styles.benefitRow}>
                <div className={styles.benefitCard}>현대카드</div>
                <div className={styles.benefitDesc}>
                  18개월/24개월 특별 할부 혜택
                </div>
              </div>
              <div className={styles.benefitRow}>
                <div className={styles.benefitCard}>국민카드</div>
                <div className={styles.benefitDesc}>
                  12개월/18개월 특별 할부 혜택
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 최종 주문정보 섹션 */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>최종 주문정보</h3>
          </div>
          <div className={styles.orderSummary}>
            <div className={styles.summaryRow}>
              <div className={styles.summaryLabel}>판매가</div>
              <div className={styles.summaryValue}>
                {formatPrice(currentPrice)}원
              </div>
            </div>
            <div className={styles.feeSummaryRow}>
              <div className={styles.summaryLabel}>검수비</div>
              <div className={styles.summaryValue}>무료</div>
            </div>
            <div className={styles.feeSummaryRow}>
              <div className={styles.summaryLabel}>수수료</div>
              <div className={styles.summaryValue}>무료</div>
            </div>
            <div className={styles.feeSummaryRow}>
              <div className={styles.summaryLabel}>배송비</div>
              <div className={styles.summaryValue}>선불 · 판매자 부담</div>
            </div>
          </div>
        </div>

        {/* 정산금액 섹션 */}
        <div className={styles.totalSection}>
          <div className={styles.totalLabel}>정산금액</div>
          <div className={styles.totalAmount}>
            <div className={styles.warning}>
              <strong>주의!</strong>
              <span>최근 거래가를 확인해주세요.</span>
            </div>
            <div className={styles.finalPrice}>
              {formatPrice(currentPrice)}원
            </div>
          </div>
        </div>

        {/* 판매하기 버튼 */}
        <div className={styles.actionSection}>
          {canSubmit ? (
            <button
              className={styles.sellButton}
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {formatPrice(currentPrice)}원・판매하기
            </button>
          ) : (
            <button className={styles.disabledSellButton} disabled>
              {formatPrice(currentPrice || 0)}원・판매하기
            </button>
          )}
        </div>
      </div>

      {/* 모달 컴포넌트 */}
      {isAddressListOpen && (
        <DeliveryAddressList
          isOpen={isAddressListOpen}
          onClose={() => setAddressListOpen(false)}
          onSelectAddress={handleAddressSelected}
          selectedAddressId={selectedAddress?.id}
        />
      )}

      {isAddressModalOpen && (
        <DeliveryAddressModal
          isOpen={isAddressModalOpen}
          onClose={() => setAddressModalOpen(false)}
          onSave={handleAddressAdded}
          selectedAddress={selectedAddress || undefined}
        />
      )}

      {isBankAccountModalOpen && (
        <BankAccountModal
          isOpen={isBankAccountModalOpen}
          onClose={() => setBankAccountModalOpen(false)}
          onSave={(account) => {
            setSelectedBankAccount(account);
            setBankAccountModalOpen(false);
          }}
        />
      )}

      {isRequestModalOpen && (
        <RequestModal
          isOpen={isRequestModalOpen}
          onClose={() => setRequestModalOpen(false)}
          onSave={(request) => {
            setRequestOption(request);
            setRequestModalOpen(false);
          }}
          currentOption={requestOption}
        />
      )}

      {/* 가격 입력 모달 */}
      {isPriceModalOpen && (
        <PriceInputModal
          isOpen={isPriceModalOpen}
          onClose={() => setPriceModalOpen(false)}
          onSave={(price) => {
            setCustomPrice(price);
            setPriceModalOpen(false);
          }}
          currentPrice={currentPrice}
          marketPrice={sizeInfo.salePrice}
        />
      )}
    </div>
  );
};

export default SellForm;
