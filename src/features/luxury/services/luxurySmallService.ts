import axios from "axios";

export const fetchLuxurySmallData = async () => {
  // console.log("Fetching luxury small Data...");

  return "no";

  try {
    const response = await axios.post('https://your-api-endpoint.com/luxurysmall', {

    });
    console.log(response.data); // API 응답 처리
    return response.data;
  } catch (error) {
    console.error("Error fetching luxury small data with Axios:", error);
    
  }

};