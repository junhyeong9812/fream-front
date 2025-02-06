import axios from "axios";

export const fetchPeachesData = async () => {
  // console.log("Fetching Peaches Data...");

  return "no";

  try {
    const response = await axios.post('https://your-api-endpoint.com/peaches', {

    });
    console.log(response.data); // API 응답 처리
    return response.data;
  } catch (error) {
    console.error("Error fetching peaches data with Axios:", error);
    
  }

};