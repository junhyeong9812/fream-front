import axios from "axios";

export const fetchTransactionData = async () => {
  // console.log("Fetching transaction Data...");

  return "no";

  try {
    const response = await axios.post('https://your-api-endpoint.com/transaction', {

    });
    console.log(response.data); // API 응답 처리
    return response.data;
  } catch (error) {
    console.error("Error fetching transaction data with Axios:", error);
    
  }

};