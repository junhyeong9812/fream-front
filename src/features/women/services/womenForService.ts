import axios from "axios";

export const fetchWomenForData = async () => {
  // console.log("Fetching women for Data...");

  return "no";

  try {
    const response = await axios.post('https://your-api-endpoint.com/womenfor', {

    });
    console.log(response.data); // API 응답 처리
    return response.data;
  } catch (error) {
    console.error("Error fetching women for data with Axios:", error);
    
  }

};