import axios from "axios";
import apiClient from "src/global/services/ApiClient";

export const fetchFindEmailData = async (phone: string) => {
  console.log("Fetching FindEmail Data...");
  console.log(phone);
  
  try {
    const response = await apiClient.post('/users/find-email', {
      phoneNumber: phone,
    });
    
    console.log(response.data); // API 응답 처리
    return response.data;
  } catch (error) {
    console.error("Error fetching find email data with Axios:", error);
    return "no";
  }

};