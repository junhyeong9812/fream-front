import axios from "axios";

export const fetchMenJacketData = async () => {
  // console.log("Fetching men jacket Data...");

  return "no";

  try {
    const response = await axios.post('https://your-api-endpoint.com/menjacket', {

    });
    console.log(response.data); // API 응답 처리
    return response.data;
  } catch (error) {
    console.error("Error fetching men jacket data with Axios:", error);
    
  }

};