import axios from "axios";

export const fetchFindEmailData = async (phone: string) => {
  console.log("Fetching FindEmail Data...");
  console.log(phone);
  
  try {
    const response = await axios.post('http://3.34.123.19:8080/api/users/find-email', {
      phoneNumber: phone,
    });
    
    console.log(response.data); // API 응답 처리
    return response.data;
  } catch (error) {
    console.error("Error fetching find email data with Axios:", error);
    return "no";
  }

};