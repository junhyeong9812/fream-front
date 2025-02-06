import axios from "axios";

export const fetchRankingBrandData = async () => {
  // console.log("Fetching Ranking Brand Data...");

  return "no";

  try {
    const response = await axios.post('https://your-api-endpoint.com/rankingbrand', {

    });
    console.log(response.data); // API 응답 처리
    return response.data;
  } catch (error) {
    console.error("Error fetching ranking brand data with Axios:", error);
    
  }

};