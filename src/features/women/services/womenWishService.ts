import axios from "axios";

export const fetchWomenWishData = async () => {
  // console.log("Fetching women wish Data...");

  return "no";

  try {
    const response = await axios.post('https://your-api-endpoint.com/womenwish', {

    });
    console.log(response.data); // API 응답 처리
    return response.data;
  } catch (error) {
    console.error("Error fetching women wish data with Axios:", error);
    
  }

};