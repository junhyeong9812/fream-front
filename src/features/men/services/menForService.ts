import axios from "axios";

export const fetchMenForData = async () => {
  // console.log("Fetching men for Data...");

  return "no";

  try {
    const response = await axios.post('https://your-api-endpoint.com/menfor', {

    });
    console.log(response.data); // API 응답 처리
    return response.data;
  } catch (error) {
    console.error("Error fetching men for data with Axios:", error);
    
  }

};