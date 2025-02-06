import axios from "axios";

export const fetchPopularData = async () => {
  // console.log("Fetching discovery popular Data...");

  return "no";

  try {
    const response = await axios.post('https://your-api-endpoint.com/discoverypopular', {

    });
    console.log(response.data); // API 응답 처리
    return response.data;
  } catch (error) {
    console.error("Error fetching discovery popular data with Axios:", error);
    
  }

};