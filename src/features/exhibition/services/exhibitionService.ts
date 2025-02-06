import axios from "axios";

export const fetchExhibitionData = async () => {
  // console.log("Fetching Exhibition Data...");

  try {
    // 실제 HTTP 요청 or 로컬스토리지 or 다른 로직...
    // 성공 시: return 전시데이터 배열
    // 실패 시: return 'no'
  } catch (error) {
    return "no";
  }

  // try {
  //   const response = await axios.post('https://your-api-endpoint.com/exhibition', {

  //   });
  //   console.log(response.data); // API 응답 처리
  //   return response.data;
  // } catch (error) {
  //   console.error("Error fetching exhibition data with Axios:", error);

  // }
};
