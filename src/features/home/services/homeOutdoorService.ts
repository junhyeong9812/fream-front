import axios from "axios";

export const fetchOutdoorData = async () => {
  // console.log("Fetching Outdoor Data...");

  return "no";

  try {
    const response = await axios.post('https://your-api-endpoint.com/outdoor', {

    });
    console.log(response.data); // API 응답 처리
    return response.data;
  } catch (error) {
    console.error("Error fetching outdoor data with Axios:", error);
    
  }

};