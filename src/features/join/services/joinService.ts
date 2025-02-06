import apiClient from "src/global/services/ApiClient";

export const fetchJoinData = async (
  email: string,
  password: string,
  shoeSize: string,
  code: string,
  isOver14: boolean,
  termsAgreement: boolean,
  privacyAgreement: boolean,
  optionalPrivacyAgreement: boolean,
  adConsent: boolean
) => {
  console.log("Fetching Join Data...");
  console.log(email);
  console.log(password);
  console.log(shoeSize);
  console.log(code);
  console.log(isOver14);
  console.log(termsAgreement);
  console.log(privacyAgreement);
  console.log(optionalPrivacyAgreement);
  console.log(adConsent);

  // return "ok";
  // return "no";

  try {
    const response = await apiClient.post("/users/register", {
      email: email,
      password: password,
      phoneNumber: "01011112222",
      shoeSize: "SIZE_" + shoeSize,
      isOver14: isOver14,
      termsAgreement: termsAgreement,
      privacyAgreement: privacyAgreement,
      optionalPrivacyAgreement: optionalPrivacyAgreement,
      adConsent: adConsent,
    });

    console.log(response.data); // API 응답 처리
    return response.data;
  } catch (error) {
    console.error("Error fetching join data with Axios:", error);
    return "no";
  }
};
