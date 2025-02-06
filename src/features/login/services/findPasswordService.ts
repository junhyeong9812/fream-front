import axios from "axios";

export const fetchFindPasswordData = async (phone: string, email: string) => {
  console.log("Fetching FindPassword Data...");
  console.log(phone);
  console.log(email);

  try {
    const response = await axios.post('http://3.34.123.19:8080/api/users/reset-password-sandEmail', {
      email: email,
      phoneNumber: phone
    });
    
    console.log(response.data); // API 응답 처리
    return response.data;
  } catch (error) {
    console.error("Error fetching find password data with Axios:", error);
    return "no";
  }

};