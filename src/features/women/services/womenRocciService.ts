import axios from "axios";

export const fetchWomenRocciData = async () => {
  // console.log("Fetching women rocci Data...");

  return "no";

  try {
    const response = await axios.post('https://your-api-endpoint.com/womenrocci', {

    });
    console.log(response.data); // API 응답 처리
    return response.data;
  } catch (error) {
    console.error("Error fetching women rocci data with Axios:", error);
    
  }

};