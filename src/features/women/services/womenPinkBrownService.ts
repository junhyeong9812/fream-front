import axios from "axios";

export const fetchWomenPinkBrownData = async () => {
  // console.log("Fetching women pink brown Data...");

  return "no";

  try {
    const response = await axios.post('https://your-api-endpoint.com/womenpinkbrown', {

    });
    console.log(response.data); // API 응답 처리
    return response.data;
  } catch (error) {
    console.error("Error fetching women pink brown data with Axios:", error);
    
  }

};