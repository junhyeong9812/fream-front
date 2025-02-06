import axios from "axios";

export const fetchWomenPopularData = async () => {
  // console.log("Fetching women popular Data...");

  return "no";

  try {
    const response = await axios.post('https://your-api-endpoint.com/womenpopular', {

    });
    console.log(response.data); // API 응답 처리
    return response.data;
  } catch (error) {
    console.error("Error fetching women popular data with Axios:", error);
    
  }

};