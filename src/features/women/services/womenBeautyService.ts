import axios from "axios";

export const fetchWomenBeautyData = async () => {
  // console.log("Fetching women beauty Data...");

  return "no";

  try {
    const response = await axios.post('https://your-api-endpoint.com/womenbeauty', {

    });
    console.log(response.data); // API 응답 처리
    return response.data;
  } catch (error) {
    console.error("Error fetching women beauty data with Axios:", error);
    
  }

};