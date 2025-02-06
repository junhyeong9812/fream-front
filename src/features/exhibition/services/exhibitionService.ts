import axios from "axios";

export const fetchExhibitionData = async () => {
  // console.log("Fetching Exhibition Data...");

  return "no";

  try {
    const response = await axios.post('https://your-api-endpoint.com/exhibition', {

    });
    console.log(response.data); // API 응답 처리
    return response.data;
  } catch (error) {
    console.error("Error fetching exhibition data with Axios:", error);
    
  }

};