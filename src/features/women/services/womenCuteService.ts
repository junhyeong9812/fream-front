import axios from "axios";

export const fetchWomenCuteData = async () => {
  // console.log("Fetching women cute Data...");

  return "no";

  try {
    const response = await axios.post('https://your-api-endpoint.com/womencute', {

    });
    console.log(response.data); // API 응답 처리
    return response.data;
  } catch (error) {
    console.error("Error fetching women cute data with Axios:", error);
    
  }

};