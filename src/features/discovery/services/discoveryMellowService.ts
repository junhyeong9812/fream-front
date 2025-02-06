import axios from "axios";

export const fetchDiscoveryMellowData = async () => {
  // console.log("Fetching discovery mellow Data...");

  return "no";

  try {
    const response = await axios.post('https://your-api-endpoint.com/discoverymellow', {

    });
    console.log(response.data); // API 응답 처리
    return response.data;
  } catch (error) {
    console.error("Error fetching discovery mellow data with Axios:", error);
    
  }

};