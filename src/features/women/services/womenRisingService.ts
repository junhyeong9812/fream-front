import axios from "axios";

export const fetchWomenRisingData = async () => {
  // console.log("Fetching women rising Data...");

  return "no";

  try {
    const response = await axios.post('https://your-api-endpoint.com/womenrising', {

    });
    console.log(response.data); // API 응답 처리
    return response.data;
  } catch (error) {
    console.error("Error fetching women rising data with Axios:", error);
    
  }

};