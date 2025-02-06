import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://www.pinjun.xyz/api", // 배포 환경용 URL
  withCredentials: true, // 쿠키 전송 허용
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
