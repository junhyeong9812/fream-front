import axios from "axios";

export const fetchDiscoverySomethingData = async () => {
  // console.log("Fetching discovery something Data...");

  return "no";

  try {
    const response = await axios.post('https://your-api-endpoint.com/discoverysomething', {

    });
    console.log(response.data); // API 응답 처리
    return response.data;
  } catch (error) {
    console.error("Error fetching discovery something data with Axios:", error);
    
  }

};