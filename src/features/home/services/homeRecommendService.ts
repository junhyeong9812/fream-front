import axios from "axios";

export const fetchRecommendData = async () => {
  // console.log("Fetching Recommend Data...");

  return "no";

  try {
    const response = await axios.post('https://your-api-endpoint.com/recommend', {

    });
    console.log(response.data); // API 응답 처리
    return response.data;
  } catch (error) {
    console.error("Error fetching recommend data with Axios:", error);
    
  }

};