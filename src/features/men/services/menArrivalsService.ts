import axios from "axios";

export const fetchMenArrivalsData = async () => {
  // console.log("Fetching men arrivals Data...");

  return "no";

  try {
    const response = await axios.post('https://your-api-endpoint.com/menarrivals', {

    });
    console.log(response.data); // API 응답 처리
    return response.data;
  } catch (error) {
    console.error("Error fetching men arrivals data with Axios:", error);
    
  }

};