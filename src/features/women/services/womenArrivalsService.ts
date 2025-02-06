import axios from "axios";

export const fetchWomenArrivalsData = async () => {
  // console.log("Fetching women arrivals Data...");

  return "no";

  try {
    const response = await axios.post('https://your-api-endpoint.com/womenarrivals', {

    });
    console.log(response.data); // API 응답 처리
    return response.data;
  } catch (error) {
    console.error("Error fetching women arrivals data with Axios:", error);
    
  }

};