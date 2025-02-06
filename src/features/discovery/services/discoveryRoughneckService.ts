import axios from "axios";

export const fetchDiscoveryRoughneckData = async () => {
  // console.log("Fetching discovery roughneck Data...");

  return "no";

  try {
    const response = await axios.post('https://your-api-endpoint.com/discoveryroughneck', {

    });
    console.log(response.data); // API 응답 처리
    return response.data;
  } catch (error) {
    console.error("Error fetching discovery roughneck data with Axios:", error);
    
  }

};