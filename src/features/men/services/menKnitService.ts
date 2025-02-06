import axios from "axios";

export const fetchMenKnitData = async () => {
  // console.log("Fetching men knit Data...");

  return "no";

  try {
    const response = await axios.post('https://your-api-endpoint.com/menknit', {

    });
    console.log(response.data); // API 응답 처리
    return response.data;
  } catch (error) {
    console.error("Error fetching men knit data with Axios:", error);
    
  }

};