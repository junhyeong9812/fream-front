import axios from "axios";

export const fetchDiscoveryPdpData = async () => {
  // console.log("Fetching discovery pdp Data...");

  return "no";

  try {
    const response = await axios.post('https://your-api-endpoint.com/discoverypdp', {

    });
    console.log(response.data); // API 응답 처리
    return response.data;
  } catch (error) {
    console.error("Error fetching discovery pdp data with Axios:", error);
    
  }

};