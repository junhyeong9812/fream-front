import axios from "axios";

export const fetchMenPopularData = async () => {
  // console.log("Fetching men popular Data...");

  return "no";

  try {
    const response = await axios.post('https://your-api-endpoint.com/menpopular', {

    });
    console.log(response.data); // API 응답 처리
    return response.data;
  } catch (error) {
    console.error("Error fetching men popular data with Axios:", error);
    
  }

};