import axios from "axios";

export const fetchJustDroppedData = async () => {
  // console.log("Fetching Just Dropped Data...");

  return "no";

  try {
    const response = await axios.post('https://your-api-endpoint.com/justdropped', {

    });
    console.log(response.data); // API 응답 처리
    return response.data;
  } catch (error) {
    console.error("Error fetching just dropped data with Axios:", error);
    
  }

};