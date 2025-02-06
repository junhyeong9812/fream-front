import axios from "axios";

export const fetchBlrLeebokData = async () => {
  // console.log("Fetching Blr Leebok Data...");

  return "no";

  try {
    const response = await axios.post('https://your-api-endpoint.com/blrleebok', {

    });
    console.log(response.data); // API 응답 처리
    return response.data;
  } catch (error) {
    console.error("Error fetching blrleebok data with Axios:", error);
    
  }

};