import axios from "axios";

export const fetchLuxuryWishData = async () => {
  // console.log("Fetching luxury Wish Data...");

  return "no";

  try {
    const response = await axios.post('https://your-api-endpoint.com/luxurywish', {

    });
    console.log(response.data); // API 응답 처리
    return response.data;
  } catch (error) {
    console.error("Error fetching luxury wish data with Axios:", error);
    
  }

};