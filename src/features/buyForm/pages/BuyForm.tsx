import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import styles from "./BuyForm.module.css";
import { ProductDetailDto, SizeDetailDto } from "../types/product";
import { AddressResponseDto } from "../types/address";
import { OrderBidRequestDto, PayAndShipmentRequestDto } from "../types/order";
import { addressService } from "../services/addressService";
import { productService } from "../services/productService";
import { orderService } from "../services/orderService";
import RequestModal from "../components/RequestModal";
import DeliveryAddressModal from "../components/DeliveryAddressModal";

// 이미지 경로
const deliveryImg = "/img/detail-page/ship_imfo.png";
const deliveryImg2 = "/img/detail-page/ship_imfo2.png";
const naverImg = "/img/detail-page/naver_pay.png";
const kakaoImg = "/img/detail-page/kakao_pay.png";
const tossImg = "/img/detail-page/toss_pay.png";
const paycoImg = "/img/detail-page/payco_pay.png";
const arrowImg = "/img/detail-page/arrow.png";

declare global {
  interface Window {
    IMP: any;
  }
}

const BuyForm: React.FC = () => {
  const { productId, size } = useParams<{ productId: string; size: string }>();
  const [searchParams] = useSearchParams();
  const colorName = searchParams.get("color") || "";
  const navigate = useNavigate();

  // 상태 관리
  const [product, setProduct] = useState<ProductDetailDto | null>(null);
  const [sizeInfo, setSizeInfo] = useState<SizeDetailDto | null>(null);
  const [isProductLoading, setIsProductLoading] = useState<boolean>(true);

  // 배송 관련 상태
  const [finalName, setFinalName] = useState<string>("");
  const [finalNumber, setFinalNumber] = useState<string>("");
  const [finalZonecode, setFinalZonecode] = useState<string>("");
  const [finalRoadaddress, setFinalRoadaddress] = useState<string>("");
  const [finalBname, setFinalBname] = useState<string>("");
  const [finalBuildingname, setFinalBuildingname] = useState<string>("");
  const [finalBetterAddress, setFinalBetterAddress] = useState<string>("");
  const [finalSaveBtn, setFinalSaveBtn] = useState<boolean>(false);
  const [finalCardBtn, setFinalCardBtn] = useState<boolean>(false);
  const [numberVal, setNumberVal] = useState<string>("");

  // 주문 관련 상태
  const [deliveryBtn, setDeliveryBtn] = useState<number>(1);
  const [isWarehouseStorage, setIsWarehouseStorage] = useState<boolean>(false);
  const [paymentBtn, setPaymentBtn] = useState<number | null>(null);
  const [requestOption, setRequestOption] = useState<string>("요청사항 없음");
  const [isRequestModalOpen, setRequestModalOpen] = useState<boolean>(false);
  const [isAddressModalOpen, setAddressModalOpen] = useState<boolean>(false);
  const [finalBtn, setFinalBtn] = useState<boolean>(false);
  const [addressList, setAddressList] = useState<AddressResponseDto[]>([]);
  const [selectedAddress, setSelectedAddress] =
    useState<AddressResponseDto | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

        // 상품 정보 가져오기 (colorName 파라미터 추가)
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

  // 주소 정보 불러오기
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const addresses = await addressService.getAddresses();
        setAddressList(addresses);

        // 기본 주소 또는 첫 번째 주소 선택
        if (addresses.length > 0) {
          const defaultAddress =
            addresses.find((addr) => addr.isDefault) || addresses[0];
          setSelectedAddress(defaultAddress);
        }
      } catch (error) {
        console.error("주소 정보 로딩 실패:", error);
      }
    };

    fetchAddresses();
  }, []);

  // 휴대폰 번호 마스킹 처리
  useEffect(() => {
    if (finalNumber.length === 11) {
      const formatPhoneNumber4 = (number: string): string => {
        const cleaned = number.replace(/\D/g, "");
        const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);
        if (match) {
          const maskedMiddle = match[2][0] + "***";
          const maskedEnd = "*" + match[3].slice(1);
          return `${match[1]}-${maskedMiddle}-${maskedEnd}`;
        }
        return number;
      };
      setNumberVal(formatPhoneNumber4(finalNumber));
    } else if (finalNumber.length === 10) {
      const formatPhoneNumber3 = (number: string): string => {
        const cleaned = number.replace(/\D/g, "");
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
          const maskedMiddle = match[2][0] + "**";
          const maskedEnd = "*" + match[3].slice(1);
          return `${match[1]}-${maskedMiddle}-${maskedEnd}`;
        }
        return number;
      };
      setNumberVal(formatPhoneNumber3(finalNumber));
    }
  }, [finalNumber]);

  // 최종 버튼 활성화 여부 체크
  useEffect(() => {
    if (finalSaveBtn && finalCardBtn) {
      setFinalBtn(true);
    } else {
      setFinalBtn(false);
    }
  }, [finalSaveBtn, finalCardBtn]);

  // 이름 마스킹 함수
  const formatName = (str: string): string => {
    if (!str) return "";
    return str[0] + "*".repeat(str.length - 1);
  };

  // 가격 포맷 함수
  const formatPrice = (price: number | undefined): string => {
    if (price === undefined) return "0";
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  // 주소 포맷 변경 함수
  const formatBtn = () => {
    setFinalSaveBtn(false);
    setAddressModalOpen(true);
  };

  // 결제 처리 함수
  const handlePayment = () => {
    if (!product || !sizeInfo || !finalName || !finalNumber) {
      alert("필수 정보가 누락되었습니다.");
      return;
    }

    setIsLoading(true);

    // IMP 초기화
    const { IMP } = window;
    const channelKey = process.env.REACT_APP_IMP_CHANNEL_KEY || "imp25812042"; // 환경변수 사용
    IMP.init(channelKey); // 포트원 가맹점 식별코드

    // 결제 요청
    IMP.request_pay(
      {
        pg: "html5_inicis",
        pay_method: "card",
        merchant_uid: `payment-${crypto.randomUUID()}`,
        name: product.name,
        amount: sizeInfo.purchasePrice + 3000, // 상품가격 + 배송비
        buyer_email: "user@example.com", // TODO: 실제 사용자 이메일로 대체
        buyer_name: finalName,
        buyer_tel: finalNumber,
        buyer_addr: `${finalRoadaddress} ${finalBuildingname} ${finalBetterAddress}`,
        buyer_postcode: finalZonecode,
      },
      async (response: any) => {
        if (response.success) {
          try {
            // 1. 주문 입찰 생성
            const orderBidRequest: OrderBidRequestDto = {
              productSizeId: 1, // TODO: 실제 상품 사이즈 ID로 대체
              bidPrice: sizeInfo.purchasePrice,
            };

            const orderId = await orderService.createOrderBid(orderBidRequest);

            // 2. 결제 및 배송 정보 처리
            const payAndShipmentRequest: PayAndShipmentRequestDto = {
              paymentRequest: {
                paymentMethod:
                  paymentBtn === 1
                    ? "CARD"
                    : paymentBtn === 2
                    ? "NAVER_PAY"
                    : paymentBtn === 3
                    ? "KAKAO_PAY"
                    : paymentBtn === 4
                    ? "TOSS_PAY"
                    : "PAYCO",
                amount: sizeInfo.purchasePrice + 3000,
                orderId: orderId,
                impUid: response.imp_uid,
                merchantUid: response.merchant_uid,
              },
              receiverName: finalName,
              receiverPhone: finalNumber,
              postalCode: finalZonecode,
              address: `${finalRoadaddress} ${finalBuildingname} ${finalBetterAddress}`,
              warehouseStorage: isWarehouseStorage,
            };

            await orderService.processPaymentAndShipment(
              orderId,
              payAndShipmentRequest
            );

            // 3. 결제 완료 페이지로 이동
            navigate("/buy/success", {
              state: {
                orderId: orderId,
                productInfo: product,
                sizeInfo: sizeInfo,
                totalAmount: sizeInfo.purchasePrice + 3000,
              },
            });
          } catch (error) {
            console.error("주문 처리 실패:", error);
            alert("주문 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
          }
        } else {
          alert(`결제에 실패했습니다: ${response.error_msg}`);
        }
        setIsLoading(false);
      }
    );
  };

  // 로딩 중일 때 표시
  if (isProductLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>구매 정보를 불러오는 중입니다...</p>
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

  return (
    <>
      <div className={styles.buyAll}>
        <div className={styles.container}>
          <div className={styles.divider} />

          {/* 상품 정보 섹션 */}
          <div className={styles.content}>
            <img
              src={product.thumbnailImageUrl}
              alt={product.name}
              className={styles.productImage}
            />
            <div className={styles.productDetails}>
              <p className={styles.productId}>{product.id}</p>
              <p className={styles.productEnglishName}>{product.englishName}</p>
              <p className={styles.productName}>{product.name}</p>
              <p className={styles.productSize}>{size}</p>
            </div>
          </div>

          <div className={styles.divider} />

          {/* 배송 주소 섹션 */}
          <div className={styles.delivery}>
            {finalSaveBtn ? (
              <>
                <div className={styles.sectionHeader}>
                  <h3 className={styles.sectionTitle}>배송 주소</h3>
                  <button onClick={formatBtn} className={styles.changeButton}>
                    변경
                  </button>
                </div>
                <div className={styles.addressInfo}>
                  <div className={styles.addressRow}>
                    <div className={styles.addressLabel}>받는 분</div>
                    <div className={styles.addressValue}>
                      {formatName(finalName)}
                    </div>
                  </div>
                  <div className={styles.addressRow}>
                    <div className={styles.addressLabel}>연락처</div>
                    <div className={styles.addressValue}>{numberVal}</div>
                  </div>
                  <div className={styles.addressRow}>
                    <div className={styles.addressLabel}>배송 주소</div>
                    <div className={styles.addressValue}>
                      ({finalZonecode}) {finalRoadaddress} ({finalBname},{" "}
                      {finalBuildingname}) {finalBetterAddress}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className={styles.sectionHeader}>
                  <h3 className={styles.sectionTitle}>배송 주소</h3>
                </div>
                <button
                  className={styles.noAddressButton}
                  onClick={() => setAddressModalOpen(true)}
                >
                  주소를 추가해주세요.
                </button>
              </>
            )}

            {/* 배송 요청사항 */}
            <button
              className={styles.requestButton}
              onClick={() => setRequestModalOpen(true)}
            >
              <span className={styles.requestText}>{requestOption}</span>
              <img src={arrowImg} alt="More" className={styles.arrowIcon} />
            </button>

            <div className={styles.deliverySeparator} />

            {/* 배송 방법 */}
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>배송 방법</h3>
            </div>
            <div className={styles.deliveryMethods}>
              <button
                className={`${styles.deliveryButton} ${
                  deliveryBtn === 1 ? styles.deliveryButtonActive : ""
                }`}
                onClick={() => {
                  setDeliveryBtn(1);
                  setIsWarehouseStorage(false);
                }}
              >
                <div className={styles.deliveryIconContainer}>
                  <img
                    src={deliveryImg}
                    alt="일반배송"
                    className={styles.deliveryIcon}
                  />
                </div>
                <div className={styles.deliveryInfo}>
                  <div className={styles.deliveryHeader}>
                    <span className={styles.deliveryType}>일반배송</span>
                    <span className={styles.deliveryCost}>3,000원</span>
                  </div>
                  <div className={styles.deliveryDescription}>
                    검수 후 배송 ・ 5-7일 내 도착 예정
                  </div>
                </div>
              </button>

              <button
                className={`${styles.deliveryButton} ${
                  deliveryBtn === 2 ? styles.deliveryButtonActive : ""
                }`}
                onClick={() => {
                  setDeliveryBtn(2);
                  setIsWarehouseStorage(true);
                }}
              >
                <div className={styles.deliveryIconContainer}>
                  <img
                    src={deliveryImg2}
                    alt="창고보관"
                    className={styles.deliveryIcon}
                  />
                </div>
                <div className={styles.deliveryInfo}>
                  <div className={styles.deliveryHeader}>
                    <span className={styles.deliveryType}>창고보관</span>
                    <span className={styles.deliveryCost}>첫 30일 무료</span>
                  </div>
                  <div className={styles.deliveryDescription}>
                    배송 없이 창고에 보관 ・ 빠르게 판매 가능
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div className={styles.divider} />

          {/* 결제 방식 섹션 */}
          <div className={styles.payment}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>결제 방식</h3>
            </div>
            <div className={styles.paymentMethod}>
              <div className={styles.paymentTitle}>
                일반 결제
                <span className={styles.paymentSubtitle}>일시불·할부</span>
              </div>

              <div className={styles.paymentButtonsRow}>
                <button
                  className={`${styles.paymentButton} ${
                    paymentBtn === 1 ? styles.paymentButtonActive : ""
                  }`}
                  onClick={() => {
                    setPaymentBtn(1);
                    setFinalCardBtn(true);
                  }}
                >
                  <span className={styles.paymentLabel}>신용카드</span>
                </button>
                <button
                  className={`${styles.paymentButton} ${
                    paymentBtn === 2 ? styles.paymentButtonActive : ""
                  }`}
                  onClick={() => {
                    setPaymentBtn(2);
                    setFinalCardBtn(true);
                  }}
                >
                  <span className={styles.paymentLabel}>네이버페이</span>
                  <img
                    src={naverImg}
                    alt="네이버페이"
                    className={styles.paymentIcon}
                  />
                </button>
                <button
                  className={`${styles.paymentButton} ${
                    paymentBtn === 3 ? styles.paymentButtonActive : ""
                  }`}
                  onClick={() => {
                    setPaymentBtn(3);
                    setFinalCardBtn(true);
                  }}
                >
                  <span className={styles.paymentLabel}>카카오페이</span>
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
                    paymentBtn === 4 ? styles.paymentButtonActive : ""
                  }`}
                  onClick={() => {
                    setPaymentBtn(4);
                    setFinalCardBtn(true);
                  }}
                >
                  <span className={styles.paymentLabel}>토스페이</span>
                  <img
                    src={tossImg}
                    alt="토스페이"
                    className={styles.paymentIcon}
                  />
                </button>
                <button
                  className={`${styles.paymentButton} ${
                    paymentBtn === 5 ? styles.paymentButtonActive : ""
                  }`}
                  onClick={() => {
                    setPaymentBtn(5);
                    setFinalCardBtn(true);
                  }}
                >
                  <span className={styles.paymentLabel}>페이코</span>
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

          <div className={styles.divider} />

          {/* 최종 주문정보 섹션 */}
          <div className={styles.finalPayment}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>최종 주문정보</h3>
            </div>
            <div className={styles.orderSummary}>
              <div className={styles.summaryRow}>
                <div className={styles.summaryLabel}>즉시 구매가</div>
                <div className={styles.summaryValue}>
                  {formatPrice(sizeInfo.purchasePrice)}원
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
                <div className={styles.summaryValue}>3,000원</div>
              </div>
            </div>
          </div>

          {/* 총 결제금액 섹션 */}
          <div className={styles.totalPayment}>
            <div className={styles.totalLabel}>총 결제금액</div>
            <div className={styles.totalAmountContainer}>
              <div className={styles.warning}>
                <strong>주의!</strong>
                <span>최근 거래가를 확인해주세요.</span>
              </div>
              <div className={styles.totalAmount}>
                {formatPrice(sizeInfo.purchasePrice + 3000)}원
              </div>
            </div>
          </div>

          {/* 결제하기 버튼 */}
          <div className={styles.actionSection}>
            {finalBtn ? (
              <button
                className={styles.buyButton}
                onClick={handlePayment}
                disabled={isLoading}
              >
                {formatPrice(sizeInfo.purchasePrice + 3000)}원・
                {deliveryBtn === 1 ? "일반배송" : "창고보관"} 결제하기
              </button>
            ) : (
              <button className={styles.disabledBuyButton} disabled>
                {formatPrice(sizeInfo.purchasePrice + 3000)}원・
                {deliveryBtn === 1 ? "일반배송" : "창고보관"} 결제하기
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 모달 컴포넌트 */}
      {isAddressModalOpen && (
        <DeliveryAddressModal
          isOpen={isAddressModalOpen}
          onClose={() => setAddressModalOpen(false)}
          onSave={(
            name,
            phoneNumber,
            zonecode,
            roadAddress,
            bname,
            buildingName,
            detailAddress
          ) => {
            setFinalName(name);
            setFinalNumber(phoneNumber);
            setFinalZonecode(zonecode);
            setFinalRoadaddress(roadAddress);
            setFinalBname(bname);
            setFinalBuildingname(buildingName);
            setFinalBetterAddress(detailAddress);
            setFinalSaveBtn(true);
            setAddressModalOpen(false);
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
    </>
  );
};

export default BuyForm;
