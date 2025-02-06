import axios from "axios";

export const fetchWinterData = async () => {
  // console.log("Fetching Winter Data...");

  return "no";

  try {
    const response = await axios.post('https://your-api-endpoint.com/winter', {

    });
    console.log(response.data); // API 응답 처리
    return response.data;
  } catch (error) {
    console.error("Error fetching winter data with Axios:", error);
    
  }

};