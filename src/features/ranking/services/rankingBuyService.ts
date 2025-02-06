import axios from "axios";

export const fetchRankingBuyData = async () => {
  // console.log("Fetching Ranking Buy Data...");

  return "no";

  try {
    const response = await axios.post('https://your-api-endpoint.com/rankingbuy', {

    });
    console.log(response.data); // API 응답 처리
    return response.data;
  } catch (error) {
    console.error("Error fetching ranking buy data with Axios:", error);
    
  }

};