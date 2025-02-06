import axios from "axios";

export const fetchWomenSienneData = async () => {
  // console.log("Fetching women sienne Data...");

  return "no";

  try {
    const response = await axios.post('https://your-api-endpoint.com/womensienne', {

    });
    console.log(response.data); // API 응답 처리
    return response.data;
  } catch (error) {
    console.error("Error fetching women sienne data with Axios:", error);
    
  }

};