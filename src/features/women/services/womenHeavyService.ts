import axios from "axios";

export const fetchWomenHeavyData = async () => {
  // console.log("Fetching women heavy Data...");

  return "no";

  try {
    const response = await axios.post('https://your-api-endpoint.com/womenheavy', {

    });
    console.log(response.data); // API 응답 처리
    return response.data;
  } catch (error) {
    console.error("Error fetching women haevy data with Axios:", error);
    
  }

};