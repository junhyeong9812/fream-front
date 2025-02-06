import axios from "axios";

export const fetchMostPopularData = async () => {
  // console.log("Fetching Most Popular Data...");

  return "no";

  try {
    const response = await axios.post('https://your-api-endpoint.com/mostpopular', {

    });
    console.log(response.data); // API 응답 처리
    return response.data;
  } catch (error) {
    console.error("Error fetching most popular data with Axios:", error);
    
  }

};