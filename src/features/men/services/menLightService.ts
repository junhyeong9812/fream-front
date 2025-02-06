import axios from "axios";

export const fetchMenLightData = async () => {
  // console.log("Fetching men light Data...");

  return "no";

  try {
    const response = await axios.post('https://your-api-endpoint.com/menlight', {

    });
    console.log(response.data); // API 응답 처리
    return response.data;
  } catch (error) {
    console.error("Error fetching men light data with Axios:", error);
    
  }

};