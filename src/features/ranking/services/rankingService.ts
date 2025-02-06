import axios from "axios";

export const fetchRankingData = async () => {
  // console.log("Fetching Ranking Data...");

  return "no";

  try {
    const response = await axios.post('https://your-api-endpoint.com/ranking', {

    });
    console.log(response.data); // API 응답 처리
    return response.data;
  } catch (error) {
    console.error("Error fetching ranking data with Axios:", error);
    
  }

};