import axios from "axios";

export const fetchNewInData = async () => {
  // console.log("Fetching New In Data...");

  return "no";

  try {
    const response = await axios.post('https://your-api-endpoint.com/newin', {

    });
    console.log(response.data); // API 응답 처리
    return response.data;
  } catch (error) {
    console.error("Error fetching New In data with Axios:", error);
    
  }

};