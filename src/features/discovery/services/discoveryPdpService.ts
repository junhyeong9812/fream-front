import apiClient from "src/global/services/ApiClient";

export const fetchDiscoveryPdpData = async () => {
  try {
    const response = await apiClient.get("/products/query");

    // API 응답을 프론트엔드 포맷으로 변환
    return response.data.content.map((item: any) => ({
      transaction: item.tradeCount?.toString() || "0", // 거래 수
      img: item.thumbnailImageUrl, // 썸네일 URL
      backgroundcolor: "#f4f4f4", // 기본값
      brand: item.brandName || "Unknown", // 브랜드명이 없다면 Unknown
      name: item.name, // 상품명
      price: item.price?.toLocaleString() || item.releasePrice.toLocaleString(), // 가격
      buy: true, // 기본값으로 true 설정
      coupon: false, // 기본값으로 false 설정
      earn: false, // 기본값으로 false 설정
    }));
  } catch (error) {
    console.error("상품 조회 실패:", error);
    return "no";
  }
  // console.log("Fetching discovery pdp Data...");

  // try {
  //   const response = await axios.post('https://your-api-endpoint.com/discoverypdp', {

  //   });
  //   console.log(response.data); // API 응답 처리
  //   return response.data;
  // } catch (error) {
  //   console.error("Error fetching discovery pdp data with Axios:", error);

  // }
  // return "no";
};
