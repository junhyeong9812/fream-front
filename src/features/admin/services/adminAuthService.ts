import apiClient from "src/global/services/ApiClient";
import {
  AdminLoginStatus,
  AdminLoginResponse,
  AdminTokenResponse,
} from "src/features/admin/types/AdminLoginTypes";

// 로컬 스토리지 키 상수
const ADMIN_LOGIN_STATUS_KEY = "isAdminLoggedIn";

/**
 * 관리자 로그인 요청 함수
 * @param email 관리자 이메일
 * @param password 관리자 비밀번호
 * @returns 로그인 성공 시 "yes", 실패 시 "no" 또는 오류 메시지
 */
export const fetchAdminLoginData = async (
  email: string,
  password: string
): Promise<string> => {
  console.log("adminAuthService: 로그인 요청 시작", { email });

  try {
    // 실제 API 호출
    const response = await apiClient.post("/admin/auth/login", {
      email,
      password,
    });

    console.log("adminAuthService: 로그인 응답 받음", {
      status: response.status,
    });

    // 서버 응답이 성공이면 로그인 상태 저장
    if (response.status === 200) {
      console.log("adminAuthService: 로그인 성공");

      // 로그인 상태 저장
      const loginStatus: AdminLoginStatus = {
        value: "true",
        expire: Date.now() + 24 * 60 * 60 * 1000, // 24시간 (리프레시 토큰의 만료시간과 일치)
      };
      localStorage.setItem(ADMIN_LOGIN_STATUS_KEY, JSON.stringify(loginStatus));

      return "yes";
    }

    console.log("adminAuthService: 로그인 실패");
    return "no";
  } catch (error) {
    console.error("adminAuthService: 로그인 중 오류:", error);

    // 에러 상세 정보 확인
    if (error.response) {
      console.log("adminAuthService: 에러 응답", {
        status: error.response.status,
        data: error.response.data,
      });

      // 관리자 권한 없음
      if (error.response.status === 403) {
        return "not_admin";
      }
      // 로그인 정보 불일치
      else if (error.response.status === 401) {
        return "invalid_credentials";
      }
    }

    return "no";
  }
};

/**
 * 관리자 로그인 상태 확인
 * @returns 로그인 상태 여부 (true/false)
 */
export const checkAdminLoginStatus = async (): Promise<boolean> => {
  console.log("adminAuthService: 로그인 상태 확인 시작");

  // 로그인 상태 확인
  const loginDataStr = localStorage.getItem(ADMIN_LOGIN_STATUS_KEY);
  if (!loginDataStr) {
    console.log("adminAuthService: 로그인 상태 정보 없음");
    return false;
  }

  try {
    console.log("adminAuthService: 저장된 로그인 상태", { loginDataStr });

    // 이전 방식 (문자열로만 저장된 경우) 처리
    if (loginDataStr === "true") {
      console.log("adminAuthService: 이전 방식 로그인 정보 확인");

      // 업데이트된 형식으로 저장
      const loginStatus: AdminLoginStatus = {
        value: "true",
        expire: Date.now() + 24 * 60 * 60 * 1000, // 24시간
      };
      localStorage.setItem(ADMIN_LOGIN_STATUS_KEY, JSON.stringify(loginStatus));

      return true;
    }

    // 새 방식 (객체로 저장된 경우)
    const loginData = JSON.parse(loginDataStr) as AdminLoginStatus;
    console.log("adminAuthService: 새 방식 로그인 정보 확인", {
      value: loginData.value,
      expire: loginData.expire,
      currentTime: Date.now(),
      isExpired: loginData.expire <= Date.now(),
    });

    // 만료 시간이 지났는지 확인
    if (loginData.expire <= Date.now() || loginData.value !== "true") {
      console.log("adminAuthService: 로그인 상태 만료됨");

      // API 호출을 통해 토큰이 유효한지 확인
      try {
        const isValid = await isAdminTokenValid();
        if (isValid) {
          console.log("adminAuthService: 토큰 유효함, 로그인 상태 갱신");

          // 로그인 상태 업데이트
          const newLoginStatus: AdminLoginStatus = {
            value: "true",
            expire: Date.now() + 24 * 60 * 60 * 1000,
          };
          localStorage.setItem(
            ADMIN_LOGIN_STATUS_KEY,
            JSON.stringify(newLoginStatus)
          );

          return true;
        }
      } catch (error) {
        console.log("adminAuthService: 토큰 검증 실패, 로그아웃 필요");
        return false;
      }

      return false;
    }

    console.log("adminAuthService: 로그인 상태 유효함");
    return true;
  } catch (e) {
    console.error("adminAuthService: 로그인 상태 확인 중 오류:", e);
    return false;
  }
};

/**
 * 관리자 토큰 유효성 확인을 위한 API 호출
 * @returns 토큰 유효 여부
 */
export const isAdminTokenValid = async (): Promise<boolean> => {
  try {
    // 토큰 유효성 확인 API 호출
    const response = await apiClient.get("/admin/auth/check");
    return response.status === 200;
  } catch (error) {
    console.log("adminAuthService: 토큰 유효성 확인 실패", error);
    return false;
  }
};

/**
 * 관리자 토큰 갱신
 * @returns 성공 여부를 포함한 Promise
 */
export const refreshAdminToken = async (): Promise<boolean> => {
  console.log("adminAuthService: 토큰 갱신 시도");

  try {
    const response = await apiClient.post("/admin/auth/refresh");

    console.log("adminAuthService: 토큰 갱신 응답 받음", {
      status: response.status,
    });

    if (response.status === 200) {
      console.log("adminAuthService: 토큰 갱신 성공");

      // 로그인 상태 갱신
      const loginStatus: AdminLoginStatus = {
        value: "true",
        expire: Date.now() + 24 * 60 * 60 * 1000, // 24시간
      };
      localStorage.setItem(ADMIN_LOGIN_STATUS_KEY, JSON.stringify(loginStatus));

      return true;
    }

    console.log("adminAuthService: 토큰 갱신 실패");
    return false;
  } catch (error) {
    console.error("adminAuthService: 토큰 갱신 중 오류:", error);

    // 갱신 실패 시 로그아웃 처리 (선택적)
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      console.log(
        "adminAuthService: 토큰 갱신 실패 - 권한 없음, 로그아웃 처리"
      );
      adminLogout();
    }

    return false;
  }
};

/**
 * 관리자 로그아웃 함수
 * 서버에 로그아웃 요청 및 로컬 스토리지에서 로그인 정보 제거
 */
export const adminLogout = async (): Promise<boolean> => {
  console.log("adminAuthService: 로그아웃 시작");

  try {
    await apiClient.post("/admin/auth/logout");
    console.log("adminAuthService: 서버 로그아웃 요청 성공");
    localStorage.removeItem(ADMIN_LOGIN_STATUS_KEY);
    return true;
  } catch (error) {
    console.error("adminAuthService: 관리자 로그아웃 중 오류:", error);
    // 오류가 발생해도 로컬 스토리지는 초기화
    localStorage.removeItem(ADMIN_LOGIN_STATUS_KEY);
    return false;
  }
};

/**
 * 관리자 이메일 찾기
 * @param phone 휴대폰 번호
 * @returns 성공 시 이메일, 실패 시 "no" 또는 오류 메시지
 */
export const fetchAdminFindEmailData = async (
  phone: string
): Promise<string> => {
  try {
    const response = await apiClient.post<string>("/admin/auth/find-email", {
      phoneNumber: formatPhoneNumber(phone),
    });

    if (response.status === 200) {
      return response.data; // 이메일 주소 반환
    }

    return "no";
  } catch (error) {
    console.error("관리자 이메일 찾기 중 오류:", error);

    // 에러 응답에 따른 처리
    if (error.response && error.response.status === 403) {
      return "not_admin"; // 관리자 계정이 아님
    }

    return "no";
  }
};

/**
 * 관리자 비밀번호 찾기
 * @param phone 휴대폰 번호
 * @param email 이메일
 * @returns 성공 시 "yes", 실패 시 "no" 또는 오류 메시지
 */
export const fetchAdminFindPasswordData = async (
  phone: string,
  email: string
): Promise<string> => {
  try {
    const response = await apiClient.post("/admin/auth/find-password", {
      phoneNumber: formatPhoneNumber(phone),
      email,
    });

    if (response.status === 200) {
      return "yes";
    }

    return "no";
  } catch (error) {
    console.error("관리자 비밀번호 찾기 중 오류:", error);

    // 에러 응답에 따른 처리
    if (error.response) {
      if (error.response.status === 403) {
        return "not_admin"; // 관리자 계정이 아님
      } else if (error.response.status === 400) {
        return "invalid_phone"; // 전화번호 불일치
      }
    }

    return "no";
  }
};

/**
 * 전화번호 포맷 변경 함수
 * @param number 전화번호 (숫자만)
 * @returns 포맷된 전화번호 (예: 010-1234-5678)
 */
const formatPhoneNumber = (number: string) => {
  if (number.length === 11) {
    // "01012345678" -> "010-1234-5678"
    return number.replace(/^(\d{3})(\d{4})(\d{4})$/, "$1-$2-$3");
  } else if (number.length === 10) {
    // "0101234567" -> "010-123-4567"
    return number.replace(/^(\d{3})(\d{3})(\d{4})$/, "$1-$2-$3");
  }
  return number;
};
