import axios from "axios";

export const fetchMufflerData = async () => {
  // console.log("Fetching Muffler Data...");

  return "no";

  try {
    const response = await axios.post('https://your-api-endpoint.com/muffler', {

    });
    console.log(response.data); // API 응답 처리
    return response.data;
  } catch (error) {
    console.error("Error fetching muffler data with Axios:", error);
    
  }

};