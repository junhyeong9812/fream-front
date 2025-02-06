import apiClient from "src/global/services/ApiClient";

export const fetchLoginData = async (email: string, password: string) => {
  console.log("Fetching Login Data...");
  // console.log(email);
  // console.log(password);

  try {
    const response = await apiClient.post("/auth/login", {
      email: email,
      password: password,
    });

    console.log(response.data); // API 응답 처리
    return response.data;
  } catch (error) {
    console.error("Error fetching login data with Axios:", error);
    return "no";
  }
};
