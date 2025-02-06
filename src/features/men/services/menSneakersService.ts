import axios from "axios";

export const fetchMenSneakersData = async () => {
  // console.log("Fetching men sneakers Data...");

  return "no";

  try {
    const response = await axios.post('https://your-api-endpoint.com/mensneakers', {

    });
    console.log(response.data); // API 응답 처리
    return response.data;
  } catch (error) {
    console.error("Error fetching men sneakers data with Axios:", error);
    
  }

};