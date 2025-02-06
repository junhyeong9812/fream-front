import axios from "axios";

export const fetchMenChoiceData = async () => {
  // console.log("Fetching men choice Data...");

  return "no";

  try {
    const response = await axios.post('https://your-api-endpoint.com/menchoice', {

    });
    console.log(response.data); // API 응답 처리
    return response.data;
  } catch (error) {
    console.error("Error fetching men choice data with Axios:", error);
    
  }

};