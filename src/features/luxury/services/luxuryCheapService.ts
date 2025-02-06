import axios from "axios";

export const fetchLuxuryCheapData = async () => {
  // console.log("Fetching luxury cheap Data...");

  return "no";

  try {
    const response = await axios.post('https://your-api-endpoint.com/luxurycheap', {

    });
    console.log(response.data); // API 응답 처리
    return response.data;
  } catch (error) {
    console.error("Error fetching luxury cheap data with Axios:", error);
    
  }

};