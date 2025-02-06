import axios from "axios";

export const fetchLuxuryHotData = async () => {
  // console.log("Fetching luxury Hot Data...");

  return "no";

  try {
    const response = await axios.post('https://your-api-endpoint.com/luxuryhot', {

    });
    console.log(response.data); // API 응답 처리
    return response.data;
  } catch (error) {
    console.error("Error fetching luxury hot data with Axios:", error);
    
  }

};